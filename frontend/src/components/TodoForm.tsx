import { useState } from "react";
import { createTodo, type Todo } from "../api/todos";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

type Props = { onCreated: (newTodo: Todo) => void };

export default function TodoForm({ onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Ingresa un título para el todo");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const todo = await createTodo(title.trim());
      onCreated(todo);
      setTitle("");
    } catch (err: any) {
      setError(err.message || "Error creando todo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        gap: 1.5,
        mb: 2,
        flexDirection: { xs: "column", sm: "row" }, // apilar en móviles
      }}
    >
      <TextField
        size="small"
        label="Nuevo todo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
        error={!!error}
        helperText={error || " "}
        fullWidth
      />
      <Button type="submit" variant="contained" disabled={loading} fullWidth={isXs}>
        Agregar
      </Button>
    </Box>
  );
}
