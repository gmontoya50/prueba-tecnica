import TodoItem from "./TodoItem";
import type { Todo } from "../api/todos";

type Props = {
  items: Todo[];
  onUpdated: (t: Todo) => void;
};

export default function TodosList({ items, onUpdated }: Props) {
  if (!items.length) return <p>Sin registros.</p>;

  return (
    <ul style={{ display: "grid", gap: 8, padding: 0, listStyle: "none" }}>
      {items.map((t) => (
        <TodoItem key={t.id} todo={t} onUpdated={onUpdated} />
      ))}
    </ul>
  );
}
