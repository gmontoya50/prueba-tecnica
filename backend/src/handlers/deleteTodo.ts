// backend/src/handlers/deleteTodo.ts
import { badRequest, notFound, ok, serverError } from "@/lib/http";
import { ddb, TODO_TABLE, ensureTableReady } from "@/lib/dynamo";
import { GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

export const handler = async (event: any) => {
  try {
    const id = event.pathParameters?.id as string | undefined;
    if (!id) return badRequest("id is required");

    // En local asegura que la tabla exista (no hace nada en prod)
    await ensureTableReady();

    // 1) Verificar existencia
    const getRes = await ddb.send(
      new GetCommand({ TableName: TODO_TABLE, Key: { id } })
    );
    if (!getRes.Item) {
      return notFound("todo not found");
    }

    // 2) Eliminar
    await ddb.send(
      new DeleteCommand({ TableName: TODO_TABLE, Key: { id } })
    );

    // ✅ Ajuste para pasar test:
    // Responder 200 con un body { message: "Todo deleted" }
    return ok({ message: "Todo deleted" });
  } catch (e) {
    return serverError(e);
  }
};
