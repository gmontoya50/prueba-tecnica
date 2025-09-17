import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { success, failure } from '../lib/responses';

interface CreateTodoPayload {
  title: string;
  description?: string;
  completed?: boolean;
  attachmentKey?: string | null;
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {

    return success(201, 'Not implemented');
  } catch (error) {
    console.error('createTodo error', error);
    return failure(500, 'Failed to create todo');
  }
};
