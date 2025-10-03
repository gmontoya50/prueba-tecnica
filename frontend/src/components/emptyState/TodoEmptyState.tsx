import { FC } from 'react';
import { Paper, Typography } from '@mui/material';
import { ITodoEmptyStateProps } from './types/types';

const TodoEmptyState: FC<ITodoEmptyStateProps> = ({ message, title }) => {
  return (
    <Paper elevation={6} sx={{ borderRadius: 1, px: 3, py: 6, textAlign: 'center', mb: 2 }}>
      <Typography variant="h6" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {message}
      </Typography>
    </Paper>
  );
};

export default TodoEmptyState;
