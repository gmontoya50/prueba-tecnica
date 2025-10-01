// backend/src/handlers/updateTodo.ts
import { ok, badRequest, notFound, serverError } from "@/lib/http";
import { ddb, TODO_TABLE, ensureTableReady } from "@/lib/dynamo";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

type Patch = {
  title?: unknown;
  completed?: unknown;
  status?: unknown; // opcional: "pending" | "completed" → mapeado a completed:boolean
};

export const handler = async (event: any) => {
  try {
    const id = event.pathParameters?.id as string | undefined;
    if (!id) return badRequest("id is required");

    await ensureTableReady(); // no-op en prod, útil en local

    // Parseo seguro del body
    let data: Patch = {};
    try {
      data = event.body ? JSON.parse(event.body) : {};
    } catch {
      return badRequest("Invalid JSON body");
    }

    // Normalización: permitir `status` → `completed`
    if (typeof data.status === "string") {
      const s = data.status.toLowerCase().trim();
      if (s !== "pending" && s !== "completed") {
        return badRequest('status must be "pending" or "completed"');
      }
      data.completed = s === "completed";
    }

    // Validaciones de campos
    const hasTitle = Object.prototype.hasOwnProperty.call(data, "title");
    const hasCompleted = Object.prototype.hasOwnProperty.call(data, "completed");

    if (!hasTitle && !hasCompleted) {
      return badRequest("Nothing to update. Provide title and/or completed");
    }
    if (hasTitle) {
      if (typeof data.title !== "string" || data.title.trim().length === 0) {
        return badRequest("title must be a non-empty string");
      }
    }
    if (hasCompleted) {
      if (typeof data.completed !== "boolean") {
        return badRequest("completed must be a boolean");
      }
    }

    // Verificar existencia (para responder 404)
    const existing = await ddb.send(
      new GetCommand({ TableName: TODO_TABLE, Key: { id } })
    );
    if (!existing.Item) {
      return notFound("todo not found");
    }

    // Construir UpdateExpression dinámico
    const expr: string[] = [];
    const names: Record<string, string> = {};
    const values: Record<string, any> = {};

    if (hasTitle) {
      expr.push("#t = :t");
      names["#t"] = "title";
      values[":t"] = (data.title as string).trim();
    }
    if (hasCompleted) {
      expr.push("#c = :c");
      names["#c"] = "completed";
      values[":c"] = data.completed;
    }
    expr.push("#u = :u"); // updatedAt siempre
    names["#u"] = "updatedAt";
    values[":u"] = new Date().toISOString();

    const res = await ddb.send(
      new UpdateCommand({
        TableName: TODO_TABLE,
        Key: { id },
        UpdateExpression: "SET " + expr.join(", "),
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ReturnValues: "ALL_NEW",
      })
    );

    return ok(res.Attributes);
  } catch (e) {
    return serverError(e);
  }
};
