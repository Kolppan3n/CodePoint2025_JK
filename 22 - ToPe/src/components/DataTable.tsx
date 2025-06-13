import {
  Button,
  colors,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/material/styles";

type TableProps = {
  data: any[];
  headers: string[];
  deleteRow: (id: number) => void;
  enableStyling?: boolean;
};

const StyledContainer = styled(TableContainer)(({ theme }) => ({
  overflow: "hidden",
  "& thead th": {
    color: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.secondary.main,
  },
  "& button": {
    color: theme.palette.error.main,
  },
}));

const DataTable = ({ data, headers, deleteRow, enableStyling }: TableProps) => {
  const ContainerComponent = enableStyling ? StyledContainer : TableContainer;

  return (
    <Paper component={Paper} sx={{ minWidth: 550 }}>
      <ContainerComponent>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {headers.map((key: string) => {
                return (
                  <TableCell key={key} align="right">
                    {key.toUpperCase()}
                  </TableCell>
                );
              })}
              <TableCell align="right">POISTA</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row: any, id: number) => (
              <TableRow
                key={`${id}.${row[1]}`}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {Object.keys(row).map((key: string) => (
                  <TableCell key={`${row.id}-${key}`} align="right">
                    {row[key]}
                  </TableCell>
                ))}
                <TableCell align="right">
                  <Button variant="text" onClick={() => deleteRow(row.id)}>
                    X
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ContainerComponent>
    </Paper>
  );
};

export default DataTable;
