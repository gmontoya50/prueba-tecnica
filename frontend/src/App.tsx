import "./styles.css";
import { useEffect, useState } from "react";
import { fetchTodos, type Todo } from "@/api/todos";

import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Fab from "@mui/material/Fab";
import Tooltip from "@mui/material/Tooltip";

import AllInboxIcon from "@mui/icons-material/AllInbox";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";

import TodosList from "./components/TodosList";
import AddTodoDialog from "./components/AddTodoDialog";

const theme = createTheme({ palette: { mode: "light" } });

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");
  const [openAdd, setOpenAdd] = useState(false);

  const muiTheme = useTheme();
  const isXs = useMediaQuery(muiTheme.breakpoints.down("sm"));

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchTodos();
        setTodos(data ?? []);
      } catch (e: any) {
        setError(e.message || "Error cargando todos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = todos.filter((t) =>
    filter === "all" ? true : filter === "done" ? t.completed : !t.completed
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box component="header" sx={{ py: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h5" component="h1">To-Do</Typography>

          {/* Filtros con iconos y colores */}
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={(_, v) => v && setFilter(v)}
            sx={{
              "& .MuiToggleButton-root": { p: 1.0, border: "none" },
            }}
          >
            <ToggleButton
              value="all"
              aria-label="Todos"
              sx={{
                "&.Mui-selected": {
                  bgcolor: "info.light",
                  color: "info.contrastText",
                },
              }}
            >
              <AllInboxIcon />
            </ToggleButton>

            <ToggleButton
              value="pending"
              aria-label="Pendientes"
              sx={{
                "&.Mui-selected": {
                  bgcolor: "warning.light",
                  color: "warning.contrastText",
                },
              }}
            >
              <HourglassTopIcon />
            </ToggleButton>

            <ToggleButton
              value="done"
              aria-label="Completados"
              sx={{
                "&.Mui-selected": {
                  bgcolor: "success.light",
                  color: "success.contrastText",
                },
              }}
            >
              <CheckCircleIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box component="main" sx={{ pb: 8 }}>
          {loading ? (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4 }}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>Cargando…</Typography>
            </Box>
          ) : error ? (
            <Typography color="error">Error: {error}</Typography>
          ) : (
            <TodosList
              items={filtered}
              dense={isXs}
              onUpdated={(u) => setTodos((prev) => prev.map((t) => (t.id === u.id ? u : t)))}
              onDeleted={(id) => setTodos((prev) => prev.filter((t) => t.id !== id))}
            />
          )}
        </Box>

        {/* FAB Agregar */}
        <Tooltip title="Agregar tarea">
          <Fab
            color="primary"
            aria-label="Agregar"
            onClick={() => setOpenAdd(true)}
            sx={{
              position: "fixed",
              right: 24,
              // más alto en móviles + respeta safe-area de dispositivos sin bordes
              bottom: { xs: "calc(env(safe-area-inset-bottom) + 96px)", sm: 96 },
              width: 64,
              height: 64,
            }}
          >
            <AddIcon sx={{ fontSize: 32 }} />
          </Fab>

        </Tooltip>

        {/* Diálogo para crear */}
        <AddTodoDialog
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          onCreated={(t) => setTodos((prev) => [t, ...prev])}
        />
      </Container>
    </ThemeProvider>
  );
}
