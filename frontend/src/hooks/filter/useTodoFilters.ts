import { useCallback, useContext, useMemo } from 'react';

import { todoContext } from '../../context/todo/todoContex';
import { FilterValue } from '../useTodos/types/types';
import { TodoFiltersHook } from './types/types';

const useTodoFilters = (): TodoFiltersHook => {
  const {
    state: { filter, loading },
    hasCompleted,
    itemsLeft,
    setFilter,
    handleClearCompleted,
  } = useContext(todoContext);

  const disableClear = useMemo(() => !hasCompleted, [hasCompleted]);

  const onFilterChange = useCallback(
    (value: FilterValue) => {
      setFilter(value);
    },
    [setFilter]
  );

  const onClearCompleted = useCallback(() => {
    void handleClearCompleted();
  }, [handleClearCompleted]);

  return {
    activeFilter: filter,
    itemsLeft,
    clearing: loading.clearCompleted,
    disableClear,
    onFilterChange,
    onClearCompleted,
  };
};

export default useTodoFilters;
