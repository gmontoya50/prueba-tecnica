import List from "@mui/material/List";
import type { Todo } from "../api/todos";
import TodoItem from "./TodoItem";

type Props = {
  items: Todo[];
  onUpdated: (t: Todo) => void;
  onDeleted: (id: string) => void;
  dense?: boolean;
};

export default function TodosList({ items, onUpdated, onDeleted, dense = false }: Props) {
  if (!items.length) return <p>Sin registros.</p>;

  return (
    <List dense={dense}>
      {items.map((t) => (
        <TodoItem key={t.id} todo={t} onUpdated={onUpdated} onDeleted={onDeleted} />
      ))}
    </List>
  );
}
