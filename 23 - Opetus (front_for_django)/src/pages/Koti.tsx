import { Typography } from "@mui/material";
import { useAuth } from "../utils/AuthProvider";

const Koti = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Typography>Tervetuloa {isAuthenticated ? "ystävä" : "vieras"}</Typography>
    </>
  );
};

export default Koti;
