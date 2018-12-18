const mongoose = require('mongoose')
const { Schema } = mongoose

const TakenQuizzSchema = new Schema({
  _quizz: { type: Schema.Types.ObjectId, ref: 'Quizz' },
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  answers: [{ question: Number, answer: Number }],
  score: Number,
  dateTaken: Date
})

module.exports = mongoose.model('TakenQuizz', TakenQuizzSchema)