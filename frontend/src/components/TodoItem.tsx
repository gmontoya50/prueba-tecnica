import { useState } from "react";
import { updateTodo, deleteTodo, type Todo } from "../api/todos";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  todo: Todo;
  onUpdated: (t: Todo) => void;
  onDeleted: (id: string) => void;
};

export default function TodoItem({ todo, onUpdated, onDeleted }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // ✅ agregado

  async function handleSave() {
    if (!title.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const updated = await updateTodo(todo.id, { title: title.trim(), completed: todo.completed }); // ✅ enviar payload completo por si el backend requiere PUT completo
      onUpdated(updated);
      setEditing(false);
    } catch (e: any) {
      setError(e?.message || "Error actualizando");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("¿Eliminar este todo?")) return;
    setLoading(true);
    setError(null);
    try {
      await deleteTodo(todo.id);
      onDeleted(todo.id);
    } catch (e: any) {
      setError(e?.message || "Error eliminando");
    } finally {
      setLoading(false);
    }
  }

  // ✅ toggle: usa el 'checked' que entrega MUI y envía título + completed
  async function handleToggleCompleted(_: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateTodo(todo.id, { title: todo.title, completed: checked });
      onUpdated(updated);
    } catch (e: any) {
      setError(e?.message || "Error actualizando");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ListItem
      divider
      secondaryAction={
        editing ? (
          <Stack direction="row" spacing={1}>
            <Tooltip title="Guardar">
              <span>
                <IconButton edge="end" onClick={handleSave} disabled={loading}>
                  <SaveIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Cancelar">
              <IconButton edge="end" onClick={() => { setEditing(false); setTitle(todo.title); }} disabled={loading}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        ) : (
          <Stack direction="row" spacing={1}>
            <Tooltip title="Editar">
              <IconButton edge="end" onClick={() => setEditing(true)} disabled={loading}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton edge="end" onClick={handleDelete} disabled={loading}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        )
      }
    >
      {editing ? (
        <TextField
          size="small"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          fullWidth
        />
      ) : (
        <>
          <Checkbox
            checked={todo.completed}
            onChange={handleToggleCompleted} // ✅ ahora manda el checked real
            disabled={loading}
            sx={{ mr: 1 }}
          />
          <ListItemText
            primary={todo.title}
            secondary={todo.completed ? "✔️ Completado" : "⏳ Pendiente"}
          />
          {error && <div style={{ color: "crimson", fontSize: 12, marginTop: 6 }}>{error}</div>}
        </>
      )}
    </ListItem>
  );
}
