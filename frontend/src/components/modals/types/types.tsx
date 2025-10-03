import { ChangeEvent, FormEvent } from 'react';

export interface IEditTodoDialogProps {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onTitleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void> | void;
  saving?: boolean;
}
