import { AlertColor } from '@mui/material';

export interface ITodoAlertProps {
  show: boolean;
  message: string;
  severity?: AlertColor;
  handleClose: () => void;
}
