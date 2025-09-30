import config from "../config";

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

// Fetch Todos
export async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch(`${config.apiUrl}/todos`);
  if (!res.ok) throw new Error("Error al obtener todos");
  return res.json();
}

// Create Todo
export async function createTodo(title: string): Promise<Todo> {
  const res = await fetch(`${config.apiUrl}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Error al crear todo");
  return res.json();
}

// Actualizar Todo
// actualizar un todo
export async function updateTodo(id: string, data: Partial<Todo>): Promise<Todo> {
  const res = await fetch(`${config.apiUrl}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar todo");
  return res.json();
}