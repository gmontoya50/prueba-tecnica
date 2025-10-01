import config from "../config";

export type Todo = {
  id: string;
  title: string;
  completed: boolean;               // en el front trabajamos con boolean
  createdAt?: string;
  updatedAt?: string;
};

// Respuesta del backend puede traer status o completed
type ApiTodo = {
  id: string;
  title: string;
  status?: "pending" | "completed";
  completed?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

function toClient(t: ApiTodo): Todo {
  const completed =
    typeof t.completed === "boolean"
      ? t.completed
      : t.status === "completed";
  return {
    id: String(t.id),
    title: String(t.title ?? ""),
    completed,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
}

async function safeJson(res: Response) {
  try { return await res.json(); } catch { return {}; }
}

// Listar tareas
export async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch(`${config.apiUrl}/todos`);
  if (!res.ok) throw new Error(`GET /todos → ${res.status}`);
  const data = await res.json();
  return (Array.isArray(data) ? data : []).map(toClient);
}

// Crear una tarea
export async function createTodo(title: string): Promise<Todo> {
  const res = await fetch(`${config.apiUrl}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(`POST /todos → ${res.status} ${JSON.stringify(err)}`);
  }
  return toClient(await res.json());
}

// Actualizar una tarea
export async function updateTodo(id: string, data: Partial<Todo>): Promise<Todo> {
  // Unificamos payload: siempre enviar 'status' al backend
  const payload: any = {};
  if (typeof data.title === "string") payload.title = data.title.trim();
  if (typeof data.completed === "boolean") {
    payload.status = data.completed ? "completed" : "pending";
  }

  const res = await fetch(`${config.apiUrl}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`PUT /todos/${id} → ${res.status} ${res.statusText} ${text}`);
  }
  return toClient(await res.json());
}

// Eliminar una tarea
export async function deleteTodo(id: string): Promise<void> {
  const res = await fetch(`${config.apiUrl}/todos/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(`DELETE /todos/${id} → ${res.status} ${JSON.stringify(err)}`);
  }
}
