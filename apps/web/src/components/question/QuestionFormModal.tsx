import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { CreateQuestionDTO, Question } from "../../features/question/types";

interface QuestionFormModalProps {
  show: boolean;
  mode: "create" | "edit";
  submitting: boolean;
  initialQuestion?: Question | null;
  onHide: () => void;
  onSubmit: (payload: CreateQuestionDTO) => Promise<void>;
}

const defaultBlueBoxStyle = {
  backgroundColor: "#eff6ff",
  borderColor: "#bfdbfe",
  borderRadius: "14px",
};

export default function QuestionFormModal({
  show,
  mode,
  submitting,
  initialQuestion,
  onHide,
  onSubmit,
}: QuestionFormModalProps) {
  const [text, setText] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const [keywordsInput, setKeywordsInput] = useState("");

  const isCreateMode = mode === "create";

  useEffect(() => {
    if (!show) {
      return;
    }

    const nextOptions =
      (initialQuestion?.options ?? []).length >= 2
        ? [...(initialQuestion?.options ?? [])]
        : ["", ""];

    setText(initialQuestion?.text ?? "");
    setOptions(nextOptions);
    setKeywordsInput((initialQuestion?.keywords ?? []).join(", "));

    const nextCorrectIndex = initialQuestion?.correctAnswerIndex ?? 0;
    setCorrectAnswerIndex(
      nextCorrectIndex >= 0 && nextCorrectIndex < nextOptions.length
        ? nextCorrectIndex
        : 0,
    );
  }, [show, initialQuestion]);

  const handleOptionChange = (index: number, value: string) => {
    setOptions((currentOptions) => {
      const updatedOptions = [...currentOptions];
      updatedOptions[index] = value;
      return updatedOptions;
    });
  };

  const handleAddOption = () => {
    setOptions((currentOptions) => [...currentOptions, ""]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) {
      toast.error("A question must have at least 2 options.");
      return;
    }

    setOptions((currentOptions) => {
      const updatedOptions = currentOptions.filter(
        (_, optionIndex) => optionIndex !== index,
      );

      setCorrectAnswerIndex((currentCorrectIndex) => {
        if (currentCorrectIndex === index) {
          return 0;
        }
        if (currentCorrectIndex > index) {
          return currentCorrectIndex - 1;
        }
        return currentCorrectIndex;
      });

      return updatedOptions;
    });
  };

  const handleSubmit = async () => {
    const trimmedText = text.trim();
    const trimmedOptions = options.map((option) => option.trim());

    if (!trimmedText) {
      toast.error("Question text is required.");
      return;
    }

    if (trimmedOptions.length < 2) {
      toast.error("A question must have at least 2 options.");
      return;
    }

    if (trimmedOptions.some((option) => option.length === 0)) {
      toast.error("All options are required.");
      return;
    }

    if (correctAnswerIndex < 0 || correctAnswerIndex >= trimmedOptions.length) {
      toast.error("Please select a valid correct answer.");
      return;
    }

    const keywords = keywordsInput
      .split(",")
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword.length > 0);

    const payload: CreateQuestionDTO = {
      text: trimmedText,
      options: trimmedOptions,
      keywords,
      correctAnswerIndex,
    };

    await onSubmit(payload);
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton style={defaultBlueBoxStyle}>
        <Modal.Title>
          {isCreateMode
            ? "Add New Question"
            : `Edit Question: ${initialQuestion?.text ?? ""}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#f8fbff" }}>
        <div className="border p-3 mb-3" style={defaultBlueBoxStyle}>
          <h6 className="mb-3">Question Information</h6>

          <Form.Group className="mb-3">
            <Form.Label>Question Text</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Enter question text"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Keywords (optional, separated by commas)</Form.Label>
            <Form.Control
              value={keywordsInput}
              onChange={(event) => setKeywordsInput(event.target.value)}
              placeholder="capital, geography, asia"
            />
          </Form.Group>
        </div>

        <div className="border p-3" style={defaultBlueBoxStyle}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">Options (min 2)</h6>
            <Button
              size="sm"
              variant="outline-primary"
              onClick={handleAddOption}
            >
              + Add Option
            </Button>
          </div>

          {options.map((option, index) => (
            <div
              key={`option-${index}`}
              className="d-flex align-items-center gap-2 mb-2"
            >
              <Form.Check
                type="radio"
                name="correct-answer"
                checked={correctAnswerIndex === index}
                onChange={() => {
                  setCorrectAnswerIndex(index);
                }}
                title="Mark as correct answer"
              />
              <Form.Control
                value={option}
                onChange={(event) =>
                  handleOptionChange(index, event.target.value)
                }
                placeholder={`Option ${index + 1}`}
              />
              <Button
                size="sm"
                variant="outline-danger"
                disabled={options.length <= 2}
                onClick={() => {
                  handleRemoveOption(index);
                }}
              >
                Remove
              </Button>
            </div>
          ))}

          <small className="text-secondary">
            Select one radio button to mark the correct answer.
          </small>
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
              ? "Create Question"
              : "Update Question"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
