import { useState } from "react";
import { updateTodo, deleteTodo, type Todo } from "../api/todos";

type Props = {
  todo: Todo;
  onUpdated: (t: Todo) => void;
  onDeleted: (id: string) => void;   // 👈 nuevo
};

export default function TodoItem({ todo, onUpdated, onDeleted }: Props) {
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

  async function handleDelete() {
    if (!confirm("¿Eliminar este todo?")) return;
    setLoading(true);
    setError(null);
    try {
      await deleteTodo(todo.id);
      onDeleted(todo.id);
    } catch (e: any) {
      setError(e.message || "Error eliminando");
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
        <button onClick={handleSave} disabled={loading}>Guardar</button>
        <button onClick={() => setEditing(false)} disabled={loading}>Cancelar</button>
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
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button onClick={() => setEditing(true)} disabled={loading}>✏️ Editar</button>
        <button onClick={handleDelete} disabled={loading}>🗑️ Eliminar</button>
      </div>
      {error && <div style={{ color: "crimson" }}>{error}</div>}
    </li>
  );
}
