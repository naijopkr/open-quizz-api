const mongoose = require('mongoose')
const { Schema } = mongoose

const ChoiceSchema = new Schema({
  index: Number,
  text: String
})

module.exports = ChoiceSchema