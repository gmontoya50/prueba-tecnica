import { withErrorHandling } from '@/lib/errorHandling';
import { success } from '@/lib/responses';
import { urlRequestSchema } from '@/schemas/todo.schema';
import { TodosService } from '@/services/todo.service';
import type { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from 'aws-lambda';

const uploadUrl = async (event: APIGatewayProxyEventV2) => {
  const body = urlRequestSchema.parse(event.body);
  const service = new TodosService();
  const { uploadUrl, key } = await service.getAttachmentUploadUrl(body);
  return success(200, { uploadUrl, attachmentKey: key });
};

export const handler: APIGatewayProxyHandlerV2 = withErrorHandling(uploadUrl);
