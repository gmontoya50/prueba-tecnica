import { useState } from "react";
import { createTodo, type Todo } from "../api/todos";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

type Props = { onCreated: (newTodo: Todo) => void };

export default function TodoForm({ onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
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
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", gap: 1.5, mb: 2 }}>
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
      <Button type="submit" variant="contained" disabled={loading}>
        Agregar
      </Button>
    </Box>
  );
}
