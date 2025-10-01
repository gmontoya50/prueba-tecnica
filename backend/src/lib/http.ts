type Body = unknown;

const baseHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
};

const json = (statusCode: number, body?: Body) => ({
  statusCode,
  headers: baseHeaders,
  body: body === undefined ? "" : JSON.stringify(body),
});

export const ok = (body?: Body) => json(200, body);
export const created = (body?: Body) => json(201, body);
export const noContent = () => json(204);

export const badRequest = (message = "Bad Request") =>
  json(400, { error: message });

export const notFound = (message = "Not Found") =>
  json(404, { error: message });

export const serverError = (e: unknown) => {
  // no incluir detalle en prod
  return json(500, {
    error: "Internal Error",
    detail: e instanceof Error ? e.message : String(e),
  });
};
