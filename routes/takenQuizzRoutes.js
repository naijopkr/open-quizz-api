const TakenQuizz = require('../models/TakenQuizz')
const Quizz = require('../models/Quizz')

module.exports = app => {
  app.get('/api/takenQuizz', (req, res) => {
    TakenQuizz.find({ _user: req.user._id })
      .select({ answers: false })
      .populate('_quizz')
      .exec((err, quizzList) => {
        if (err) {
          console.log(err)
        } else {
          res.send(quizzList)
        }
      })
  })

  app.post('/api/takenQuizz', (req, res) => {
    
    const userAnswers = req.body.userAnswers
    const quizz = req.body.quizz

    const answers = userAnswers.answers.questions.map((answer, index) => {
      return ({
        question: index,
        answer: answer
      })
    })
    
    const { score } = userAnswers

    const takenQuizz = {
      _quizz: quizz._id,
      _user: req.user._id,
      answers,
      score,
      dateTaken: Date.now()
    }

    Quizz.findById(quizz._id, (err, foundQuizz) => {
      if (err) {
        console.log(err)
      } else {
        TakenQuizz.create(takenQuizz, (err, newTakenQuizz) => {
          if (err) {
            console.log(err)
          } else {
            foundQuizz.responses++
            foundQuizz.scores.push(newTakenQuizz.score)
            foundQuizz.save()
            newTakenQuizz.populate('_quizz', (err, takenQuizz) => {
              if (err) {
                console.log(err)
              } else {
                res.send(takenQuizz)
              }
            })
          }
        })
      }
    })
  })
}