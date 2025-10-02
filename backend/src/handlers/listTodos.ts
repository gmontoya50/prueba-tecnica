import { withErrorHandling } from '@/lib/errorHandling';
import { success } from '@/lib/responses';
import { listTodosQuerySchema } from '@/schemas/todo.schema';
import { TodosService } from '@/services/todo.service';
import type { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from 'aws-lambda';

const encodeCursor = (key?: { id: string }) =>
  key ? Buffer.from(JSON.stringify(key)).toString('base64') : undefined;

const listTodos = async (event: APIGatewayProxyEventV2) => {
  const { limit, cursor } = listTodosQuerySchema.parse(event.queryStringParameters);
  const service = new TodosService();
  const { data, nextPage } = await service.listTodo({
    params: { limit, cursor },
  });

  return success(200, {
    data,
    nextCursor: encodeCursor(nextPage),
    pagination: { limit },
  });
};

export const handler: APIGatewayProxyHandlerV2 = withErrorHandling(listTodos);
