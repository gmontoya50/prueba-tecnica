export interface CreateTodoInput {
  title: string;
  description?: string;
  completed?: boolean;
}
export interface UpdateTodoInput {
  title?: string;
  description?: string;
  completed?: boolean;
}
export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  ttl?: number;
}

export interface CreateTodoArgs {
  body: CreateTodoInput;
}

export interface ListTodosParams {
  limit?: number;
  cursor?: { id: string };
}

export interface ListTodosArgs {
  params?: ListTodosParams;
}

export interface GetTodoArgs {
  params: { id: string };
}

export interface UpdateTodoArgs {
  params: { id: string };
  body: UpdateTodoInput;
}

export interface DeleteTodoArgs {
  params: { id: string };
  body?: { retainDays?: number };
}
