import { FC, MouseEvent } from 'react';
import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useSortable as useDndSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DataIcon } from '../../icons/Icons';
import { ITodoItemProps } from './types/types';

const TodoItem: FC<ITodoItemProps> = ({ todo, onToggle, onDelete, onEdit, divider = true }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useDndSortable({
    id: todo.id,
  });

  const draggableStyles = {
    cursor: 'grab',
    opacity: isDragging ? 0.65 : 1,
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
  } as const;

  const handleToggle = () => onToggle(todo);
  const handleDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onDelete(todo);
  };
  const handleEdit = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onEdit(todo);
  };

  return (
    <ListItem
      ref={setNodeRef}
      disablePadding
      sx={{
        borderBottom: divider ? '1px solid' : undefined,
        borderColor: 'divider',
        ...draggableStyles,
      }}
    >
      <ListItemButton onClick={handleToggle} sx={{ py: 2 }} {...attributes} {...listeners}>
        <ListItemIcon sx={{ minWidth: 48 }}>
          <Checkbox
            edge="start"
            checked={todo.completed}
            icon={<DataIcon name="panoramaFishEyeIcon" color="disabled" />}
            checkedIcon={<DataIcon name="checkCircleIcon" color="primary" />}
            tabIndex={-1}
            disableRipple
            onChange={handleToggle}
            sx={{
              '&.Mui-checked': {
                color: 'primary.main',
              },
            }}
          />
        </ListItemIcon>
        <ListItemText
          primary={
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                component="h2"
                className="todo-title"
                sx={(theme) => ({
                  fontWeight: 600,
                  fontSize: theme.typography.h4.fontSize,
                  lineHeight: theme.typography.h2.lineHeight,
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? 'text.disabled' : 'text.primary',
                })}
              >
                {todo.title}
              </Typography>
            </Stack>
          }
          secondary={
            todo.description ? (
              <Typography
                variant="body2"
                color={todo.completed ? 'text.disabled' : 'text.secondary'}
                className="todo-description"
                sx={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
              >
                {todo.description}
              </Typography>
            ) : null
          }
        />
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="Editar">
            <IconButton edge="end" aria-label="edit" color="inherit" onClick={handleEdit}>
              <DataIcon name="editIcon" color="info" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton edge="end" aria-label="delete" color="inherit" onClick={handleDelete}>
              <DataIcon name="deleteIcon" color="error" />
            </IconButton>
          </Tooltip>
        </Stack>
      </ListItemButton>
    </ListItem>
  );
};

export default TodoItem;
