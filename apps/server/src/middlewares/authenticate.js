const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Question = require("../models/Question");

exports.verifyUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    const error = new Error("No token provided");
    error.status = 401;
    return next(error);
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded._id);
    if (!user) {
      const error = new Error("User not found");
      error.status = 401;
      return next(error);
    }
    req.user = user;
    next();
  } catch (err) {
    const error = new Error("Invalid token");
    error.status = 401;
    next(error);
  }
};

exports.verifyAdmin = (req, res, next) => {
  if (req.user && req.user.admin) {
    return next();
  }
  const error = new Error("You are not authorized to perform this operation!");
  error.status = 403;
  next(error);
};

//verify for question author
exports.verifyAuthor = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.questionId);

    if (!question) return next({ status: 404, message: "Question not found" });

    if (req.user?.admin) {
      return next();
    }

    if (!question.author) {
      question.author = req.user._id;
      await question.save();
      return next();
    }

    // So sánh ObjectId của tác giả với ObjectId của người dùng hiện tại
    if (question.author.equals(req.user._id)) {
      return next();
    } else {
      const err = new Error("You are not the author of this question");
      err.status = 403;
      return next(err);
    }
  } catch (err) {
    return next(err);
  }
};
