import { ITodo } from '../../../services/todo.api';

export type FilterValue = 'all' | 'active' | 'completed';

export interface TodoError {
  isError: boolean;
  message: string;
}

export interface TodoLoadingState {
  fetch: boolean;
  create: boolean;
  saveEdit: boolean;
  clearCompleted: boolean;
}

export interface TodoState {
  todos: ITodo[];
  filter: FilterValue;
  loading: TodoLoadingState;
  error: TodoError;
  editingTodo: ITodo | null;
}

export type TodoAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: ITodo[] }
  | { type: 'FETCH_FAILURE'; payload: TodoError }
  | { type: 'SET_FILTER'; payload: FilterValue }
  | { type: 'CREATE_START' }
  | { type: 'CREATE_SUCCESS'; payload: ITodo }
  | { type: 'CREATE_FAILURE'; payload: TodoError }
  | { type: 'UPDATE_TODO_SUCCESS'; payload: ITodo }
  | { type: 'DELETE_TODO_SUCCESS'; payload: ITodo['id'] }
  | { type: 'START_EDIT'; payload: ITodo }
  | { type: 'CLOSE_EDIT' }
  | { type: 'SAVE_EDIT_START' }
  | { type: 'SAVE_EDIT_SUCCESS'; payload: ITodo }
  | { type: 'SAVE_EDIT_FAILURE'; payload: TodoError }
  | { type: 'CLEAR_COMPLETED_START' }
  | { type: 'CLEAR_COMPLETED_SUCCESS'; payload: ITodo['id'][] }
  | { type: 'CLEAR_COMPLETED_FAILURE'; payload: TodoError }
  | { type: 'REORDER_TODOS'; payload: string[] }
  | { type: 'SET_ERROR'; payload: TodoError };

export interface UseTodoReturn {
  state: TodoState;
  filteredTodos: ITodo[];
  itemsLeft: number;
  hasCompleted: boolean;
  fetchTodos: () => Promise<void>;
  setFilter: (value: FilterValue) => void;
  handleCreate: (payload: { title: string; description?: string }) => Promise<void>;
  handleToggle: (todo: ITodo) => Promise<void>;
  handleDelete: (todo: ITodo) => Promise<void>;
  handleStartEdit: (todo: ITodo) => void;
  handleCloseEdit: () => void;
  handleSaveEdit: (payload: { title: string; description?: string }) => Promise<void>;
  handleClearCompleted: () => Promise<void>;
  handleReorderTodos: (orderedIds: string[]) => void;
  clearError: () => void;
}
