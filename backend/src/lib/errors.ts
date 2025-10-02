import { ZodError } from 'zod';

export type ErrorNames =
  | 'BAD_REQUEST'
  | 'NOT_FOUND'
  | 'INTERNAL_SERVER_ERROR'
  | 'TOO_MANY_REQUESTS';

const errorCodes: Record<ErrorNames, number> = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public detail?: unknown
  ) {
    super(message);
  }
}

export const appErrors = {
  badRequest: (msg?: string, detail?: unknown) =>
    new HttpError(errorCodes['BAD_REQUEST'], msg || 'Bad Request', detail),
  notFound: (msg?: string, detail?: unknown) =>
    new HttpError(errorCodes['NOT_FOUND'], msg || 'Not found', detail),
  tooManyReq: (msg?: string, detail?: unknown) =>
    new HttpError(errorCodes['TOO_MANY_REQUESTS'], msg || 'Too Many Requests', detail),
  internalServerError: (msg?: string, detail?: unknown) =>
    new HttpError(errorCodes['INTERNAL_SERVER_ERROR'], msg || 'Internal Server Error', detail),
};

const mapAwsError = (e: any): HttpError => {
  switch (e?.name) {
    case 'ConditionalCheckFailedException':
      return appErrors.notFound();
    case 'ValidationException':
      return appErrors.badRequest();
    case 'ProvisionedThroughputExceededException':
    case 'ThrottlingException':
      return appErrors.tooManyReq();
    default:
      return appErrors.internalServerError();
  }
};

export function mapError(e: unknown): HttpError {
  if (e instanceof HttpError) return e;
  if (e instanceof ZodError) {
    const msg = e.issues.map((i) => `${i.path.join('.') || 'body'}: ${i.message}`).join('; ');
    return appErrors.badRequest(msg);
  }
  return mapAwsError(e);
}
