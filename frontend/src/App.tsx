// src/App.tsx
import "./styles.css";
import { useEffect, useState } from "react";
import { fetchTodos, type Todo } from "./api/todos";

// MUI
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

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
            Todos
          </Typography>
        </Box>

        <Box component="main" sx={{ pb: 4 }}>
          <TodoForm onCreated={(t) => setTodos((prev) => [...prev, t])} />

          {/* Filtro */}
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={(_, v) => v && setFilter(v)}
            sx={{ mb: 2 }}
          >
            <ToggleButton value="all">Todos</ToggleButton>
            <ToggleButton value="pending">Pendientes</ToggleButton>
            <ToggleButton value="done">Completados</ToggleButton>
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
