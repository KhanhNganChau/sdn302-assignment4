import { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  createQuizAPI,
  deleteQuizAPI,
  getAllQuizzesAPI,
  getQuizByIdAPI,
  updateQuizAPI,
} from "../../features/quiz/quizAPI";
import { CreateQuizDTO, Quiz } from "../../features/quiz/types";
import DeleteQuizConfirmModal from "../common/DeleteQuizConfirmModal";
import QuizDetailPage from "./QuizDetailPage";
import QuizFormModal from "./QuizFormModal";
import QuizListPage from "./QuizListPage";
import QuizUserPage from "./QuizUserPage";

type ViewMode = "list" | "detail";

export default function QuizManagementPage() {
  const { token, user } = useAppSelector((state) => state.auth);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingQuiz, setDeletingQuiz] = useState<Quiz | null>(null);

  const loadQuizzes = async () => {
    setLoading(true);
    try {
      const data = await getAllQuizzesAPI();
      setQuizzes(data);
    } catch (loadError) {
      toast.error(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load quizzes",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadQuizzes();
  }, []);

  const openCreateForm = () => {
    setFormMode("create");
    setEditingQuiz(null);
    setShowForm(true);
  };

  const openEditForm = (quiz: Quiz) => {
    setFormMode("edit");
    setEditingQuiz(quiz);
    setShowForm(true);
  };

  const closeForm = () => {
    if (submitting) {
      return;
    }
    setShowForm(false);
  };

  const handleViewDetail = async (quizId: string) => {
    setLoading(true);
    try {
      const quiz = await getQuizByIdAPI(quizId);
      setSelectedQuiz(quiz);
      setViewMode("detail");
    } catch (viewError) {
      toast.error(
        viewError instanceof Error
          ? viewError.message
          : "Failed to load quiz detail",
      );
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (quizId: string) => {
    const quiz = quizzes.find((item) => item._id === quizId) ?? null;
    setDeletingQuiz(quiz);
    setShowDeleteModal(true);
  };

  const openDeleteModalByQuiz = (quiz: Quiz) => {
    setDeletingQuiz(quiz);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (submitting) {
      return;
    }
    setShowDeleteModal(false);
    setDeletingQuiz(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingQuiz) {
      return;
    }

    setSubmitting(true);
    try {
      await deleteQuizAPI(deletingQuiz._id);
      await loadQuizzes();

      if (selectedQuiz?._id === deletingQuiz._id) {
        setSelectedQuiz(null);
        setViewMode("list");
      }

      setShowDeleteModal(false);
      setDeletingQuiz(null);
      toast.success("Deleted quiz successfully.");
    } catch (deleteError) {
      toast.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete quiz",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormSubmit = async (payload: CreateQuizDTO) => {
    setSubmitting(true);

    try {
      if (formMode === "create") {
        await createQuizAPI(payload);
        toast.success("Created quiz successfully.");
      } else if (editingQuiz) {
        await updateQuizAPI(editingQuiz._id, payload);
        toast.success("Updated quiz successfully.");

        if (selectedQuiz?._id === editingQuiz._id) {
          const refreshedSelectedQuiz = await getQuizByIdAPI(editingQuiz._id);
          setSelectedQuiz(refreshedSelectedQuiz);
        }
      }

      setShowForm(false);
      await loadQuizzes();
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : "Failed to save quiz",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (token && !user) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f0f7ff" }}>
        <Container className="py-4 text-center">
          <Spinner animation="border" variant="primary" />
        </Container>
      </div>
    );
  }

  if (user && !user.admin) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f0f7ff" }}>
        <Container className="py-4">
          <QuizUserPage quizzes={quizzes} loading={loading} />
        </Container>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f7ff" }}>
      <Container className="py-4">
        {viewMode === "list" ? (
          <QuizListPage
            quizzes={quizzes}
            loading={loading}
            onAdd={openCreateForm}
            onView={handleViewDetail}
            onEdit={openEditForm}
            onDelete={openDeleteModal}
          />
        ) : selectedQuiz ? (
          <QuizDetailPage
            quiz={selectedQuiz}
            onBack={() => {
              setViewMode("list");
            }}
            onEdit={openEditForm}
            onDelete={openDeleteModalByQuiz}
          />
        ) : (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        )}
      </Container>

      <QuizFormModal
        show={showForm}
        mode={formMode}
        submitting={submitting}
        initialQuiz={editingQuiz}
        onHide={closeForm}
        onSubmit={handleFormSubmit}
      />

      <DeleteQuizConfirmModal
        show={showDeleteModal}
        submitting={submitting}
        quiz={deletingQuiz}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
