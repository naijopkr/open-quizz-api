const mongoose = require('mongoose')
const { Schema } = mongoose
const ChoiceSchema = require('./Choice')

const QuestionSchema = new Schema({
  index: Number,
  question: String,
  explanation: String,
  rightAnswer: Number,
  choices: [ChoiceSchema]
})

module.exports = QuestionSchema