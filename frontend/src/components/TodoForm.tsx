import React, { useState } from "react";
import { Stack, TextField, Button } from "@mui/material";
import { useNotify } from "@/notifications/NotificationsProvider";
import { createTodo, type Todo } from "@/api/todos";

type Props = {
  // Opción A: el padre provee la función de creación (usa la API o lo que quiera)
  onCreate?: (title: string) => Promise<Todo>;
  // Opción B: el componente emite el nuevo todo ya creado
  onCreated?: (todo: Todo) => void;
  disabled?: boolean;
};

const TodoForm: React.FC<Props> = ({ onCreate, onCreated, disabled }) => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const { success, error } = useNotify();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = title.trim();
    if (!value) {
      error("Por favor ingresa un texto");
      return;
    }

    try {
      setLoading(true);
      // Usar id del backend
      const created = onCreate
        ? await onCreate(value)
        : await createTodo(value);

      setTitle("");
      onCreated?.(created);
      success("Todo agregado con éxito");
    } catch (e) {
      console.error(e);
      error("No se pudo agregar el Todo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="row" spacing={1}>
        <TextField
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nueva tarea..."
          size="small"
          disabled={loading || disabled}
          fullWidth
        />
        <Button variant="contained" type="submit" disabled={loading || disabled}>
          {loading ? "Agregando..." : "Agregar"}
        </Button>
      </Stack>
    </form>
  );
};

export default TodoForm;
