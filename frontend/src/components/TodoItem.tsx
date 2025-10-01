import { useState } from "react";
import { updateTodo, deleteTodo, type Todo } from "@/api/todos";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

import { useNotify } from "@/notifications/NotificationsProvider";

type Props = {
  todo: Todo;
  onUpdated: (t: Todo) => void;
  onDeleted: (id: string) => void;
};

export default function TodoItem({ todo, onUpdated, onDeleted }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const { success, error } = useNotify();

  async function handleSave() {
    if (!title.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const updated = await updateTodo(todo.id, {
        title: title.trim(),
        completed: todo.completed,
      });
      onUpdated(updated);
      setEditing(false);
      success("Título actualizado");
    } catch (e: any) {
      const msg = e?.message || "Error actualizando";
      setErrorMsg(msg);
      error(msg);
    } finally {
      setLoading(false);
    }
  }

  function openDeleteDialog() { setConfirmOpen(true); }
  function closeDeleteDialog() { if (!deleting) setConfirmOpen(false); }

  async function confirmDelete() {
    setDeleting(true);
    setErrorMsg(null);
    try {
      await deleteTodo(todo.id);
      onDeleted(todo.id);
      success("Todo eliminado");
      setConfirmOpen(false);
    } catch (e: any) {
      const msg = e?.message || "Error eliminando";
      setErrorMsg(msg);
      error(msg);
    } finally {
      setDeleting(false);
    }
  }

  async function handleToggleCompleted(_: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    setLoading(true);
    setErrorMsg(null);
    try {
      const updated = await updateTodo(todo.id, { completed: checked });
      onUpdated(updated);
    } catch (e: any) {
      const msg = e?.message || "Error actualizando";
      setErrorMsg(msg);
      error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ListItem
        divider
        secondaryAction={
          editing ? (
            <Stack direction={isXs ? "column" : "row"} spacing={1}>
              <Tooltip title="Guardar">
                <span>
                  <IconButton edge="end" onClick={handleSave} disabled={loading}>
                    <SaveIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Cancelar">
                <IconButton
                  edge="end"
                  onClick={() => {
                    setEditing(false);
                    setTitle(todo.title);
                  }}
                  disabled={loading}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          ) : (
            <Stack direction={isXs ? "column" : "row"} spacing={1}>
              <Tooltip title="Editar">
                <IconButton edge="end" onClick={() => setEditing(true)} disabled={loading}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar">
                <IconButton edge="end" onClick={() => setConfirmOpen(true)} disabled={loading}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          )
        }
        sx={{
          alignItems: "flex-start",
          py: isXs ? 0.5 : 1,
          borderLeft: "4px solid",
          borderLeftColor: todo.completed ? "success.main" : "warning.main",
          bgcolor: todo.completed ? "success.light" : "transparent",
          "&:hover": {
            bgcolor: todo.completed ? "success.light" : "action.hover",
          },
        }}
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
              onChange={handleToggleCompleted}
              disabled={loading}
              sx={{ mr: 1, mt: isXs ? 0.25 : 0.5 }}
              color={todo.completed ? "success" : "primary"}
            />
            <ListItemText
              primaryTypographyProps={{ noWrap: false }}
              secondaryTypographyProps={{ noWrap: false, sx: { color: todo.completed ? "success.dark" : "warning.dark" } }}
              primary={todo.title}
              secondary={todo.completed ? "Completado" : "Pendiente"}
            />
            {errorMsg && (
              <div style={{ color: "crimson", fontSize: 12, marginTop: 6 }}>{errorMsg}</div>
            )}
          </>
        )}
      </ListItem>

      <Dialog open={confirmOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Eliminar tarea</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Seguro que quieres eliminar “{todo.title}”? Esta acción no se puede deshacer.
          </DialogContentText>
          {errorMsg && (
            <div style={{ color: "crimson", fontSize: 12, marginTop: 8 }}>{errorMsg}</div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={deleting}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? "Eliminando…" : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
