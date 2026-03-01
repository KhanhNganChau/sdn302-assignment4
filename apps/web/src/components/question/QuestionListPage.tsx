import { Badge, Button, Card, Col, Row, Spinner } from "react-bootstrap";
import { Question } from "../../features/question/types";

interface QuestionListPageProps {
  questions: Question[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (question: Question) => void;
  onDelete: (questionId: string) => void;
}

export default function QuestionListPage({
  questions,
  loading,
  onAdd,
  onEdit,
  onDelete,
}: QuestionListPageProps) {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0" style={{ color: "#1d4ed8" }}>
          Question List
        </h3>
        <Button onClick={onAdd} style={{ borderRadius: "12px" }}>
          + Add New Question
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row className="g-3">
          {questions.map((question) => (
            <Col key={question._id} md={6} lg={4}>
              <Card
                className="h-100 border"
                style={{
                  borderRadius: "16px",
                  borderColor: "#bfdbfe",
                  backgroundColor: "#eff6ff",
                }}
              >
                <Card.Body>
                  <Card.Title style={{ color: "#1e40af" }}>
                    {question.text}
                  </Card.Title>

                  <div className="mb-3">
                    <strong>Options:</strong>
                    <div className="mt-2 d-flex flex-column gap-2">
                      {question.options.map((option, index) => {
                        const isCorrect = index === question.correctAnswerIndex;

                        return (
                          <div
                            key={`${question._id}-option-${index}`}
                            className="px-2 py-1 rounded"
                            style={{
                              border: "1px solid #bfdbfe",
                              backgroundColor: isCorrect
                                ? "#dcfce7"
                                : "#ffffff",
                              color: isCorrect ? "#166534" : "#1e3a8a",
                            }}
                          >
                            <strong>{String.fromCharCode(65 + index)}.</strong>{" "}
                            {option}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Card.Text className="mb-3 text-success">
                    <strong>Correct:</strong>{" "}
                    {question.options[question.correctAnswerIndex] ?? "N/A"}
                  </Card.Text>

                  <div className="d-flex gap-2 flex-wrap mb-3">
                    {(question.keywords ?? []).length ? (
                      question.keywords.map((keyword, index) => (
                        <Badge
                          key={`${question._id}-keyword-${index}`}
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

                  <div className="d-flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="primary"
                      style={{ borderRadius: "10px" }}
                      onClick={() => {
                        onEdit(question);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      style={{ borderRadius: "10px" }}
                      onClick={() => {
                        onDelete(question._id);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}

          {!questions.length ? (
            <Col>
              <Card
                className="border"
                style={{
                  borderRadius: "16px",
                  borderColor: "#bfdbfe",
                  backgroundColor: "#eff6ff",
                }}
              >
                <Card.Body className="text-center text-secondary py-4">
                  No questions found.
                </Card.Body>
              </Card>
            </Col>
          ) : null}
        </Row>
      )}
    </div>
  );
}
