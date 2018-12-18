const passport = require('passport')
const User = require('../models/User')

module.exports = app => {
  app.post('/api/users', (req, res) => {
    const { firstName, lastName, email, password } = req.body
    const newUser = new User({
      firstName,
      lastName,
      email
    })
    User.register(newUser, password, (err, user) => {
      if (err) {
        if (err.name === 'UserExistsError' || err.code == 11000) {
          res.json({ message: 'Usuário já cadastrado', status: 400 })
        }
      } else {
        passport.authenticate('local')(req, res, () => {
          res.send(user)
        })
      }
    })
  })

  app.put('/api/users', (req, res) => {
    const { firstName, lastName, email } = req.body
    const updatedUser = {
      ...req.user,
      firstName,
      lastName,
      email
    }
    User.findByIdAndUpdate(updatedUser._id, updatedUser, (err, user) => {
      if (err) {
        res.send(err)
      } else {
        res.send(user)
      }
    })
  })

  app.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user) => {
      if (err) {
        console.log(err)
      }

      if (!user) { 
        res.json({ message: 'Usuário ou senha incorretos.', status: 401 }) 
      } else {
        req.logIn(user, (err) => {
          if (err) {
            console.log(err)
          }
          
          res.send(user)
        })
      }
    })(req, res, next)
  })

  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  app.get('/api/current_user', (req, res) => {
    res.send(req.user)
  })
}