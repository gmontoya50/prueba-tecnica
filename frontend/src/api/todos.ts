import config from "../config";

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  // opcionalmente: description?: string; updatedAt?: string;
};

// Respuesta cruda del backend
type ApiTodo = {
  id: string;
  title: string;
  status?: "pending" | "completed";
  completed?: boolean;           // por si alguna ruta ya lo trae
  description?: string;
  updatedAt?: string;
};

function toClient(t: ApiTodo): Todo {
  return {
    id: t.id,
    title: t.title,
    completed: t.completed ?? (t.status === "completed"),
  };
}

export async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch(`${config.apiUrl}/todos`);
  if (!res.ok) throw new Error("Error al obtener todos");
  const data: ApiTodo[] = await res.json();
  return (Array.isArray(data) ? data : []).map(toClient);
}

export async function createTodo(title: string): Promise<Todo> {
  const res = await fetch(`${config.apiUrl}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Error al crear todo");
  const data: ApiTodo = await res.json();
  return toClient(data);
}

export async function updateTodo(id: string, data: Partial<Todo>): Promise<Todo> {
  const res = await fetch(`${config.apiUrl}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`PUT /todos/${id} → ${res.status} ${res.statusText} ${text}`);
  }
  const updated: ApiTodo = await res.json();
  return toClient(updated);
}

export async function deleteTodo(id: string): Promise<void> {
  const res = await fetch(`${config.apiUrl}/todos/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) throw new Error("Error al eliminar todo");
}
