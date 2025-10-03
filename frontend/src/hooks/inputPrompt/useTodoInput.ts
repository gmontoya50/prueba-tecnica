import { ChangeEvent, FormEvent, useCallback, useMemo, useState } from 'react';

import { UseTodoInputParams } from './types/types';

export const useTodoInput = ({ onCreate, busy }: UseTodoInputParams) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showDescription, setShowDescription] = useState(false);

  const isSubmitDisabled = useMemo(
    () => Boolean(busy) || title.trim().length === 0,
    [busy, title]
  );

  const handleChangeTitle = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  const handleChangeDescription = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const toggleDescription = () => {
    setShowDescription((prev) => !prev);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    const payload = {
      title: trimmed,
      description: description.trim() ? description.trim() : undefined,
    };

    try {
      await onCreate(payload);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error(err);
    }
  };

  return {
    title,
    description,
    showDescription,
    isSubmitDisabled,
    handleChangeTitle,
    handleChangeDescription,
    toggleDescription,
    handleSubmit,
  };
};

