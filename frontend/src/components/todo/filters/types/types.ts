import { FilterValue } from '../../../../hooks/useTodos/types/types';

export interface ITodoFiltersProps {
  activeFilter: FilterValue;
  onFilterChange: (value: FilterValue) => void;
  itemsLeft: number;
  onClearCompleted: () => void;
  clearing: boolean;
  disableClear: boolean;
}
