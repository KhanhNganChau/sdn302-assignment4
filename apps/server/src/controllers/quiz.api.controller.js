const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

//GET
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("questions");
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate("questions");
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.status(200).json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getQuizWithCapitalQuestions = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate({
      path: "questions",
      match: { keywords: "capital" }, //filter questions containing 'capital'
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//POST
exports.createQuiz = async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createQuestionInQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const question = new Question(req.body);
    await question.save();

    quiz.questions.push(question._id);
    await quiz.save();

    res.status(201).json({
      message: "Question added to quiz",
      question,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createManyQuestionsInQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const questions = await Question.insertMany(req.body);

    const questionIds = questions.map((q) => q._id);
    quiz.questions.push(...questionIds);
    await quiz.save();

    res.status(201).json({
      message: "Questions added to quiz",
      questions,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//PUT
exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.quizId, req.body, {
      new: true,
    });
    res.status(200).json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//DELETE
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    //delete all associated questions
    await Question.deleteMany({
      _id: { $in: quiz.questions },
    });
    //delete the quiz
    await Quiz.findByIdAndDelete(req.params.quizId);
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// exports.deleteQuiz = async (req, res) => {
//   try {
//     await Quiz.findByIdAndDelete(req.params.quizId);
//     res.status(200).json({ message: 'Quiz deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };
