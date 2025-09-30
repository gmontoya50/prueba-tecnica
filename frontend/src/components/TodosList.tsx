// src/components/TodosList.tsx
import type { Todo } from "../api/todos";

type Props = {
  items: Todo[];
};

export default function TodosList({ items }: Props) {
  if (!items.length) return <p>Sin registros.</p>;

  return (
    <ul style={{ display: "grid", gap: 8, padding: 0, listStyle: "none" }}>
      {items.map((t) => (
        <li key={t.id} style={{ border: "1px solid #ddd", borderRadius: 6, padding: 12 }}>
          <strong>{t.title}</strong>
          <div style={{ fontSize: 12, opacity: 0.8 }}>
            Estado: {t.completed ? "✔️ Completado" : "⏳ Pendiente"}
          </div>
        </li>
      ))}
    </ul>
  );
}
