export interface ITodo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  attachmentKey: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  ttl?: number;
}

export interface ITodoPayload {
  title: string;
  description?: string;
  completed?: boolean;
  attachmentKey?: string | null;
}

export interface IGetTodoArgs {
  id: string;
}

export interface IListTodosArgs {
  params?: { limit?: number; cursor?: string };
}

export interface ICreateTodoArgs {
  body: ITodoPayload;
}

export interface IUpdateTodoArgs {
  params?: { id: string };
  body?: Partial<ITodoPayload>;
}

export interface IDeleteTodoArgs {
  params?: { id: string };
  body?: { retainDays?: number | undefined };
}

export interface IListAllTodosResponse {
  data: ITodo[];
}

export interface ITodoResponse {
  data: ITodo;
}
