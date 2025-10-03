import { FC } from 'react';
import { Paper } from '@mui/material';
import TodoItemSkeleton from '../item/TodoItemSkeleton';
import { ITodoSkeletonProps } from './types/types';

const TodoListSkeleton: FC<ITodoSkeletonProps> = ({ itemsToShow = 4 }) => {
  return (
    <Paper elevation={8} sx={{ borderRadius: 1, p: 3, mb: 2 }}>
      {[...Array(itemsToShow)].map((_, index) => (
        <TodoItemSkeleton key={`skeleton-item-${index}`} />
      ))}
    </Paper>
  );
};

export default TodoListSkeleton;
