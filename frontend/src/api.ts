import { API_BASE } from './config';

export type Todo = {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
};

async function safeJson(res: Response) {
  try { return await res.json(); } catch { return null; }
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const data = await safeJson(res);
    const msg = (data && (data.error || data.message)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return (await res.json()) as T;
}

export const api = {
  list: () => fetch(`${API_BASE}/todos`).then(handle<Todo[]>),
  create: (title: string) =>
    fetch(`${API_BASE}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    }).then(handle<Todo>),
  update: (id: string, patch: Partial<Todo>) =>
    fetch(`${API_BASE}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch)
    }).then(handle<Todo>),
  remove: (id: string) =>
    fetch(`${API_BASE}/todos/${id}`, { method: 'DELETE' }).then(handle<{message:string}>),
};
