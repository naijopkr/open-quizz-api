const mongoose = require('mongoose')
const passportMongoose = require('passport-local-mongoose')

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, required: true },
  password: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  canMakeQuizz: { type: Boolean, default: true },
  active: { type: Boolean, default: true },
  createdOn: { type: Date, default: Date.now() }
})

UserSchema.plugin(passportMongoose, { usernameField: 'email' })

module.exports = mongoose.model('User', UserSchema)