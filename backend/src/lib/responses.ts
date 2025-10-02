import type { APIGatewayProxyResultV2 } from 'aws-lambda';

type ResponseHeaders = Record<string, string>;

export function success<T>(statusCode: number, body: T): APIGatewayProxyResultV2<string> {
  const headers: ResponseHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
  };

  return {
    statusCode,
    headers,
    body: JSON.stringify(body),
  };
}

export function failure(statusCode: number, message: string): APIGatewayProxyResultV2<string> {
  return success(statusCode, { message });
}
