import { ChangeEvent, FormEvent } from 'react';

export interface UseEditTodoDialog {
  open: boolean;
  title: string;
  description: string;
  saving: boolean;
  onTitleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void> | void;
  onClose: () => void;
}
