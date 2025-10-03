import { TodoAction, TodoError, TodoState } from '../types/types';

const createEmptyError = (): TodoError => ({ isError: false, message: '' });

export const initialState: TodoState = {
  todos: [],
  filter: 'all',
  loading: {
    fetch: true,
    create: false,
    saveEdit: false,
    clearCompleted: false,
  },
  error: createEmptyError(),
  editingTodo: null,
};

export const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        loading: { ...state.loading, fetch: true },
        error: createEmptyError(),
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        todos: action.payload,
        loading: { ...state.loading, fetch: false },
        error: createEmptyError(),
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        loading: { ...state.loading, fetch: false },
        error: action.payload,
      };
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload,
      };
    case 'CREATE_START':
      return {
        ...state,
        loading: { ...state.loading, create: true },
        error: createEmptyError(),
      };
    case 'CREATE_SUCCESS':
      return {
        ...state,
        loading: { ...state.loading, create: false },
        todos: [action.payload, ...state.todos],
        error: createEmptyError(),
      };
    case 'CREATE_FAILURE':
      return {
        ...state,
        loading: { ...state.loading, create: false },
        error: action.payload,
      };
    case 'UPDATE_TODO_SUCCESS':
      return {
        ...state,
        todos: state.todos.map((todo) => (todo.id === action.payload.id ? action.payload : todo)),
        error: createEmptyError(),
      };
    case 'DELETE_TODO_SUCCESS':
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
        error: createEmptyError(),
      };
    case 'START_EDIT':
      return {
        ...state,
        editingTodo: action.payload,
      };
    case 'CLOSE_EDIT':
      if (state.loading.saveEdit) {
        return state;
      }
      return {
        ...state,
        editingTodo: null,
      };
    case 'SAVE_EDIT_START':
      return {
        ...state,
        loading: { ...state.loading, saveEdit: true },
        error: createEmptyError(),
      };
    case 'SAVE_EDIT_SUCCESS':
      return {
        ...state,
        loading: { ...state.loading, saveEdit: false },
        editingTodo: null,
        todos: state.todos.map((todo) => (todo.id === action.payload.id ? action.payload : todo)),
        error: createEmptyError(),
      };
    case 'SAVE_EDIT_FAILURE':
      return {
        ...state,
        loading: { ...state.loading, saveEdit: false },
        error: action.payload,
      };
    case 'CLEAR_COMPLETED_START':
      return {
        ...state,
        loading: { ...state.loading, clearCompleted: true },
        error: createEmptyError(),
      };
    case 'CLEAR_COMPLETED_SUCCESS':
      return {
        ...state,
        loading: { ...state.loading, clearCompleted: false },
        todos: state.todos.filter((todo) => !action.payload.includes(todo.id)),
        error: createEmptyError(),
      };
    case 'CLEAR_COMPLETED_FAILURE':
      return {
        ...state,
        loading: { ...state.loading, clearCompleted: false },
        error: action.payload,
      };
    case 'REORDER_TODOS': {
      const idOrder = action.payload; 
      const byId = new Map(state.todos.map((t) => [t.id, t]));
      const reordered = idOrder
        .map((id) => byId.get(id))
        .filter((t): t is NonNullable<typeof t> => Boolean(t));
      return { ...state, todos: reordered };
    }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};
