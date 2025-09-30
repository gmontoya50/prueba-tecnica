// src/App.tsx
import "./styles.css";
import TodosList from "./components/TodosList";
import TodoForm from "./components/TodoForm";
import { useEffect, useState } from "react";
import { fetchTodos, type Todo } from "./api/todos";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // cargar todos al inicio
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchTodos();
        setTodos(data ?? []);
      } catch (e: any) {
        setError(e.message || "Error cargando todos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function handleCreated(newTodo: Todo) {
    setTodos((prev) => [...prev, newTodo]);
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>Todos</h1>
      </header>
      <main className="app__main" style={{ maxWidth: 600, margin: "0 auto" }}>
        <TodoForm onCreated={handleCreated} />
        {loading ? (
          <p>Cargando…</p>
        ) : error ? (
          <p style={{ color: "crimson" }}>Error: {error}</p>
        ) : (
          <TodosList items={todos} />
        )}
      </main>
    </div>
  );
}
