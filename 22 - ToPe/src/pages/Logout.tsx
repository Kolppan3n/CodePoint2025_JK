import { useEffect } from "react";
import { useAuth } from "../utils/AuthProvider";
import { Navigate } from "react-router";

const Logout = () => {
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      logout();
    }
  }, []);

  return <Navigate to="/" />;
};

export default Logout;
