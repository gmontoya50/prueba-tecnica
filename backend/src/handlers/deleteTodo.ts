import { withErrorHandling } from '@/lib/errorHandling';
import { success } from '@/lib/responses';
import { deleteTodoBodySchema, idParamSchema } from '@/schemas/todo.schema';
import { TodosService } from '@/services/todo.service';
import type { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from 'aws-lambda';

const deleteTodo = async (event: APIGatewayProxyEventV2) => {
  const { id } = idParamSchema.parse(event.pathParameters);
  const parsedBody = deleteTodoBodySchema.parse(event.body);
  const service = new TodosService();
  const { data } = await service.deleteTodo({ params: { id }, body: parsedBody });
  return success(200, { data });
};

export const handler: APIGatewayProxyHandlerV2 = withErrorHandling(deleteTodo);
