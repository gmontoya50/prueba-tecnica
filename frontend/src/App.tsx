// src/App.tsx
import "./styles.css";
import { useEffect, useMemo, useState } from "react";
import { fetchTodos, type Todo } from "@/api/todos";

import { ThemeProvider, createTheme } from "@mui/material/styles";
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
import IconButton from "@mui/material/IconButton";

import AllInboxIcon from "@mui/icons-material/AllInbox";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import TodosList from "./components/TodosList";
import AddTodoDialog from "./components/AddTodoDialog";

// --- Toggle Dark/Light simple ---
type Mode = "light" | "dark";
const STORAGE_KEY = "ui:color-mode";

export default function App() {
  // Preferencia del sistema solo para el primer render
  const systemPrefersDark =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window === "undefined") return "light";
    const saved = window.localStorage.getItem(STORAGE_KEY) as Mode | null;
    if (saved === "light" || saved === "dark") return saved;
    return systemPrefersDark ? "dark" : "light";
  });

  // Persistencia y sincronización con <html data-theme="...">
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, mode);
      document.documentElement.setAttribute("data-theme", mode);
    }
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: mode === "dark" ? "#90caf9" : "#1976d2" },
          secondary: { main: mode === "dark" ? "#f48fb1" : "#9c27b0" },
          background: {
            default: mode === "dark" ? "#0b0f14" : "#fafafa",
            paper: mode === "dark" ? "#111821" : "#ffffff",
          },
        },
        shape: { borderRadius: 10 },
      }),
    [mode]
  );

  const toggleMode = () => setMode((m) => (m === "light" ? "dark" : "light"));

  // Estado de la app
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");
  const [openAdd, setOpenAdd] = useState(false);

  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

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
        {/* Header con grid: título izquierda, filtros centrados, modo derecha */}
        <Box
          component="header"
          sx={{
            py: 3,
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            gap: 1,
          }}
        >
          {/* Columna izquierda: título */}
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
            To-Do&apos;s
          </Typography>

          {/* Columna centro: filtros centrados */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
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

          {/* Columna derecha: botón modo alineado al extremo derecho */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Tooltip
              title={mode === "dark" ? "Cambiar a claro" : "Cambiar a oscuro"}
              arrow
            >
              <IconButton aria-label="toggle theme" onClick={toggleMode}>
                {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Contenido */}
        <Box component="main" sx={{ pb: 2 }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 4,
              }}
            >
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>Cargando…</Typography>
            </Box>
          ) : error ? (
            <Typography color="error">Error: {error}</Typography>
          ) : (
            <TodosList
              items={filtered}
              dense={isXs}
              onUpdated={(u) =>
                setTodos((prev) => prev.map((t) => (t.id === u.id ? u : t)))
              }
              onDeleted={(id) =>
                setTodos((prev) => prev.filter((t) => t.id !== id))
              }
            />
          )}
        </Box>

        {/* Acciones bajo la lista (solo FAB agregar) */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 3,
          }}
        >
          <Tooltip title="Agregar tarea">
            <Fab
              color="primary"
              aria-label="Agregar"
              onClick={() => setOpenAdd(true)}
              sx={{ width: 64, height: 64 }}
            >
              <AddIcon sx={{ fontSize: 32 }} />
            </Fab>
          </Tooltip>
        </Box>

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
