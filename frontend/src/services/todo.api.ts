import { ApiError, request } from '../lib/api';
import {
  ICreateTodoArgs,
  IDeleteTodoArgs,
  IGetTodoArgs,
  IListAllTodosResponse,
  IListTodosArgs,
  ITodoPayload,
  ITodoResponse,
  IUpdateTodoArgs,
} from './types/types';

export class TodoService {
  async createTodo({ body }: ICreateTodoArgs) {
    return this.execute(async () => {
      const response = await request<ITodoResponse, ITodoPayload>({
        method: 'POST',
        url: '/todos',
        body,
      });

      return response.data;
    });
  }

  async getTodoById({ id }: IGetTodoArgs) {
    return this.execute(async () => {
      const response = await request<ITodoResponse>({
        method: 'GET',
        url: `/todos/${id}`,
      });

      return response.data;
    });
  }

  async listTodos({ params }: IListTodosArgs) {
    return this.execute(async () => {
      const response = await request<IListAllTodosResponse>({
        method: 'GET',
        url: '/todos',
        params,
      });

      return response.data;
    });
  }

  async updateTodo({ params, body }: IUpdateTodoArgs) {
    return this.execute(async () => {
      if (!params?.id) {
        throw new ApiError(400, 'Todo id is required for update');
      }

      const response = await request<ITodoResponse, Partial<ITodoPayload>>({
        method: 'PUT',
        url: `/todos/${params.id}`,
        body,
      });

      return response.data;
    });
  }

  async deleteTodo({ params, body }: IDeleteTodoArgs) {
    return this.execute(async () => {
      if (!params?.id) {
        throw new ApiError(400, 'Todo id is required for delete');
      }

      const response = await request<ITodoResponse, IDeleteTodoArgs['body']>({
        method: 'DELETE',
        url: `/todos/${params.id}`,
        body,
      });

      return response.data;
    });
  }

  private async execute<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): ApiError {
    if (error instanceof ApiError) {
      return error;
    }

    return new ApiError(500, 'Unexpected error while accessing the Todo API', error);
  }
}

export const todoService = new TodoService();

export const createTodo = (args: ICreateTodoArgs) => todoService.createTodo(args);
export const getTodoById = (args: IGetTodoArgs) => todoService.getTodoById(args);
export const listTodos = (args: IListTodosArgs) => todoService.listTodos(args);
export const updateTodo = (args: IUpdateTodoArgs) => todoService.updateTodo(args);
export const deleteTodo = (args: IDeleteTodoArgs) => todoService.deleteTodo(args);
