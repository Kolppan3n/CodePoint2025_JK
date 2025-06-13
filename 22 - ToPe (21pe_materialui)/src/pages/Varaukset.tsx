import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Typography,
} from "@mui/material";
import type { Tila, Varaaja, Varaus } from "../utils/Types";
import useTableData from "../hooks/useTableData";
import DataTable from "../components/DataTable";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import { useState } from "react";

const Varaukset = () => {
  const resource = "Varaukset";
  const { data, error, loading, deleteRow, createRow } = useTableData(resource);
  const {
    data: userData,
    error: userError,
    loading: userLoading,
  } = useTableData("Varaajat");
  const {
    data: roomData,
    error: roomError,
    loading: roomLoading,
  } = useTableData("Tilat");
  const [enableStyling, setEnableStyling] = useState(false);

  const varaukset: Varaus[] = data;
  const tilat: Tila[] = roomData;
  const varaajat: Varaaja[] = userData;

  console.log("Varaukset:", varaukset);

  const headers = ["id", "tila", "varaaja", "varauspäivä"];

  type FormFields = {
    tila: string;
    varaaja: string;
    varauspaiva: Date | null;
  };

  const {
    reset,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    try {
      const formattedData = {
        ...formData,
        varauspaiva: formData.varauspaiva
          ? format(formData.varauspaiva, "yyyy-MM-dd")
          : null,
      };
      await createRow(formattedData);
      reset();
    } catch (submError: any) {
      console.error("Login.tsx", submError.message);
      console.error("AuthProvider.tsx", error);
      setError("root", { message: error || "Kirjautuminen epäonnistui" });
    }
  };

  return loading || userLoading || roomLoading ? (
    <Typography>Loading...</Typography>
  ) : error ? (
    <Typography>Error {error}</Typography>
  ) : userError ? (
    <Typography>Error {userError}</Typography>
  ) : roomError ? (
    <Typography>Error {roomError}</Typography>
  ) : (
    <Container
      sx={{
        display: "flex",
        gap: 6,
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <DataTable
        enableStyling={enableStyling}
        data={varaukset}
        deleteRow={deleteRow}
        headers={headers}
      />
      <Switch
        checked={enableStyling}
        onChange={(e) => setEnableStyling(e.target.checked)}
      />
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
        <FormControl fullWidth>
          <InputLabel id="tila">Tila</InputLabel>
          <Controller
            name="tila"
            control={control}
            defaultValue=""
            rules={{ required: "Tila on pakollinen" }}
            render={({ field }) => (
              <Select labelId="tila" label="Tila" {...field}>
                {tilat.map((tila, index) => (
                  <MenuItem key={index} value={tila.id}>
                    {tila.nimi}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="varaaja">Varaaja</InputLabel>
          <Controller
            name="varaaja"
            control={control}
            defaultValue=""
            rules={{ required: "Varaaja on pakollinen" }}
            render={({ field }) => (
              <Select labelId="varaaja" label="Varaaja" {...field}>
                {varaajat.map((tila, index) => (
                  <MenuItem key={index} value={tila.id}>
                    {tila.nimi}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Controller
            name="varauspaiva"
            control={control}
            defaultValue={null}
            rules={{ required: "Varauspäivä on pakollinen" }}
            render={({ field }) => (
              <DatePicker
                label="Varauspäivä"
                value={field.value}
                onChange={field.onChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.varauspaiva,
                    helperText: errors.varauspaiva?.message,
                  },
                }}
              />
            )}
          />
        </LocalizationProvider>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? "suoritetaan..." : "Uusi varaus"}
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

export default Varaukset;
