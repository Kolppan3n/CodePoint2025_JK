import { useEffect } from "react";
import CustomButton from "../components/CustomButton";
import { useAuth } from "../utils/AuthProvider";

const Logout = () => {
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      logout();
    }
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <p>Uloskirjautuminen onnistui.</p>
      <CustomButton type="Return" />
    </div>
  );
};

export default Logout;
