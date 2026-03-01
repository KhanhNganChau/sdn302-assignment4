import { Button, Card, Col, Row, Spinner } from "react-bootstrap";
import { Quiz } from "../../features/quiz/types";

interface QuizListPageProps {
  quizzes: Quiz[];
  loading: boolean;
  onAdd: () => void;
  onView: (quizId: string) => void;
  onEdit: (quiz: Quiz) => void;
  onDelete: (quizId: string) => void;
}

export default function QuizListPage({
  quizzes,
  loading,
  onAdd,
  onView,
  onEdit,
  onDelete,
}: QuizListPageProps) {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0" style={{ color: "#1d4ed8" }}>
          Quiz List
        </h3>
        <Button onClick={onAdd} style={{ borderRadius: "12px" }}>
          + Add New Quiz
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row className="g-3">
          {quizzes.map((quiz) => (
            <Col key={quiz._id} lg={6}>
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
                    {quiz.title}
                  </Card.Title>
                  <Card.Text className="text-secondary mb-2">
                    {quiz.description || "Không có mô tả"}
                  </Card.Text>
                  <Card.Text className="mb-3">
                    <strong>Questions:</strong> {quiz.questions?.length ?? 0}
                  </Card.Text>

                  <div className="d-flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      style={{ borderRadius: "10px" }}
                      onClick={() => onView(quiz._id)}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      style={{ borderRadius: "10px" }}
                      onClick={() => onEdit(quiz)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      style={{ borderRadius: "10px" }}
                      onClick={() => onDelete(quiz._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}

          {!quizzes.length ? (
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
                  No quizzes found.
                </Card.Body>
              </Card>
            </Col>
          ) : null}
        </Row>
      )}
    </div>
  );
}
