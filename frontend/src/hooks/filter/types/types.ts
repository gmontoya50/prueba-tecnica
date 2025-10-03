import { FilterValue } from '../../useTodos/types/types';

export interface TodoFiltersHook {
  activeFilter: FilterValue;
  itemsLeft: number;
  clearing: boolean;
  disableClear: boolean;
  onFilterChange: (value: FilterValue) => void;
  onClearCompleted: () => void;
}
