import { withErrorHandling } from '@/lib/errorHandling';
import { success } from '@/lib/responses';
import { idParamSchema } from '@/schemas/todo.schema';
import { TodosService } from '@/services/todo.service';
import type { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from 'aws-lambda';

const getTodo = async (event: APIGatewayProxyEventV2) => {
  const { id } = idParamSchema.parse(event.pathParameters);
  const service = new TodosService();
  const { data } = await service.getTodo({ params: { id } });
  return success(200, { data });
};
export const handler: APIGatewayProxyHandlerV2 = withErrorHandling(getTodo);
