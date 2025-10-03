import { ITodo } from '../../../../services/types/types';
import { ITodoEmptyStateProps } from '../../../emptyState/types/types';

export interface ITodoListProps {
  todos: ITodo[];
  onToggle: (todo: ITodo) => void;
  onDelete: (todo: ITodo) => void;
  onEdit: (todo: ITodo) => void;
  todoEmptyState: ITodoEmptyStateProps;
  onReorder: (orderedIds: string[]) => void;
}
