import { useContext, useMemo } from 'react';

import { todoContext } from '../../context/todo/todoContex';
import { TodoAlertHook } from './types/types';

const useTodoAlert = (): TodoAlertHook => {
  const {
    state: { error },
    clearError,
  } = useContext(todoContext);

  return useMemo(
    () => ({
      show: error.isError,
      message: error.message,
      severity: 'error' as const,
      handleClose: clearError,
    }),
    [clearError, error.isError, error.message]
  );
};

export default useTodoAlert;
