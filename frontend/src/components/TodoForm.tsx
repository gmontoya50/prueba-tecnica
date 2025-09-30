import { useState } from "react";
import { createTodo, type Todo } from "../api/todos";

type Props = {
  onCreated: (newTodo: Todo) => void;
};

export default function TodoForm({ onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const todo = await createTodo(title.trim());
      onCreated(todo); // avisamos al padre
      setTitle(""); // limpiar input
    } catch (err: any) {
      setError(err.message || "Error creando todo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <input
        type="text"
        placeholder="Nuevo todo..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
        style={{ padding: 8, marginRight: 8 }}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Agregar"}
      </button>
      {error && <div style={{ color: "crimson" }}>{error}</div>}
    </form>
  );
}
