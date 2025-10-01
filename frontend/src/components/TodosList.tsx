// src/components/TodosList.tsx
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { Todo } from "@/api";
import TodoItem from "./TodoItem";

type Props = {
  items: Todo[];
  onUpdated: (t: Todo) => void;
  onDeleted: (id: string) => void;
  dense?: boolean;
};

export default function TodosList({ items, onUpdated, onDeleted, dense = false }: Props) {
  if (!items.length) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100px"
      >
        <Typography variant="body1" color="textSecondary" align="center">
          No hay tareas.
        </Typography>
      </Box>
    );
  }

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
