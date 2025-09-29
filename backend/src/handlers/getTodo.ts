import { GetCommand } from "@aws-sdk/lib-dynamodb";
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

  const out = await ddb.send(
    new GetCommand({ TableName: TODO_TABLE, Key: { id } })
  );

  if (!out.Item) {
    return {
      statusCode: 404,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Todo not found" })
    };
  }

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(out.Item)
  };
};
