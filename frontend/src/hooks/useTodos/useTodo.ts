import { useCallback, useEffect, useMemo, useReducer } from 'react';

import { ApiError } from '../../lib/api';
import { createTodo, deleteTodo, listTodos, updateTodo } from '../../services/todo.api';
import { FilterValue, TodoError, UseTodoReturn } from './types/types';
import { initialState, todoReducer } from './reducer';
import { ITodo } from '../../services/types/types';
import { createError, emptyError, getErrorMessage } from '../../lib/errors';

const useTodo = (): UseTodoReturn => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const fetchTodos = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await listTodos({});
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'FETCH_FAILURE', payload: createError(getErrorMessage(err)) });
    }
  }, []);

  useEffect(() => {
     fetchTodos();
  }, [fetchTodos]);

  const handleCreate = async ({ title, description }: { title: string; description?: string }) => {
    dispatch({ type: 'CREATE_START' });
    try {
      const todo = await createTodo({ body: { title, description } });
      dispatch({ type: 'CREATE_SUCCESS', payload: todo });
    } catch (err) {
      const error = createError(getErrorMessage(err));
      dispatch({ type: 'CREATE_FAILURE', payload: error });
      throw err;
    }
  };

  const handleToggle = async (todo: ITodo) => {
    try {
      const updated = await updateTodo({
        params: { id: todo.id },
        body: { completed: !todo.completed },
      });
      dispatch({ type: 'UPDATE_TODO_SUCCESS', payload: updated });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: createError(getErrorMessage(err)) });
    }
  };

  const handleDelete = async (todo: ITodo) => {
    try {
      await deleteTodo({ params: { id: todo.id } });
      dispatch({ type: 'DELETE_TODO_SUCCESS', payload: todo.id });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: createError(getErrorMessage(err)) });
    }
  };

  const handleStartEdit = (todo: ITodo) => {
    dispatch({ type: 'START_EDIT', payload: todo });
  };

  const handleCloseEdit = () => {
    dispatch({ type: 'CLOSE_EDIT' });
  };

  const handleSaveEdit = async ({
    title,
    description,
  }: {
    title: string;
    description?: string;
  }) => {
    if (!state.editingTodo) return;
    dispatch({ type: 'SAVE_EDIT_START' });
    try {
      const updated = await updateTodo({
        params: { id: state.editingTodo.id },
        body: { title, description },
      });
      dispatch({ type: 'SAVE_EDIT_SUCCESS', payload: updated });
    } catch (err) {
      dispatch({ type: 'SAVE_EDIT_FAILURE', payload: createError(getErrorMessage(err)) });
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = state.todos.filter((todo) => todo.completed);
    if (!completedTodos.length) return;

    dispatch({ type: 'CLEAR_COMPLETED_START' });
    try {
      await Promise.all(completedTodos.map((todo) => deleteTodo({ params: { id: todo.id } })));
      dispatch({
        type: 'CLEAR_COMPLETED_SUCCESS',
        payload: completedTodos.map((todo) => todo.id),
      });
    } catch (err) {
      dispatch({
        type: 'CLEAR_COMPLETED_FAILURE',
        payload: createError(getErrorMessage(err)),
      });
    }
  };

  const setFilter = (value: FilterValue) => {
    dispatch({ type: 'SET_FILTER', payload: value });
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: emptyError });
  };
  const handleReorderTodos = useCallback((orderedIds: string[]) => {
    if (!orderedIds.length) return;
    dispatch({ type: 'REORDER_TODOS', payload: orderedIds });
  }, []);

  const filteredTodos = useMemo(() => {
    switch (state.filter) {
      case 'active':
        return state.todos.filter((todo) => !todo.completed);
      case 'completed':
        return state.todos.filter((todo) => todo.completed);
      default:
        return state.todos;
    }
  }, [state.filter, state.todos]);

  const itemsLeft = useMemo(
    () => state.todos.filter((todo) => !todo.completed).length,
    [state.todos]
  );

  const hasCompleted = useMemo(() => state.todos.some((todo) => todo.completed), [state.todos]);

  return {
    state,
    filteredTodos,
    itemsLeft,
    hasCompleted,
    fetchTodos,
    setFilter,
    handleCreate,
    handleToggle,
    handleDelete,
    handleStartEdit,
    handleCloseEdit,
    handleSaveEdit,
    handleClearCompleted,
    handleReorderTodos,
    clearError,
  };
};

export default useTodo;
