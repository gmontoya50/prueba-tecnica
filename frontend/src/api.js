import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000',
});

export async function listTodos() {
  const { data } = await client.get('/todos');
  return data;
}

export async function createTodo(payload) {
  const { data } = await client.post('/todos', payload);
  return data;
}

export async function updateTodoStatus(id, completed) {
  const { data } = await client.patch(`/todos/${id}`, { completed });
  return data;
}

export async function updateTodo(id, payload) {
  const { data } = await client.patch(`/todos/${id}`, payload);
  return data;
}

export async function deleteTodo(id) {
  await client.delete(`/todos/${id}`);
}

export default {
  listTodos,
  createTodo,
  updateTodoStatus,
  updateTodo,
  deleteTodo,
};
