import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../components/auth/LoginPage";
import QuestionManagementPage from "../components/question/QuestionManagementPage";
import RegisterPage from "../components/auth/RegisterPage";
import ProtectedRoute from "../components/ProtectedRoute";
import QuizManagementPage from "../components/quiz/QuizManagementPage";
import MainLayout from "../layouts/MainLayout";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<MainLayout />}>
          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <QuizManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/question"
            element={
              <ProtectedRoute requireAdmin>
                <QuestionManagementPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/quiz" replace />} />
          <Route path="*" element={<Navigate to="/quiz" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
