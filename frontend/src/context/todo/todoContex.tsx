import React, { createContext } from 'react';

import useTodo from '../../hooks/useTodos/useTodo';
import { UseTodoReturn } from '../../hooks/useTodos/types/types';
import { initialState } from '../../hooks/useTodos/reducer';
import { ITodoContextProps } from './types/types';

const todoContext = createContext<UseTodoReturn>({
  state: initialState,
  filteredTodos: [],
  itemsLeft: 0,
  hasCompleted: false,
  fetchTodos: async () => {},
  setFilter: () => undefined,
  handleCreate: async () => {},
  handleToggle: async () => {},
  handleDelete: async () => {},
  handleStartEdit: () => undefined,
  handleCloseEdit: () => undefined,
  handleSaveEdit: async () => {},
  handleClearCompleted: async () => {},
  handleReorderTodos: () => undefined,
  clearError: () => undefined,
});

const TodoProviderContext: React.FC<ITodoContextProps> = ({ children }) => {
  const value = useTodo();

  return <todoContext.Provider value={value}>{children}</todoContext.Provider>;
};

export { todoContext, TodoProviderContext };
