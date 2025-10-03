import { ITodo } from '../../../../services/types/types';

export interface ITodoItemProps {
  todo: ITodo;
  onToggle: (todo: ITodo) => void;
  onDelete: (todo: ITodo) => void;
  divider?: boolean;
  onEdit: (todo: ITodo) => void;
}
