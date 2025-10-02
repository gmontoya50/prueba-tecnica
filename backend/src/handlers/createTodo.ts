import { withErrorHandling } from '@/lib/errorHandling';
import { success } from '@/lib/responses';
import { createTodoSchema } from '@/schemas/todo.schema';
import { TodosService } from '@/services/todo.service';
import type { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from 'aws-lambda';

const createTodo = async (event: APIGatewayProxyEventV2) => {
  const body = createTodoSchema.parse(event.body);
  const service = new TodosService();
  const res = await service.createTodo({ body });
  return success(201, res);
};

export const handler: APIGatewayProxyHandlerV2 = withErrorHandling(createTodo);
