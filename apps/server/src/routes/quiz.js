const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quiz.api.controller");
const authenticate = require("../middlewares/authenticate");

router.get("/", quizController.getAllQuizzes);
router.get("/:quizId", quizController.getQuizById);
router.post(
  "/",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  quizController.createQuiz,
);
router.put(
  "/:quizId",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  quizController.updateQuiz,
);
router.delete(
  "/:quizId",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  quizController.deleteQuiz,
);
router.get("/:quizId/populate", quizController.getQuizWithCapitalQuestions);
router.post(
  "/:quizId/question",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  quizController.createQuestionInQuiz,
);
router.post(
  "/:quizId/questions",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  quizController.createManyQuestionsInQuiz,
);

module.exports = router;
