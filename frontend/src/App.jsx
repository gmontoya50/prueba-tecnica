import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
  Chip,
} from '@mui/material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import EditIcon from '@mui/icons-material/Edit';
import * as api from './api';
import { createTodoSchema, editTodoSchema, transformEmptyToUndefined } from './lib/schemas';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const dialogTitleId = 'edit-dialog-title';

  const createForm = useForm({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: '',
      description: ''
    }
  });

  const editForm = useForm({
    resolver: zodResolver(editTodoSchema),
    defaultValues: {
      title: '',
      description: ''
    }
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const items = await api.listTodos();
        setTodos(items);
      } catch (e) {
        setError('No se pudieron cargar las tareas');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'open') return todos.filter((t) => !t.completed);
    if (filter === 'done') return todos.filter((t) => t.completed);
    return todos;
  }, [todos, filter]);

  async function handleCreate(data) {
    try {
      const payload = transformEmptyToUndefined(data);
      const created = await api.createTodo(payload);
      setTodos((prev) => [created, ...prev]);
      createForm.reset();
      setError('');
    } catch (e) {
      setError('No se pudo crear la tarea');
    }
  }

  async function toggleCompleted(todo) {
    try {
      const updated = await api.updateTodoStatus(todo.id, !todo.completed);
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
      setError('');
    } catch (e) {
      setError('No se pudo actualizar el estado');
    }
  }

  async function handleDelete(todo) {
    try {
      await api.deleteTodo(todo.id);
      setTodos((prev) => prev.filter((t) => t.id !== todo.id));
      setError('');
    } catch (e) {
      setError('No se pudo eliminar la tarea');
    }
  }

  function openEdit(todo) {
    setEditId(todo.id);
    editForm.reset({
      title: todo.title ?? '',
      description: todo.description ?? ''
    });
    setEditOpen(true);
  }

  function closeEdit() {
    if (editForm.formState.isSubmitting) return;
    setEditOpen(false);
    editForm.reset();
  }

  async function saveEdit(data) {
    try {
      const payload = transformEmptyToUndefined(data);
      const updated = await api.updateTodo(editId, payload);
      setTodos((prev) => prev.map((it) => (it.id === editId ? updated : it)));
      setError('');
      setEditOpen(false);
      editForm.reset();
    } catch (e) {
      setError('No se pudo guardar la edición');
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="h1" sx={{ flex: 1 }}>
            ToDo List
          </Typography>
          <Stack direction="row" spacing={1}>
            <Chip
              label="Todas"
              variant={filter === 'all' ? 'filled' : 'outlined'}
              onClick={() => setFilter('all')}
            />
            <Chip
              label="Pendientes"
              variant={filter === 'open' ? 'filled' : 'outlined'}
              onClick={() => setFilter('open')}
            />
            <Chip
              label="Completadas"
              variant={filter === 'done' ? 'filled' : 'outlined'}
              onClick={() => setFilter('done')}
            />
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Crear nueva tarea
          </Typography>
          <Box
            component="form"
            onSubmit={createForm.handleSubmit(handleCreate)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <TextField
                fullWidth
                size="small"
                placeholder="¿Qué necesitas hacer? (Título)"
                {...createForm.register('title')}
                error={!!createForm.formState.errors.title}
                helperText={createForm.formState.errors.title?.message}
                disabled={createForm.formState.isSubmitting}
              />
              <Button
                type="submit"
                variant="contained"
                startIcon={<AddIcon />}
                disabled={createForm.formState.isSubmitting}
              >
                Añadir
              </Button>
            </Stack>
            <TextField
              fullWidth
              size="small"
              placeholder="Descripción (opcional)"
              {...createForm.register('description')}
              error={!!createForm.formState.errors.description}
              helperText={createForm.formState.errors.description?.message}
              disabled={createForm.formState.isSubmitting}
              multiline
              minRows={2}
            />
          </Box>
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Paper>

        <Paper
          elevation={0}
          sx={{
            mt: 3,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <List>
            {loading && (
              <ListItem>
                <ListItemText primary="Cargando..." />
              </ListItem>
            )}
            {!loading && filtered.length === 0 && (
              <ListItem>
                <ListItemText primary="No hay tareas" />
              </ListItem>
            )}
            {filtered.map((todo) => (
              <ListItem
                key={todo.id}
                secondaryAction={
                  <Stack direction="row" spacing={0.5}>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      // data-testid estable para pruebas: permite localizar el botón
                      data-testid={`edit-btn-${todo.id}`}
                      onClick={(e) => {
                        // Evitar que el click burbujee al ListItemButton
                        e.stopPropagation();
                        // Abre el diálogo de edición con los datos del item
                        openEdit(todo);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(e) => { e.stopPropagation(); handleDelete(todo); }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                }
                disablePadding
              >
                <ListItemButton
                  role={undefined}
                  dense
                  onClick={() => toggleCompleted(todo)}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      tabIndex={-1}
                      disableRipple
                      checked={Boolean(todo.completed)}
                      icon={<RadioButtonUncheckedIcon />}
                      checkedIcon={<CheckCircleIcon />}
                      inputProps={{ 'aria-labelledby': `todo-${todo.id}` }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={`todo-${todo.id}`}
                    primary={todo.title}
                    secondary={
                      todo.description
                        ? `${todo.description} • ${new Date(
                            todo.createdAt
                          ).toLocaleString()}`
                        : new Date(todo.createdAt).toLocaleString()
                    }
                    primaryTypographyProps={{
                      sx: todo.completed
                        ? {
                            textDecoration: 'line-through',
                            color: 'text.secondary',
                          }
                        : undefined,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Container>

      <Dialog
        open={editOpen}
        onClose={closeEdit}
        fullWidth
        maxWidth="sm"
        aria-labelledby={dialogTitleId}
        slotProps={{ paper: { 'data-testid': 'edit-dialog' } }}
      >
        <DialogTitle id={dialogTitleId}>Editar tarea</DialogTitle>
        <Box component="form" onSubmit={editForm.handleSubmit(saveEdit)}>
          <DialogContent
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Título"
              {...editForm.register('title')}
              error={!!editForm.formState.errors.title}
              helperText={editForm.formState.errors.title?.message}
              inputProps={{ 'data-testid': 'edit-title-input' }}
              autoFocus
            />
            <TextField
              label="Descripción"
              {...editForm.register('description')}
              error={!!editForm.formState.errors.description}
              helperText={editForm.formState.errors.description?.message}
              inputProps={{ 'data-testid': 'edit-description-input' }}
              multiline
              minRows={2}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={closeEdit}
              disabled={editForm.formState.isSubmitting}
              data-testid="edit-cancel-btn"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={editForm.formState.isSubmitting}
              data-testid="edit-save-btn"
            >
              Guardar
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
