import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { toast } from "react-toastify";
import DeleteQuizConfirmModal from "../common/DeleteQuizConfirmModal";
import {
  createQuestionAPI,
  deleteQuestionAPI,
  getAllQuestionsAPI,
  updateQuestionAPI,
} from "../../features/question/questionAPI";
import { CreateQuestionDTO, Question } from "../../features/question/types";
import QuestionFormModal from "./QuestionFormModal";
import QuestionListPage from "./QuestionListPage";

export default function QuestionManagementPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingQuestion, setDeletingQuestion] = useState<Question | null>(
    null,
  );

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const data = await getAllQuestionsAPI();
      setQuestions(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load questions",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadQuestions();
  }, []);

  const openCreateForm = () => {
    setFormMode("create");
    setEditingQuestion(null);
    setShowForm(true);
  };

  const openEditForm = (question: Question) => {
    setFormMode("edit");
    setEditingQuestion(question);
    setShowForm(true);
  };

  const closeForm = () => {
    if (submitting) {
      return;
    }
    setShowForm(false);
  };

  const openDeleteModal = (questionId: string) => {
    const question = questions.find((item) => item._id === questionId) ?? null;
    setDeletingQuestion(question);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (submitting) {
      return;
    }
    setShowDeleteModal(false);
    setDeletingQuestion(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingQuestion) {
      return;
    }

    setSubmitting(true);
    try {
      await deleteQuestionAPI(deletingQuestion._id);
      setShowDeleteModal(false);
      setDeletingQuestion(null);
      await loadQuestions();
      toast.success("Deleted question successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete question",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormSubmit = async (payload: CreateQuestionDTO) => {
    setSubmitting(true);

    try {
      if (formMode === "create") {
        await createQuestionAPI(payload);
        toast.success("Created question successfully.");
      } else if (editingQuestion) {
        await updateQuestionAPI(editingQuestion._id, payload);
        toast.success("Updated question successfully.");
      }

      setShowForm(false);
      await loadQuestions();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save question",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f7ff" }}>
      <Container className="py-4">
        <QuestionListPage
          questions={questions}
          loading={loading}
          onAdd={openCreateForm}
          onEdit={openEditForm}
          onDelete={openDeleteModal}
        />
      </Container>

      <QuestionFormModal
        show={showForm}
        mode={formMode}
        submitting={submitting}
        initialQuestion={editingQuestion}
        onHide={closeForm}
        onSubmit={handleFormSubmit}
      />

      <DeleteQuizConfirmModal
        show={showDeleteModal}
        submitting={submitting}
        itemName={deletingQuestion?.text ?? "this question"}
        entityName="question"
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
