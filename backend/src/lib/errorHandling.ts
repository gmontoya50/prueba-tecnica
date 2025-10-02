import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda';
import { failure } from '@/lib/responses';
import { mapError } from '@/lib/errors';

type AsyncHandlerV2 = (e: APIGatewayProxyEventV2, c: Context) => Promise<APIGatewayProxyResultV2>;

export const withErrorHandling =
  (funcHandler: AsyncHandlerV2): AsyncHandlerV2 =>
  async (event, context) => {
    try {
      return await funcHandler(event, context);
    } catch (e) {
      const httpError = mapError(e);
      return failure(httpError.status, httpError.message);
    }
  };
