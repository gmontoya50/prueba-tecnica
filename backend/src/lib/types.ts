export type TodoStatus = "pending" | "completed";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}
