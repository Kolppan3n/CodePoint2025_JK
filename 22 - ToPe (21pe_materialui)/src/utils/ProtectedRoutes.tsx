import { Navigate, Outlet } from "react-router";
import { useAuth } from "./AuthProvider";

const ProtectedRoutes = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
