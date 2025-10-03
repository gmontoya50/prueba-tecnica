export interface TodoAlertHook {
  show: boolean;
  message: string;
  severity: 'error';
  handleClose: () => void;
}
