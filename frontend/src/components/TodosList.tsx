import { useEffect, useState } from "react";
import { fetchTodos, type Todo } from "../api/todos";

export default function TodosList() {
  const [items, setItems] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchTodos();
        setItems(data ?? []);
      } catch (e: any) {
        setError(e?.message || "Error cargando todos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Cargando…</p>;
  if (error) return <p style={{ color: "crimson" }}>Error: {error}</p>;
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
