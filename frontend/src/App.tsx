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

import TodosList from "./components/TodosList";
import TodoForm from "./components/TodoForm";

const theme = createTheme({
  palette: { mode: "light" }, // dark
});

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box component="header" sx={{ py: 3 }}>
          <Typography variant="h4" component="h1">To-Do's</Typography>
        </Box>

        <Box component="main" sx={{ pb: 4 }}>
          <TodoForm onCreated={(t) => setTodos((prev) => [...prev, t])} />

          {loading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 2 }}>
              <CircularProgress size={20} />
              <Typography>Cargando…</Typography>
            </Box>
          ) : error ? (
            <Typography color="error">Error: {error}</Typography>
          ) : (
            <TodosList
              items={todos}
              onUpdated={(updated) =>
                setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
              }
              onDeleted={(id) => setTodos((prev) => prev.filter((t) => t.id !== id))}
            />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
