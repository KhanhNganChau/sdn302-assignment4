const mongoose = require('mongoose');
const Question = require('./Question');

const QuizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
      }
    ]
  },
  { timestamps: true }
);

// QuizSchema.pre('findOneAndDelete', async function (next) {
//   const quiz = await this.model.findOne(this.getFilter());

//   if (quiz) {
//     await Question.deleteMany({
//       _id: { $in: quiz.questions }
//     });
//   }

//   next();
// });

module.exports = mongoose.model('Quiz', QuizSchema);
