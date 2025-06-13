import { Typography } from "@mui/material";
import { useAuth } from "../utils/AuthProvider";

const Koti = () => {
  const { userData } = useAuth();

  return (
    <>
      <Typography>Tervetuloa {userData ? userData.nimi : "vieras"}</Typography>
    </>
  );
};

export default Koti;
