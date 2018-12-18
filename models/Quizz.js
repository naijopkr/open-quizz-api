const mongoose = require('mongoose')
const { Schema } = mongoose
const QuestionSchema = require('./Question')

const QuizzSchema = new Schema({
  title: String,
  description: String,
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  dateCreated: Date,
  responses: { type: Number, default: 0 },
  scores: [Number],
  questions: [QuestionSchema]
})

module.exports = mongoose.model('Quizz', QuizzSchema)