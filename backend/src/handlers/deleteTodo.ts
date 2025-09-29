import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
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

  try {
    const out = await ddb.send(
      new DeleteCommand({
        TableName: TODO_TABLE,
        Key: { id },
        ConditionExpression: "attribute_exists(id)",
        ReturnValues: "ALL_OLD"
      })
    );

    if (!out.Attributes) {
      return {
        statusCode: 404,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ error: "Todo not found" })
      };
    }

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "Todo deleted", id })
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
