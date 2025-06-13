import { Navigate } from "react-router";
import { useAuth } from "../utils/AuthProvider";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Box, Button, Container, TextField, Typography } from "@mui/material";

const Login = () => {
  type FormFields = {
    tunnus: string;
    salasana: string;
  };

  const { isAuthenticated, login, error } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = async (loginData) => {
    console.log("Form submitted:", loginData);
    try {
      await login(loginData);
    } catch (submError: any) {
      console.error("Login.tsx", submError.message);
      setError("root", { message: error || "Kirjautuminen epäonnistui" });
    }
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            minWidth: 400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <TextField
            label="Tunnus"
            fullWidth
            error={!!errors.tunnus}
            helperText={errors.tunnus?.message}
            {...register("tunnus", {
              required: "Käyttäjätunnus on pakollinen",
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            })}
          />
          <TextField
            label="Salasana"
            type="password"
            fullWidth
            error={!!errors.salasana}
            helperText={errors.salasana?.message}
            {...register("salasana", {
              required: "Salasana on pakollinen",
              minLength: {
                value: 8,
                message: "Salasanan tulee olla vähintään 8 merkkiä pitkä",
              },
            })}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? "kirjaudutaan..." : "Kirjaudu"}
          </Button>
          {errors.root && (
            <Typography
              variant="body2"
              align="center"
              sx={{ color: "error.main" }}
            >
              {errors.root.message}
            </Typography>
          )}
        </Box>
      )}
    </Container>
  );
};

export default Login;
