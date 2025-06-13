import { Typography } from "@mui/material";
import { Link } from "react-router";

const NotFound = () => {
  return (
    <>
      <Typography>Täällä ei ole mitään</Typography>
      <Link to="/">↩️Palaa Kotiin</Link>
    </>
  );
};

export default NotFound;
