import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import { JSX } from "react";
import { Spinner } from "react-bootstrap";

const ProtectedRoute = ({
  children,
  requireAdmin = false,
}: {
  children: JSX.Element;
  requireAdmin?: boolean;
}) => {
  const { token, user } = useAppSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin) {
    if (!user) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      );
    }

    if (!user.admin) {
      return <Navigate to="/quiz" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
