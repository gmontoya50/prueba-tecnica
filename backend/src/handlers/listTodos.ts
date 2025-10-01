// backend/src/handlers/listTodos.ts
import { ok, serverError } from "@/lib/http";
import { ddb, TODO_TABLE, ensureTableReady } from "@/lib/dynamo";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

export const handler = async () => {
  try {
    await ensureTableReady(); // no-op en prod, útil en local

    const res = await ddb.send(
      new ScanCommand({ TableName: TODO_TABLE })
    );

    // Garantiza siempre un array
    const items = (res.Items as any[]) ?? [];
    return ok(items);
  } catch (e) {
    return serverError(e);
  }
};
