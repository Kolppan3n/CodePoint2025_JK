import { Box, Button, Container, TextField, Typography } from "@mui/material";
import type { Tila } from "../utils/Types";
import useTableData from "../hooks/useTableData";
import DataTable from "../components/DataTable";
import { useForm, type SubmitHandler } from "react-hook-form";

const Tilat = () => {
  const resource = "Tilat";
  const { data, error, loading, deleteRow, createRow } = useTableData(resource);

  const tilat: Tila[] = data;
  const headers = ["id", "nimi"];

  type FormFields = {
    nimi: string;
  };

  const {
    reset,
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    console.log("Form submitted:", formData);
    try {
      await createRow(formData);
      reset();
    } catch (submError: any) {
      console.error("Login.tsx", submError.message);
      console.error("AuthProvider.tsx", error);
      setError("root", { message: error || "Kirjautuminen epäonnistui" });
    }
  };

  return loading ? (
    <Typography>Loading...</Typography>
  ) : error ? (
    <Typography>Error {error}</Typography>
  ) : (
    <Container sx={{ display: "flex", gap: 6, flexDirection: "column", alignItems: "center" }}>
      <DataTable
        data={tilat}
        deleteRow={deleteRow}
        headers={headers}
      ></DataTable>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          minWidth: 550,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <TextField
          label="Tilan nimi"
          fullWidth
          error={!!errors.nimi}
          helperText={errors.nimi?.message}
          {...register("nimi", {
            required: "Tilan nimi vaaditaan",
            minLength: {
              value: 3,
              message: "Tilan nimi on liian lyhyt",
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
          {isSubmitting ? "suoritetaan..." : "Uusi tila"}
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
    </Container>
  );
};

export default Tilat;
