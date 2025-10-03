import { ChangeEvent, FormEvent, useCallback, useContext, useEffect, useState } from 'react';

import { todoContext } from '../../context/todo/todoContex';
import { UseEditTodoDialog } from './types/types';

const useEditTodoDialog = (): UseEditTodoDialog => {
  const {
    state: { editingTodo, loading },
    handleCloseEdit,
    handleSaveEdit,
  } = useContext(todoContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title ?? '');
      setDescription(editingTodo.description ?? '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [editingTodo]);

  const handleTitleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  }, []);

  const handleDescriptionChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  }, []);

  const handleClose = useCallback(() => {
    if (!loading.saveEdit) {
      handleCloseEdit();
    }
  }, [handleCloseEdit, loading.saveEdit]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmedTitle = title.trim();
      const trimmedDescription = description.trim();
      if (!trimmedTitle) return;

      await handleSaveEdit({
        title: trimmedTitle,
        description: trimmedDescription ? trimmedDescription : undefined,
      });
    },
    [description, handleSaveEdit, title]
  );

  return {
    open: Boolean(editingTodo),
    title,
    description,
    saving: loading.saveEdit,
    onTitleChange: handleTitleChange,
    onDescriptionChange: handleDescriptionChange,
    onSubmit: handleSubmit,
    onClose: handleClose,
  };
};

export default useEditTodoDialog;
