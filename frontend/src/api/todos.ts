import config from "../config";

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  // agrega campos si tu backend expone más
};

export async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch(`${config.apiUrl}/todos`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET /todos → ${res.status} ${res.statusText} ${text}`);
  }
  return res.json();
}
