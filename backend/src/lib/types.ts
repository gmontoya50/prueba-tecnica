export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  attachmentKey?: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface CreateTodoPayload {
  title: string;
  description?: string;
  completed?: boolean;
  attachmentKey?: string | null;
}

export interface UpdateTodoStatusPayload {
  completed: boolean;
}
