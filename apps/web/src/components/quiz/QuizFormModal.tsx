import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { getAllQuestionsAPI } from "../../features/question/questionAPI";
import { Question } from "../../features/question/types";
import { CreateQuizDTO, Quiz } from "../../features/quiz/types";

interface QuizFormModalProps {
  show: boolean;
  mode: "create" | "edit";
  submitting: boolean;
  initialQuiz?: Quiz | null;
  onHide: () => void;
  onSubmit: (payload: CreateQuizDTO) => Promise<void>;
}

const defaultBlueBoxStyle = {
  backgroundColor: "#eff6ff",
  borderColor: "#bfdbfe",
  borderRadius: "14px",
};

export default function QuizFormModal({
  show,
  mode,
  submitting,
  initialQuiz,
  onHide,
  onSubmit,
}: QuizFormModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questionList, setQuestionList] = useState<Question[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const isCreateMode = mode === "create";

  useEffect(() => {
    if (!show) {
      return;
    }

    setTitle(initialQuiz?.title ?? "");
    setDescription(initialQuiz?.description ?? "");
    setSelectedQuestionIds(
      (initialQuiz?.questions ?? []).map((item) => item._id),
    );
  }, [show, initialQuiz]);

  useEffect(() => {
    const loadQuestions = async () => {
      if (!show) {
        return;
      }

      setLoadingQuestions(true);
      try {
        const questions = await getAllQuestionsAPI();
        setQuestionList(questions);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load question list",
        );
      } finally {
        setLoadingQuestions(false);
      }
    };

    void loadQuestions();
  }, [show]);

  const handleToggleQuestion = (questionId: string) => {
    setSelectedQuestionIds((currentIds) => {
      if (currentIds.includes(questionId)) {
        return currentIds.filter((id) => id !== questionId);
      }
      return [...currentIds, questionId];
    });
  };

  const handleSubmit = async () => {
    if (title.trim().length === 0) {
      toast.error("Quiz title là bắt buộc.");
      return;
    }

    const payload: CreateQuizDTO = {
      title: title.trim(),
      description: description.trim(),
      questions: selectedQuestionIds,
    };

    await onSubmit(payload);
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton style={defaultBlueBoxStyle}>
        <Modal.Title>
          {isCreateMode
            ? "Add New Quiz"
            : `Edit Quiz: ${initialQuiz?.title ?? ""}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#f8fbff" }}>
        <div className="border p-3 mb-3" style={defaultBlueBoxStyle}>
          <h6 className="mb-3">Quiz Information</h6>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter quiz title"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Enter quiz description"
            />
          </Form.Group>
        </div>

        <div className="border p-3" style={defaultBlueBoxStyle}>
          <h6 className="mb-3">Attach Existing Questions</h6>
          {loadingQuestions ? (
            <p className="text-secondary mb-0">Loading questions...</p>
          ) : questionList.length ? (
            <div style={{ maxHeight: "260px", overflowY: "auto" }}>
              {questionList.map((question) => (
                <Form.Check
                  key={question._id}
                  id={`question-${question._id}`}
                  type="checkbox"
                  className="mb-2"
                  label={question.text}
                  checked={selectedQuestionIds.includes(question._id)}
                  onChange={() => {
                    handleToggleQuestion(question._id);
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="text-secondary mb-0">
              No questions available to attach.
            </p>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer style={defaultBlueBoxStyle}>
        <Button variant="secondary" onClick={onHide} disabled={submitting}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
          {submitting
            ? "Saving..."
            : isCreateMode
              ? "Create Quiz"
              : "Update Quiz"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
