const Quizz = require('../models/Quizz')

module.exports = app => {

  //INDEX
  app.get('/api/quizz', (req, res) => {
    Quizz.find({ _user: req.user._id }, '-questions', (err, quizzList) => {
      if (err) {
        console.log(err)
      } else {
        res.send(quizzList)
      }
    })
  })

  //SHOW
  app.get('/api/quizz/:id', (req, res) => {
    Quizz.findById(req.params.id, 
      '-questions.rightAnswer -questions.explanation', (err, quizz) => {
        if (err) {
          console.log(err)
        } else {
          res.send(quizz)
        }
      })
  })

  //GET QUESTION ANSWER
  app.get('/api/quizzAnswer/:quizzId/:questionId', (req, res) => {
    Quizz.findOne(
      { _id: req.params.quizzId, questions: { $elemMatch: { _id: req.params.questionId } } }, 
      'questions.rightAnswer questions.explanation', (err, quizz) => {
        if (err) {
          console.log(err)
        } else {
          const { rightAnswer, explanation } = quizz.questions[0]
          res.send({ rightAnswer, explanation })
        }
      })
  })

  //CREATE QUIZZ
  app.post('/api/quizz', (req, res) => {
    const { title, description } = req.body
    const questions = req.body.questions.map((question, index) => {
      return ({
        index,
        question: question.question,
        explanation: question.explanation,
        rightAnswer: question.rightAnswer || 0,
        choices: question.choices.map((choice, index) => {
          return ({
            index: index,
            text: choice
          })
        })
      })
    })

    const quizz = {
      title,
      description,
      questions,
      _user: req.user._id,
      dateCreated: Date.now()
    }

    Quizz.create(quizz, (err, newQuizz) => {
      if (err) {
        console.log(err)
      } else {
        res.send(newQuizz)
      }
    })
  })
}