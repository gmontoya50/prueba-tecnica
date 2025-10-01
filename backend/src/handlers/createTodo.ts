// backend/src/handlers/createTodo.ts
import { created, badRequest, serverError } from "@/lib/http";
import { ddb, TODO_TABLE, ensureTableReady } from "@/lib/dynamo";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";

type Body = {
  title?: unknown;
  status?: unknown;    // opcional: "pending" | "completed"
  completed?: unknown; // opcional: boolean (si no usas status)
};

export const handler = async (event: any) => {
  try {
    await ensureTableReady(); // no-op en prod, útil en local

    // Parseo seguro del body
    let data: Body = {};
    try {
      data = event.body ? JSON.parse(event.body) : {};
    } catch {
      return badRequest("Invalid JSON body");
    }

    // Validación de title
    if (typeof data.title !== "string" || data.title.trim().length === 0) {
      return badRequest("title is required");
    }
    const title = data.title.trim();

    // Normalización: permitir status "pending|completed" o completed:boolean
    let completed = false;
    if (typeof data.status === "string") {
      const s = data.status.toLowerCase().trim();
      if (s !== "pending" && s !== "completed") {
        return badRequest('status must be "pending" or "completed"');
      }
      completed = s === "completed";
    } else if (typeof data.completed === "boolean") {
      completed = data.completed;
    }

    // Construir item
    const now = new Date().toISOString();
    const item = {
      id: randomUUID(),
      title,
      completed,
      createdAt: now,
      updatedAt: now,
    };

    // Guardar en DynamoDB
    await ddb.send(new PutCommand({ TableName: TODO_TABLE, Item: item }));

    // 201 Created
    return created(item);
  } catch (e) {
    return serverError(e);
  }
};
