const passport = require('passport')
const User = require('../models/User')

const requireAuth = (req, res, next) => (req.user ? next() : res.sendStatus(403))

module.exports = app => {

  //CREATE USER
  app.post('/api/users', (req, res) => {
    const { firstName, lastName, email, password } = req.body
    const newUser = new User({
      firstName,
      lastName,
      email
    })

    User.register(newUser, password, (err) => {
      if (err) {
        return err.name === 'UserExistsError'
          ? res.status(400).send(err)
          : res.status(500).send(err)
      }

      return passport.authenticate('local', err => {
        if (err) return res.send(403).send(err)
        return res.sendStatus(201)
      })(req, res)
    })
  })

  //UPDATE USER
  app.put('/api/users', requireAuth, (req, res) => {
    const { 
      firstName = req.user.firstName, 
      lastName = req.user.lastName, 
      email = req.user.email 
    } = req.body

    const { user } = req

    user.set({
      firstName,
      lastName,
      email
    })

    user.save((err, updUser) => {
      if (err) return res.status(500).send(err)
      req.login(updUser, err => { 
        if (err) return res.status(401).send(err)
        return res.sendStatus(202) 
      })
    })
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


  //AUTHENTICATE USER
  app.post('/api/login', (req, res) => {
    passport.authenticate('local', {
      successRedirect: '/api/current_user'
    })(req, res)
  })

  //LOGOUT
  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  //FETCH USER
  app.get('/api/current_user', requireAuth, (req, res) => {
    res.send(req.user)
  })
}