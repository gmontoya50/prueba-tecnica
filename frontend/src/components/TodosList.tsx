import List from "@mui/material/List";
import type { Todo } from "../api/todos";
import TodoItem from "./TodoItem";

type Props = {
  items: Todo[];
  onUpdated: (t: Todo) => void;
  onDeleted: (id: string) => void;
};

export default function TodosList({ items, onUpdated, onDeleted }: Props) {
  if (!items.length) return <p>Sin registros.</p>;
  return (
    <List>
      {items.map((t) => (
        <TodoItem key={t.id} todo={t} onUpdated={onUpdated} onDeleted={onDeleted} />
      ))}
    </List>
  );
}
