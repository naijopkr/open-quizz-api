const passport = require('passport')
const User = require('../models/User')

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
        if (err.name === 'UserExistsError' || err.code == 11000) {
          res.send({ message: 'Usuário já cadastrado', status: 400 })
        } else {
          console.log(err)
          res.send(err)
        }
      } else {
        passport.authenticate('local')(req, res, () => {
          res.redirect('/api/current_user')
        })
      }
    })
  })

  //UPDATE USER
  //TODO: Handle updating e-mail (username)
  app.put('/api/users', (req, res) => {
    const { firstName, lastName } = req.body
    const user = {
      firstName,
      lastName
    }

    User.findByIdAndUpdate(req.user._id, user, (err) => {
      if (err) {
        res.send(err)
      } else {
        res.redirect('/api/current_user')
      }
    })
  })

  //AUTHENTICATE USER
  app.post('/api/login', (req, res, next) => {

    passport.authenticate('local', (err, user) => {
      if (err) {
        return next(err)
      }

      if (!user) { 
        res.send({ message: 'Usuário ou senha incorretos.', status: 401 }) 
      } else {
        req.logIn(user, (err) => {
          if (err) {
            console.log(err)
          }
          
          res.redirect('/api/current_user')
        })
      }
    })(req, res, next)
  })

  //LOGOUT
  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  //FETCH USER
  app.get('/api/current_user', (req, res) => {
    res.send(req.user)
  })
}