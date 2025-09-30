import { useState } from "react";
import { updateTodo, type Todo } from "../api/todos";

type Props = {
  todo: Todo;
  onUpdated: (t: Todo) => void;
};

export default function TodoItem({ todo, onUpdated }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!title.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const updated = await updateTodo(todo.id, { title: title.trim() });
      onUpdated(updated);
      setEditing(false);
    } catch (e: any) {
      setError(e.message || "Error actualizando");
    } finally {
      setLoading(false);
    }
  }

  if (editing) {
    return (
      <li style={{ border: "1px solid #ddd", borderRadius: 6, padding: 12 }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
        <button onClick={handleSave} disabled={loading}>
          Guardar
        </button>
        <button onClick={() => setEditing(false)}>Cancelar</button>
        {error && <div style={{ color: "crimson" }}>{error}</div>}
      </li>
    );
  }

  return (
    <li style={{ border: "1px solid #ddd", borderRadius: 6, padding: 12 }}>
      <strong>{todo.title}</strong>
      <div style={{ fontSize: 12, opacity: 0.8 }}>
        Estado: {todo.completed ? "✔️ Completado" : "⏳ Pendiente"}
      </div>
      <button onClick={() => setEditing(true)}>✏️ Editar</button>
    </li>
  );
}
