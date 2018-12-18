const express = require('express')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const keys = require('./config/keys')
const User = require('./models/User')

mongoose.connect(keys.mongoURI, { useNewUrlParser: true })
mongoose.set('useFindAndModify', false)

const app = express()

app.use(bodyParser.json())
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
)
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy({
  usernameField: 'email'
}, User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

require('./routes/authRoutes')(app)
require('./routes/quizzRoutes')(app)
require('./routes/takenQuizzRoutes')(app)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'))

  //Express will serve up index.html
  //if it doesn't recognize the route
  const path = require('path')
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
  })
}

const PORT = 5000
app.listen(PORT, err => {
  if (err) {
    console.log(err)
  } else {
    console.log('NODE_ENV:', process.env.NODE_ENV || 'development')
    console.log('Server is up on', PORT)
  }
})