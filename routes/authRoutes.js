const passport = require('passport')
const crypto = require('crypto')
const sgMail = require('@sendgrid/mail')

const keys = require('../config/keys')

const User = require('../models/User')

const requireAuth = (req, res, next) => (req.user ? next() : res.sendStatus(403))

sgMail.setApiKey(keys.sendGrid)

module.exports = app => {

  //CREATE USER
  app.post('/api/users', (req, res) => {
    const { firstName, lastName, email, password } = req.body
    const newUser = new User({
      firstName,
      lastName,
      email
    })

    User.register(newUser, password, (err, user) => {
      if (err) {
        return err.name === 'UserExistsError'
          ? res.status(400).send(err)
          : res.status(500).send(err)
      }

      passport.authenticate('local', err => {
        if (err) return res.sendStatus(403)
        req.login(user, err => { if (err) return res.sendStatus(403) })
        return res.sendStatus(201)
      })(req, res)
    })
  })

  //UPDATE USER
  app.put('/api/users', requireAuth, async (req, res) => {
    const { 
      firstName = req.user.firstName, 
      lastName = req.user.lastName, 
      email
    } = req.body

    const { user } = req

    user.set({
      firstName,
      lastName
    })

    if (email && email !== req.user.email) {
      const count = await User.countDocuments({ email })
      if (count) {
        return res.status(400).send('E-mail is already in use')
      }
      user.set({ email })
    }
    
    const savedUser = await user.save()
    req.login(savedUser, err => { if (err) console.log(err) })
    return res.sendStatus(202)
  })

  //CHANGE PASSWORD
  app.put('/api/changePassword', requireAuth, (req, res) => {
    const { password } = req.body

    const { user } = req

    user.setPassword(password, (err, updUser) => {
      if (err) return res.status(500).send(err)

      updUser.save()
      res.sendStatus(202)
    })
  })

  //FORGOT PASSWORD
  app.post('/api/forgot', async (req, res) => {
    const token = await crypto.randomBytes(20).toString('hex')
    const user  = await User.findOne({ email: req.body.email })
    
    if (!user) { return res.sendStatus(404) }
    user.resetPasswordToken = token
    user.resetPasswordExpires = Date.now() + 1000*60*60
    user.save()

    const text = 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
      'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
      'http://' + req.headers.host + '/reset/' + token + '\n\n' +
      'If you did not request this, please ignore this email and your password will remain unchanged.\n'

    const mail = {
      to: 'barcellos.ariel@gmail.com',
      from: 'forgot-password@openquizz.com',
      subject: 'OpenQuizz Password Reset',
      text
    }

    sgMail.send(mail, false, (err, result) => {
      if (err) { return res.status(500).send(err) }
      console.log(result)
      res.send(result)
    })
  })


  //AUTHENTICATE USER
  app.post('/api/login', (req, res) => {
    passport.authenticate('local', {
      successRedirect: '/api/user'
    })(req, res)
  })

  //LOGOUT
  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  //FETCH USER
  app.get('/api/user', requireAuth, (req, res) => {
    const user = req.user.toObject()
    delete user.resetPasswordExpires
    delete user.resetPasswordToken
    res.send(user)
  })
}