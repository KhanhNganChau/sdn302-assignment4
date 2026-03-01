import { Button, Modal } from "react-bootstrap";
import { Quiz } from "../../features/quiz/types";

interface DeleteQuizConfirmModalProps {
  show: boolean;
  submitting: boolean;
  quiz?: Quiz | null;
  itemName?: string;
  entityName?: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteQuizConfirmModal({
  show,
  submitting,
  quiz,
  itemName,
  entityName = "item",
  onClose,
  onConfirm,
}: DeleteQuizConfirmModalProps) {
  const displayName = itemName ?? quiz?.title ?? "this item";

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header
        closeButton
        style={{
          backgroundColor: "#eff6ff",
          borderBottom: "1px solid #bfdbfe",
        }}
      >
        <Modal.Title>
          Are you sure you want to delete this {entityName}?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#f8fbff" }}>
        You are about to delete
        <strong> {displayName}</strong>?
      </Modal.Body>
      <Modal.Footer
        style={{
          backgroundColor: "#eff6ff",
          borderTop: "1px solid #bfdbfe",
        }}
      >
        <Button variant="secondary" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={() => void onConfirm()}
          disabled={submitting}
        >
          {submitting ? "Deleting..." : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
