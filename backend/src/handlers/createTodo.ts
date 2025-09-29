import { randomUUID } from "crypto";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TODO_TABLE, ensureTableReady } from "../lib/dynamo";
import { badRequest, created } from "../lib/http";
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

type TodoStatus = "pending" | "completed";
interface CreateTodoBody {
  title?: string;
  description?: string;
  status?: TodoStatus;
}

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  // Asegura la tabla en entorno local (DynamoDB Local)
  await ensureTableReady();

  // Parseo robusto del body
  let body: CreateTodoBody = {};
  try {
    body =
      typeof event.body === "string"
        ? (JSON.parse(event.body) as CreateTodoBody)
        : ((event.body as unknown) as CreateTodoBody) || {};
  } catch {
    return {
      ...badRequest("Invalid JSON"),
      headers: { "content-type": "application/json" }
    };
  }

  // Validaciones mínimas
  if (!body.title || typeof body.title !== "string" || body.title.trim() === "") {
    return {
      ...badRequest("Title is required (non-empty string)"),
      headers: { "content-type": "application/json" }
    };
  }
  if (body.status && body.status !== "pending" && body.status !== "completed") {
    return {
      ...badRequest("Invalid status (allowed: pending | completed)"),
      headers: { "content-type": "application/json" }
    };
  }

  const now = new Date().toISOString();
  const item = {
    id: randomUUID(),
    title: body.title.trim(),
    description: typeof body.description === "string" ? body.description : "",
    status: (body.status || "pending") as TodoStatus,
    createdAt: now,
    updatedAt: now
  };

  try {
    await ddb.send(
      new PutCommand({
        TableName: TODO_TABLE,
        Item: item,
        // Evita overwrite accidental (no debería ocurrir con UUID)
        ConditionExpression: "attribute_not_exists(id)"
      })
    );
  } catch (err: any) {
    // Si la tabla no existiera por alguna razón, este catch captura el error
    // y expone un 500 con mensaje útil para diagnóstico local.
    const message =
      err?.name === "ResourceNotFoundException"
        ? "DynamoDB table not found. Check TODO_TABLE and local Dynamo endpoint."
        : err?.message || "Unexpected error";
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: message })
    };
  }

  return {
    ...created(item),
    headers: { "content-type": "application/json" }
  };
};
