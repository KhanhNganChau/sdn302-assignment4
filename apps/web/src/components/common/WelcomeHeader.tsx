import { Container } from "react-bootstrap";
import { useAppSelector } from "../../hooks/useAppSelector";

export default function WelcomeHeader() {
  const { token, user } = useAppSelector((state) => state.auth);

  if (!token || !user) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: "#eff6ff",
        borderBottom: "1px solid #bfdbfe",
      }}
    >
      <Container fluid className="py-2" style={{ color: "#1e3a8a" }}>
        {user.admin
          ? `Welcome, admin '${user.username}'`
          : `Welcome '${user.username}'`}
      </Container>
    </div>
  );
}
