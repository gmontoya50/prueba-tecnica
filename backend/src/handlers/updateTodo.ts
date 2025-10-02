import { withErrorHandling } from '@/lib/errorHandling';
import { success } from '@/lib/responses';
import { idParamSchema, updateTodoPutSchema } from '@/schemas/todo.schema';
import { TodosService } from '@/services/todo.service';
import type { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from 'aws-lambda';

const updateTodo = async (event: APIGatewayProxyEventV2) => {
  const { id } = idParamSchema.parse(event.pathParameters);
  const body = updateTodoPutSchema.parse(event.body);
  const service = new TodosService();
  const { data } = await service.updateTodo({ params: { id }, body });
  return success(200, { data });
};

export const handler: APIGatewayProxyHandlerV2 = withErrorHandling(updateTodo);
