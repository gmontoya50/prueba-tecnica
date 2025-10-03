import { FC, useMemo } from 'react';
import { List, Paper } from '@mui/material';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';

import TodoItem from '../list-item/TodoItem';
import TodoEmptyState from '../../emptyState/TodoEmptyState';
import { useSortable } from '../../../hooks/sorteable/useSortable';
import { SortableItemData } from '../../../hooks/sorteable/types/types';
import { ITodoListProps } from './types/types';

const TodoList: FC<ITodoListProps> = ({
  todos,
  onToggle,
  onDelete,
  onEdit,
  todoEmptyState,
  onReorder,
}) => {
  if (!todos.length) {
    return <TodoEmptyState title={todoEmptyState.title} message={todoEmptyState.message} />;
  }

  const sortableItems = useMemo<SortableItemData[]>(
    () => todos.map((todo) => ({ id: todo.id, text: todo.title })),
    [todos]
  );

  const { sensors, handleDragEnd } = useSortable({
    items: sortableItems,
    onReorder,
  });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext
        items={sortableItems.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <Paper elevation={8} sx={{ borderRadius: 1, overflow: 'hidden', mb: 2 }}>
          <List disablePadding>
            {todos.map((todo, index) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
                onEdit={onEdit}
                divider={index !== todos.length - 1}
              />
            ))}
          </List>
        </Paper>
      </SortableContext>
    </DndContext>
  );
};

export default TodoList;
