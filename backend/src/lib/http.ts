export const ok = (body: unknown) => ({
  statusCode: 200,
  body: JSON.stringify(body),
});

export const created = (body: unknown) => ({
  statusCode: 201,
  body: JSON.stringify(body),
});

export const badRequest = (message: string) => ({
  statusCode: 400,
  body: JSON.stringify({ error: message }),
});

export const notFound = (message = "Not found") => ({
  statusCode: 404,
  body: JSON.stringify({ error: message }),
});
