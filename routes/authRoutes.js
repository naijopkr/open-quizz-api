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
    req.user = { fistName, lastName, email } = req.body
    User.findByIdAndUpdate(req.user._id, req.user, (err, user) => {
      if (err) {
        res.send(err)
      } else {
        res.send(req.user)
      }
    })
  })

  app.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (!user) { 
        res.json({ message: 'Usuário ou senha incorretos.', status: 401 }) 
      } else {
        req.logIn(user, (err) => {
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