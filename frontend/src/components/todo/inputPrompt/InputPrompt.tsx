import type { FC } from 'react';
import { Paper, Stack, TextField, CircularProgress, Collapse } from '@mui/material';
import { DataIcon } from '../../icons/Icons';
import type { ITodoInputProps } from './types/types';
import { useTodoInput } from '../../../hooks/inputPrompt/useTodoInput';
import TodoIconButton from '../../common/iconButton/IconButton';

const iconSize = 44;

const TodoInput: FC<ITodoInputProps> = ({ onCreate, busy }) => {
  const {
    title,
    description,
    showDescription,
    isSubmitDisabled,
    handleChangeTitle,
    handleChangeDescription,
    toggleDescription,
    handleSubmit,
  } = useTodoInput({ onCreate, busy });

  return (
    <Paper
      component="form"
      elevation={8}
      onSubmit={handleSubmit}
      sx={{ borderRadius: showDescription ? 3 : 2, px: 3, p: 3.5 }}
    >
      <Stack spacing={showDescription ? 2 : 0.5}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            aria-label="Título de la tarea"
            variant="standard"
            fullWidth
            placeholder="Create a new to-do"
            value={title}
            onChange={handleChangeTitle}
          />

          <TodoIconButton
            type="button"
            aria-label={showDescription ? 'Ocultar descripción' : 'Añadir descripción'}
            aria-pressed={showDescription}
            onClick={toggleDescription}
            disabled={busy}
            variant="outline"
            color="default"
            activeColor="secondary"
            size={iconSize}
            isActive={showDescription}
          >
            {showDescription ? <DataIcon name="chevronUp" /> : <DataIcon name="chevronDown" />}
          </TodoIconButton>

          <TodoIconButton
            type="submit"
            variant="solid"
            color="primary"
            size={iconSize}
            disabled={isSubmitDisabled}
            loading={busy}
          >
            {busy ? <CircularProgress size={22} color="inherit" /> : <DataIcon name="addIcon" />}
          </TodoIconButton>
        </Stack>

        <Collapse in={showDescription} unmountOnExit>
          <TextField
            aria-label="Descripción de la tarea"
            variant="outlined"
            multiline
            minRows={2}
            fullWidth
            placeholder="Descripción (opcional)"
            value={description}
            onChange={handleChangeDescription}
            sx={{ mt: 1 }}
          />
        </Collapse>
      </Stack>
    </Paper>
  );
};

export default TodoInput;
