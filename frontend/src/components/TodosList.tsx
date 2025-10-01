// src/components/TodosList.tsx
import List from "@mui/material/List";
import type { Todo } from "@/api";
import TodoItem from "./TodoItem";

type Props = {
  items: Todo[];
  onUpdated: (t: Todo) => void;
  onDeleted: (id: string) => void;
  dense?: boolean;
};

export default function TodosList({ items, onUpdated, onDeleted, dense = false }: Props) {
  if (!items.length) return <p>No hay tareas.</p>;

  return (
    <List dense={dense}>
      {items.map((t) => {
        // Log de depuración para confirmar IDs
        console.debug("[TodosList] render id=", t.id);
        return (
          <TodoItem
            key={t.id}
            todo={t}
            onUpdated={onUpdated}
            onDeleted={onDeleted}
          />
        );
      })}
    </List>
  );
}
