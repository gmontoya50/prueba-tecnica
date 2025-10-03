import { FC } from 'react';
import { Alert, Collapse } from '@mui/material';
import { ITodoAlertProps } from './types/types';

const TodoAlert: FC<ITodoAlertProps> = ({ show, message, severity = 'error', handleClose }) => (
  <Collapse in={show}>
    <Alert severity={severity} onClose={handleClose} sx={{ borderRadius: 4, mb: 3 }}>
      {message}
    </Alert>
  </Collapse>
);

export default TodoAlert;
