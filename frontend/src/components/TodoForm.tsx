import React, { useState } from 'react';

type Props = {
  onAdd: (title: string) => Promise<void> | void;
  disabled?: boolean;
};

export default function TodoForm({ onAdd, disabled }: Props) {
  const [title, setTitle] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await onAdd(title.trim());
    setTitle('');
  };

  return (
    <form onSubmit={submit} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
      <input
        placeholder="Agrega una tarea"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="input-agregar-tarea"
        disabled={disabled}
      />
      <button type="submit" disabled={disabled}>Agregar</button>
    </form>
  );
}
