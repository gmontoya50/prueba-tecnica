import { FC, ChangeEvent, FormEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  Box,
} from '@mui/material';
import { IEditTodoDialogProps } from './types/types';

const EditTodoDialog: FC<IEditTodoDialogProps> = ({
  open,
  title,
  description,
  onClose,
  onTitleChange,
  onDescriptionChange,
  onSubmit,
  saving,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={onSubmit}>
        <Box sx={{ padding: 2 }}>
          <DialogTitle>Editar To-Do</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Título"
                value={title}
                autoFocus
                onChange={onTitleChange}
                disabled={saving}
                required
              />
              <TextField
                label="Descripción"
                value={description}
                onChange={onDescriptionChange}
                multiline
                minRows={3}
                disabled={saving}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} disabled={saving} variant="text">
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={saving || !title.trim()}>
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </Button>
          </DialogActions>
        </Box>
      </form>
    </Dialog>
  );
};

export default EditTodoDialog;
