// src/App.tsx
import "./styles.css";
import { useEffect, useState } from "react";
import { fetchTodos, type Todo } from "./api/todos";

// MUI
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import useMediaQuery from "@mui/material/useMediaQuery";

import TodosList from "./components/TodosList";
import TodoForm from "./components/TodoForm";

const theme = createTheme({
  palette: { mode: "light" }, // puedes cambiar a "dark" si quieres
});

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");

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
        <Box component="header" sx={{ py: 3 }}>
          <Typography variant="h4" component="h1">
            To-Do List
          </Typography>
        </Box>

        <Box component="main" sx={{ pb: 4 }}>
          <TodoForm onCreated={(t) => setTodos((prev) => [...prev, t])} />

          {/* Filtro */}
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={(_, v) => v && setFilter(v)}
            sx={{
              mb: 2,
              width: isXs ? "100%" : "auto",
              display: "flex",
            }}
          >
            <ToggleButton value="all" sx={{ flex: isXs ? 1 : undefined }}>
              Todos
            </ToggleButton>
            <ToggleButton value="pending" sx={{ flex: isXs ? 1 : undefined }}>
              Pendientes
            </ToggleButton>
            <ToggleButton value="done" sx={{ flex: isXs ? 1 : undefined }}>
              Completados
            </ToggleButton>
          </ToggleButtonGroup>

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
              <Typography sx={{ mt: 2 }}>Cargando todos…</Typography>
            </Box>
          ) : error ? (
            <Typography color="error">Error: {error}</Typography>
          ) : (
            <TodosList
              items={filtered}
              dense={isXs}
              onUpdated={(u) =>
                setTodos((prev) =>
                  prev.map((t) => (t.id === u.id ? u : t))
                )
              }
              onDeleted={(id) =>
                setTodos((prev) => prev.filter((t) => t.id !== id))
              }
            />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
