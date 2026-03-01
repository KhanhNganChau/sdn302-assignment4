import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { logout } from "../../features/auth/authSlice";

export default function CompNav() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token, user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Navbar
      className="mb-0"
      style={{
        backgroundColor: "#dbeafe",
        borderBottom: "1px solid #bfdbfe",
      }}
    >
      <Container fluid>
        <Navbar.Brand
          as={Link}
          to="/quiz"
          style={{ color: "#1e3a8a", fontWeight: 700 }}
        >
          Quiz App
        </Navbar.Brand>

        <Nav className="me-auto">
          {token ? (
            user?.admin ? (
              <>
                <Nav.Link as={Link} to="/quiz">
                  Quiz Management
                </Nav.Link>
                <Nav.Link as={Link} to="/question">
                  Question Management
                </Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to="/quiz">
                Quiz
              </Nav.Link>
            )
          ) : null}
        </Nav>

        {token ? (
          <Button variant="outline-primary" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Nav>
            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
            <Nav.Link as={Link} to="/register">
              Register
            </Nav.Link>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
}
