import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TODO_TABLE, ensureTableReady } from "../lib/dynamo";

type Resp = { statusCode: number; headers?: Record<string, string>; body: string };

export const handler = async (event: any): Promise<Resp> => {
  await ensureTableReady();

  const id = event?.pathParameters?.id as string | undefined;
  if (!id) {
    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Missing id" })
    };
  }

  let body: any = {};
  try {
    body = typeof event.body === "string" ? JSON.parse(event.body) : event.body || {};
  } catch {
    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Invalid JSON" })
    };
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
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ error: "Invalid status (allowed: pending | completed)" })
      };
    }
    names["#status"] = "status";
    values[":status"] = body.status;
    sets.push("#status = :status");
  }

  if (sets.length === 1) {
    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Nothing to update" })
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
        ReturnValues: "ALL_NEW"
      })
    );

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(out.Attributes)
    };
  } catch (err: any) {
    if (err?.name === "ConditionalCheckFailedException") {
      return {
        statusCode: 404,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ error: "Todo not found" })
      };
    }
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: err?.message || "Unexpected error" })
    };
  }
};
