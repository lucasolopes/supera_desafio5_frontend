import { Button, Grid, TextField } from "@mui/material";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import * as React from "react";
import { useParams } from "react-router-dom";
import api from "../services/axios";

function createData(
  chave,
  dataTransferencia,
  valor,
  tipo,
  nomeOperadorTransacao
) {
  return { chave, dataTransferencia, valor, tipo, nomeOperadorTransacao };
}

export default function CustomPaginationActionsTable() {
  const [isLoading, setLoading] = React.useState(true);

  const [rows, setRows] = React.useState([]);

  //const numeroConta = this.props.nconta || 1;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const { numConta } = useParams();
  React.useState(() => {
    api.get(`/conta?IdConta=` + numConta).then((response) => {
      Transferencias = response.data.content;
      for (var c = 0; c < Transferencias.length; c++) {
        const dataTransferencia = new Date(Transferencias[c].dataTransferencia);
        rows[c] = createData(
          c,
          dataTransferencia.toLocaleDateString(),
          Transferencias[c].valor,
          Transferencias[c].tipo,
          Transferencias[c].nomeOperadorTransacao
        );
      }

      setLoading(false);
    });
  }, []);

  //const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [DataInicioValor, setDataInicio] = React.useState(null);
  const [DataFimValor, setDataFim] = React.useState(null);
  const [NomeOperador, setNomeOperador] = React.useState("");

  var Transferencias;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  function pesquisar() {
    const dataInicio = new Date(DataInicioValor);
    const dataFim = new Date(DataFimValor);
    var requisicao = `/conta?IdConta=` + numConta;
    setLoading(true);
    if (DataInicioValor != null) {
      requisicao +=
        `&DataInicio=` + encodeURIComponent(dataInicio.toLocaleDateString());
    }
    if (DataInicioValor != null && DataFimValor != null) {
      requisicao +=
        `&DataFim=` + encodeURIComponent(dataFim.toLocaleDateString());
    }
    if (NomeOperador != "") {
      requisicao += `&NomeOperador=` + NomeOperador;
    }
    console.log(requisicao);

    rows.length = 0;

    api.get(requisicao).then((response) => {
      Transferencias = response.data.content;
      console.log(Transferencias);
      console.log(Transferencias.length);
      for (var c = 0; c < Transferencias.length; c++) {
        const dataTransferencia = new Date(Transferencias[c].dataTransferencia);
        rows[c] = createData(
          c,
          dataTransferencia.toLocaleDateString(),
          Transferencias[c].valor,
          Transferencias[c].tipo,
          Transferencias[c].nomeOperadorTransacao
        );
      }
      setLoading(false);
    });
  }

  if (isLoading) {
    return <div className="App">Loading...</div>;
  }

  return (
    <TableContainer component={Paper}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid container spacing={3}>
          <Grid item xs={2}>
            <DatePicker
              label="Data Inicio"
              value={DataInicioValor}
              fullWidth
              onChange={(newValue) => {
                setDataInicio(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>
          <Grid item xs={2}>
            <DatePicker
              label="Data fim"
              value={DataFimValor}
              minDate={dayjs("2017-01-01")}
              fullWidth
              onChange={(newValue) => {
                setDataFim(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="outlined-basic"
              label="Nome Operador Transacionado"
              fullWidth
              variant="outlined"
              value={NomeOperador}
              onChange={(newValue) => setNomeOperador(newValue.target.value)}
            />
            <Button variant="text" onClick={() => pesquisar()}>
              Pesquisar
            </Button>
          </Grid>
          <Grid item xs={4}></Grid>
        </Grid>
        <Stack spacing={3}></Stack>
      </LocalizationProvider>

      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.chave}>
              <TableCell style={{ width: 160 }} scope="row">
                {row.dataTransferencia}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.valor}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.tipo}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.nomeOperadorTransacao}
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  "aria-label": "rows per page",
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}

              // ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
