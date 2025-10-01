import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TODO_TABLE, ensureTableReady } from "../lib/dynamo";

type Resp = { statusCode: number; headers?: Record<string, string>; body: string };

// CORS para todas las respuestas
const CORS_HEADERS = {
  "content-type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
};

export const handler = async (event: any): Promise<Resp> => {
  await ensureTableReady();

  const id = event?.pathParameters?.id as string | undefined;
  if (!id) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Missing id" }),
    };
  }

  let body: any = {};
  try {
    body = typeof event.body === "string" ? JSON.parse(event.body) : event.body || {};
  } catch {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }

  // Soporte híbrido: si viene completed:boolean desde el front, mapear a status
  //   - completed: true  -> status = "completed"
  //   - completed: false -> status = "pending"
  //   Si ya viene 'status', se respeta y se valida más abajo.
  if (typeof body.completed === "boolean" && body.status == null) {
    body.status = body.completed ? "completed" : "pending";
  }

  const now = new Date().toISOString();
  const sets: string[] = ["#updatedAt = :updatedAt"];
  const names: Record<string, string> = { "#updatedAt": "updatedAt" };
  const values: Record<string, any> = { ":updatedAt": now };

  if (body.title) {
    names["#title"] = "title";
    values[":title"] = body.title;
    sets.push("#title = :title");
  }
  if (body.description) {
    names["#description"] = "description";
    values[":description"] = body.description;
    sets.push("#description = :description");
  }
  if (body.status) {
    if (body.status !== "pending" && body.status !== "completed") {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: "Invalid status (allowed: pending | completed)" }),
      };
    }
    names["#status"] = "status";
    values[":status"] = body.status;
    sets.push("#status = :status");
  }

  if (sets.length === 1) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Nothing to update" }),
    };
  }

  try {
    const out = await ddb.send(
      new UpdateCommand({
        TableName: TODO_TABLE,
        Key: { id },
        UpdateExpression: `SET ${sets.join(", ")}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ConditionExpression: "attribute_exists(id)",
        ReturnValues: "ALL_NEW",
      })
    );

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(out.Attributes),
    };
  } catch (err: any) {
    if (err?.name === "ConditionalCheckFailedException") {
      return {
        statusCode: 404,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: "Todo not found" }),
      };
    }
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: err?.message || "Unexpected error" }),
    };
  }
};
