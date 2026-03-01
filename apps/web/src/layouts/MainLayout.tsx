import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Nav from "../components/common/Nav";
import WelcomeHeader from "../components/common/WelcomeHeader";
import { fetchCurrentUser } from "../features/auth/authSlice";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";

export default function MainLayout() {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      void dispatch(fetchCurrentUser());
    }
  }, [dispatch, token, user]);

  return (
    <>
      <WelcomeHeader />
      <Nav />
      <Outlet />
    </>
  );
}
