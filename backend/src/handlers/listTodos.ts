import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TODO_TABLE, ensureTableReady } from "../lib/dynamo";

type Resp = { statusCode: number; headers?: Record<string, string>; body: string };

export const handler = async (): Promise<Resp> => {
  await ensureTableReady();

  const out = await ddb.send(new ScanCommand({ TableName: TODO_TABLE }));
  const items = (out.Items ?? []) as Array<Record<string, any>>;

  // Orden opcional por updatedAt DESC si existe
  items.sort((a, b) => {
    const A = a.updatedAt ?? "";
    const B = b.updatedAt ?? "";
    return A > B ? -1 : A < B ? 1 : 0;
  });

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(items)
  };
};
