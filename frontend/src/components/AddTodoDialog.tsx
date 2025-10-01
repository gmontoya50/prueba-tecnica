import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

import TodoForm from "./TodoForm";
import { useNotify } from "@/notifications/NotificationsProvider";
import type { Todo } from "@/api/todos";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (t: Todo) => void;
};

export default function AddTodoDialog({ open, onClose, onCreated }: Props) {
  const { success } = useNotify();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Nueva tarea</DialogTitle>
      <DialogContent>
        <TodoForm
          onCreated={(t) => {
            onCreated(t);
            success("Tarea creada");
            onClose();
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
