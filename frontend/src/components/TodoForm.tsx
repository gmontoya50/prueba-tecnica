import React, { useState } from "react";
import { Stack, TextField, Button } from "@mui/material";
import { useNotify } from "@/notifications";

// Ajusta este tipo a tu modelo real si difiere
export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

type Props = {
  // Opción A: pásame una función para crear (recomendado para desacoplar de la API)
  onCreate?: (title: string) => Promise<Todo>;

  // Opción B: si prefieres que el componente emita el resultado y tú te encargas afuera
  onCreated?: (todo: Todo) => void;

  // Deshabilita el botón durante request externo, opcional
  disabled?: boolean;
};

/**
 * TodoForm
 * - Valida campo vacío
 * - Muestra notificaciones de éxito/error
 * - Emite el nuevo todo vía `onCreated` si se provee
 * - Puede delegar la creación real vía `onCreate`
 *
 * Si quieres usar tu `api.ts`, mira el bloque comentado abajo.
 */
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

      let created: Todo;

      if (onCreate) {
        // Opción A: usar función inyectada
        created = await onCreate(value);
      } else {
        // Opción B (comentada): usa tu api.ts directamente
        // Descomenta y ajusta si prefieres este camino:
        //
        // import { createTodo } from "@/api";  // asegúrate del path correcto
        // created = await createTodo({ title: value });
        //
        // Para evitar error de import dinámico en TSX inline, dejaré mock temporal:
        created = { id: crypto.randomUUID(), title: value, completed: false };
      }

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
        <Button
          variant="contained"
          type="submit"
          disabled={loading || disabled}
        >
          {loading ? "Agregando..." : "Agregar"}
        </Button>
      </Stack>
    </form>
  );
};

export default TodoForm;
