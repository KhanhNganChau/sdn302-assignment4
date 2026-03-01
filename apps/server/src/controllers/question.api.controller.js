const Question = require("../models/Question");

//GET
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//POST
exports.createQuestion = async (req, res) => {
  try {
    const question = new Question({
      ...req.body,
      author: req.user._id,
    });
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//PUT
exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.questionId,
      req.body,
      {
        new: true,
      },
    );
    res.status(200).json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//DELETE
exports.deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.questionId);
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
