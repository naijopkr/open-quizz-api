const mongoose = require('mongoose')
const passportMongoose = require('passport-local-mongoose')

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  canMakeQuizz: { type: Boolean, default: true },
  active: { type: Boolean, default: true },
  createdOn: { type: Date, default: Date.now() }
})

UserSchema.plugin(passportMongoose, { usernameField: 'email' })

module.exports = mongoose.model('User', UserSchema)