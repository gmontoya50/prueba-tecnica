import { FC, useContext, useMemo } from 'react';
import { Box, Container, Typography } from '@mui/material';

import TodoList from '../components/todo/list/TodoList';
import TodoFilters from '../components/todo/filters/TodoFilters';
import TodoListSkeleton from '../components/skeletons/todo/list/TodoListSkeleton';
import TodoAlert from '../components/alerts/Alerts';
import { todoContext } from '../context/todo/todoContex';
import useTodoFilters from '../hooks/filter/useTodoFilters';
import useTodoAlert from '../hooks/alert/useTodoAlert';
import useEditTodoDialog from '../hooks/modals/useEditTodoDialog';
import EditTodoDialog from '../components/modals/EditTodoDialog';
import TodoInput from '../components/todo/inputPrompt/InputPrompt';

const TodoView: FC = () => {
  const {
    state: { loading },
    filteredTodos,
    handleCreate,
    handleToggle,
    handleDelete,
    handleStartEdit,
    handleReorderTodos,
  } = useContext(todoContext);

  const { activeFilter, onFilterChange, itemsLeft, onClearCompleted, clearing, disableClear } =
    useTodoFilters();

  const { show, message, severity, handleClose } = useTodoAlert();
  const editTodoDialog = useEditTodoDialog();

  const emptyStateCopy = useMemo(() => {
    switch (activeFilter) {
      case 'active':
        return {
          title: 'No active tasks',
          message: 'Create a task or reopen a completed one to keep things moving.',
        };
      case 'completed':
        return {
          title: 'Nothing completed yet',
          message: 'Mark tasks as done to track your accomplishments here.',
        };
      default:
        return {
          title: "You're all caught up!",
          message: 'Add a task to get started.',
        };
    }
  }, [activeFilter]);

  return (
    <>
      <Container
        maxWidth="md"
        sx={{ mt: { xs: -6, md: -15 }, pb: 10, position: 'relative', zIndex: 1 }}
      >
        <TodoAlert show={show} message={message} severity={severity} handleClose={handleClose} />

        <Box sx={{ my: 4 }}>
          <TodoInput onCreate={handleCreate} busy={loading.create} />
        </Box>

        {loading.fetch ? (
          <TodoListSkeleton />
        ) : (
          <TodoList
            todos={filteredTodos}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleStartEdit}
            todoEmptyState={emptyStateCopy}
            onReorder={handleReorderTodos}
          />
        )}

        <Box sx={{ mt: 2 }}>
          <TodoFilters
            activeFilter={activeFilter}
            onFilterChange={onFilterChange}
            itemsLeft={itemsLeft}
            onClearCompleted={onClearCompleted}
            clearing={clearing}
            disableClear={disableClear}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 6 }}>
          Drag and drop to reorder list
        </Typography>
      </Container>

      <EditTodoDialog
        open={editTodoDialog.open}
        title={editTodoDialog.title}
        description={editTodoDialog.description}
        saving={editTodoDialog.saving}
        onClose={editTodoDialog.onClose}
        onTitleChange={editTodoDialog.onTitleChange}
        onDescriptionChange={editTodoDialog.onDescriptionChange}
        onSubmit={editTodoDialog.onSubmit}
      />
    </>
  );
};

export default TodoView;
