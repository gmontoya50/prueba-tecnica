// backend/src/handlers/getTodo.ts
import { ok, badRequest, notFound, serverError } from "@/lib/http";
import { ddb, TODO_TABLE, ensureTableReady } from "@/lib/dynamo";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

export const handler = async (event: any) => {
  try {
    const id = event.pathParameters?.id as string | undefined;
    if (!id) return badRequest("id is required");

    await ensureTableReady(); // no-op en prod, útil en local

    const res = await ddb.send(
      new GetCommand({ TableName: TODO_TABLE, Key: { id } })
    );

    if (!res.Item) {
      return notFound("todo not found");
    }

    return ok(res.Item);
  } catch (e) {
    return serverError(e);
  }
};
