import { useMemo, useState } from "react";
import { Alert, Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { Quiz } from "../../features/quiz/types";

type UserQuizMode = "list" | "take" | "result";

interface QuizUserPageProps {
  quizzes: Quiz[];
  loading: boolean;
}

export default function QuizUserPage({ quizzes, loading }: QuizUserPageProps) {
  const [mode, setMode] = useState<UserQuizMode>("list");
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [score, setScore] = useState<number | null>(null);

  const totalQuestions = selectedQuiz?.questions.length ?? 0;
  const currentQuestion = selectedQuiz?.questions[currentQuestionIndex];

  const allAnswered = useMemo(() => {
    if (!selectedQuiz) {
      return false;
    }

    return selectedQuiz.questions.every((question) =>
      Object.prototype.hasOwnProperty.call(answers, question._id),
    );
  }, [answers, selectedQuiz]);

  const handleStartQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScore(null);
    setMode("take");
  };

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    if (!selectedQuiz || !allAnswered) {
      return;
    }

    const correctCount = selectedQuiz.questions.reduce((sum, question) => {
      const selectedAnswer = answers[question._id];
      return sum + (selectedAnswer === question.correctAnswerIndex ? 1 : 0);
    }, 0);

    setScore(correctCount);
    setMode("result");
  };

  const handleBackToList = () => {
    setMode("list");
    setSelectedQuiz(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScore(null);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (mode === "list") {
    return (
      <div>
        <h3 className="mb-4" style={{ color: "#1d4ed8" }}>
          Quiz
        </h3>

        <Row className="g-3">
          {quizzes.map((quiz) => (
            <Col key={quiz._id} md={6} lg={4}>
              <Card
                className="h-100 border"
                style={{
                  borderRadius: "16px",
                  borderColor: "#bfdbfe",
                  backgroundColor: "#eff6ff",
                }}
              >
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ color: "#1e40af" }}>
                    {quiz.title}
                  </Card.Title>
                  <Card.Text className="text-secondary mb-2">
                    {quiz.description || "Không có mô tả"}
                  </Card.Text>
                  <Card.Text className="mb-3">
                    <strong>Total questions:</strong>{" "}
                    {quiz.questions?.length ?? 0}
                  </Card.Text>

                  <div className="mt-auto">
                    <Button
                      variant="primary"
                      style={{ borderRadius: "10px" }}
                      disabled={!quiz.questions?.length}
                      onClick={() => handleStartQuiz(quiz)}
                    >
                      Start Quiz
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}

          {!quizzes.length ? (
            <Col>
              <Alert variant="info" className="mb-0">
                No quizzes found.
              </Alert>
            </Col>
          ) : null}
        </Row>
      </div>
    );
  }

  if (mode === "take" && selectedQuiz && currentQuestion) {
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3 gap-2 flex-wrap">
          <h4 className="mb-0" style={{ color: "#1e40af" }}>
            {selectedQuiz.title}
          </h4>
          <Button
            variant="outline-primary"
            style={{ borderRadius: "10px" }}
            onClick={handleBackToList}
          >
            Back to Quiz List
          </Button>
        </div>

        <Card
          className="border mb-3"
          style={{
            borderRadius: "16px",
            borderColor: "#bfdbfe",
            backgroundColor: "#eff6ff",
          }}
        >
          <Card.Body>
            <Card.Text className="mb-2 text-secondary">
              Question {currentQuestionIndex + 1}/{totalQuestions}
            </Card.Text>
            <Card.Title style={{ color: "#1e3a8a" }}>
              {currentQuestion.text}
            </Card.Title>

            <Form className="mt-3">
              {currentQuestion.options.map((option, optionIndex) => (
                <Form.Check
                  key={`${currentQuestion._id}-option-${optionIndex}`}
                  type="radio"
                  name={`question-${currentQuestion._id}`}
                  id={`question-${currentQuestion._id}-option-${optionIndex}`}
                  className="mb-2"
                  label={option}
                  checked={answers[currentQuestion._id] === optionIndex}
                  onChange={() =>
                    handleSelectAnswer(currentQuestion._id, optionIndex)
                  }
                />
              ))}
            </Form>
          </Card.Body>
        </Card>

        <div className="d-flex gap-2 flex-wrap">
          <Button
            variant="outline-primary"
            style={{ borderRadius: "10px" }}
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline-primary"
            style={{ borderRadius: "10px" }}
            disabled={currentQuestionIndex >= totalQuestions - 1}
            onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
          >
            Next
          </Button>
          <Button
            variant="success"
            style={{ borderRadius: "10px" }}
            disabled={!allAnswered}
            onClick={handleSubmitQuiz}
          >
            Submit Quiz
          </Button>
        </div>

        {!allAnswered ? (
          <p className="mt-3 mb-0 text-secondary">
            Please answer all questions before submitting.
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <Card
        className="border"
        style={{
          borderRadius: "16px",
          borderColor: "#bfdbfe",
          backgroundColor: "#eff6ff",
        }}
      >
        <Card.Body>
          <h4 style={{ color: "#1e40af" }}>Quiz Result</h4>
          <p className="mb-3" style={{ color: "#1e3a8a" }}>
            Your score:{" "}
            <strong>
              {score ?? 0}/{totalQuestions}
            </strong>
          </p>
          <Button
            variant="primary"
            style={{ borderRadius: "10px" }}
            onClick={handleBackToList}
          >
            Back to Quiz List
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}
