import React, { useEffect, useState } from 'react';

type Todo = {
  id: string;
  title: string;
  completed?: boolean;
};

const API =
  ((globalThis as any)?.import?.meta?.env?.VITE_API_URL) ||
  (process?.env as any)?.VITE_API_URL ||  'http://localhost:4000';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');

  // Carga inicial
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${API}/todos`);
        if (!res.ok) {
          const data = await safeJson(res);
          throw new Error(data?.error || `GET /todos failed (${res.status})`);
        }
        const data = await res.json();
        if (mounted) setTodos(data || []);
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Error');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const onAdd = async () => {
    if (!title.trim()) return;
    try {
      const res = await fetch(`${API}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) {
        const data = await safeJson(res);
        throw new Error(data?.error || `POST /todos failed (${res.status})`);
      }
      const created: Todo = await res.json();
      setTodos((prev) => [...prev, created]);
      setTitle('');
    } catch (e: any) {
      setError(e?.message || 'Error');
    }
  };

  const onToggle = async (id: string, nextChecked: boolean) => {
    const current = todos.find((t) => t.id === id);
    if (!current) return;
    try {
      const res = await fetch(`${API}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: nextChecked }),
      });
      if (!res.ok) {
        const data = await safeJson(res);
        throw new Error(data?.error || `PUT /todos/:id failed (${res.status})`);
      }
      const updated: Todo = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
    } catch (e: any) {
      setError(e?.message || 'Error');
    }
  };

  return (
    <div className="App">
      <h1>Todos</h1>

      {/* Form crear */}
      <div>
        <input
          placeholder="Agrega una tarea"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="input-agregar-tarea"
        />
        <button onClick={onAdd}>Agregar</button>
      </div>

      {/* Estados */}
      {loading && <p>Cargando…</p>}
      {!loading && error && <p>Error</p>}
      {!loading && !error && todos.length === 0 && <p>No hay tareas</p>}

      {/* Lista */}
      <ul>
        {todos.map((t) => (
          <li key={t.id}>
            <label>
              <input
                type="checkbox"
                checked={!!t.completed}
                onChange={(e) => onToggle(t.id, e.target.checked)}
                aria-label={t.title}
              />
              {t.title}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
