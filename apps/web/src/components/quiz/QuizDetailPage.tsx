import { Badge, Button, Card, ListGroup } from "react-bootstrap";
import { Quiz } from "../../features/quiz/types";

interface QuizDetailPageProps {
  quiz: Quiz;
  onBack: () => void;
  onEdit: (quiz: Quiz) => void;
  onDelete: (quiz: Quiz) => void;
}

export default function QuizDetailPage({
  quiz,
  onBack,
  onEdit,
  onDelete,
}: QuizDetailPageProps) {
  return (
    <div>
      <div className="d-flex gap-2 flex-wrap mb-3">
        <Button
          variant="outline-primary"
          style={{ borderRadius: "10px" }}
          onClick={onBack}
        >
          ← Back to Quiz List
        </Button>
        <Button
          variant="primary"
          style={{ borderRadius: "10px" }}
          onClick={() => {
            onEdit(quiz);
          }}
        >
          Edit Quiz
        </Button>
        <Button
          variant="outline-danger"
          style={{ borderRadius: "10px" }}
          onClick={() => {
            onDelete(quiz);
          }}
        >
          Delete Quiz
        </Button>
      </div>

      <Card
        className="mb-3 border"
        style={{
          borderRadius: "16px",
          borderColor: "#bfdbfe",
          backgroundColor: "#eff6ff",
        }}
      >
        <Card.Body>
          <Card.Title style={{ color: "#1e3a8a" }}>{quiz.title}</Card.Title>
          <Card.Text className="text-secondary">
            {quiz.description || "Không có mô tả"}
          </Card.Text>
          <Card.Text>
            <strong>Total questions:</strong> {quiz.questions?.length ?? 0}
          </Card.Text>
        </Card.Body>
      </Card>

      {(quiz.questions ?? []).map((question, questionIndex) => (
        <Card
          key={question._id}
          className="mb-3 border"
          style={{
            borderRadius: "16px",
            borderColor: "#dbeafe",
            backgroundColor: "#f8fbff",
          }}
        >
          <Card.Body>
            <Card.Title className="h6" style={{ color: "#1d4ed8" }}>
              Question {questionIndex + 1}: {question.text}
            </Card.Title>

            <ListGroup className="mb-3" variant="flush">
              {question.options.map((option, index) => (
                <ListGroup.Item
                  key={`${question._id}-option-${index}`}
                  className="px-2"
                  style={{
                    borderRadius: "8px",
                    backgroundColor:
                      index === question.correctAnswerIndex
                        ? "#dbeafe"
                        : "transparent",
                    border:
                      index === question.correctAnswerIndex
                        ? "1px solid #93c5fd"
                        : "1px solid transparent",
                    marginBottom: "6px",
                  }}
                >
                  {index + 1}. {option}
                  {index === question.correctAnswerIndex ? (
                    <Badge
                      bg="primary"
                      className="ms-2"
                      style={{ borderRadius: "10px" }}
                    >
                      Correct
                    </Badge>
                  ) : null}
                </ListGroup.Item>
              ))}
            </ListGroup>

            <div className="d-flex gap-2 flex-wrap">
              {(question.keywords ?? []).length ? (
                question.keywords.map((keyword, keywordIndex) => (
                  <Badge
                    key={`${question._id}-keyword-${keywordIndex}`}
                    bg="info"
                    text="dark"
                    style={{ borderRadius: "10px" }}
                  >
                    {keyword}
                  </Badge>
                ))
              ) : (
                <span className="text-secondary">No keywords</span>
              )}
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
