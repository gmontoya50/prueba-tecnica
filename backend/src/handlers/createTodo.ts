import { success, failure } from '../lib/responses';
import { putItem } from '../lib/dynamo';
import type { Todo } from '../lib/types';
import { CreateTodoSchema } from '../lib/schemas';

function generateId(): string {
  return `todo_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export const handler = async (event: any) => {
  try {
    if (!event.body) {
      return failure(400, 'Body requerido');
    }

    let parsed;
    try {
      parsed = CreateTodoSchema.parse(JSON.parse(event.body));
    } catch (e: any) {
      const message = e?.errors?.[0]?.message ?? 'Payload inválido';
      return failure(400, message);
    }

    const now = Date.now();
    const item: Todo = {
      id: generateId(),
      title: parsed.title,
      description: parsed.description || undefined,
      completed: Boolean(parsed.completed ?? false),
      attachmentKey: parsed.attachmentKey ?? null,
      createdAt: now,
      updatedAt: now,
    };

    await putItem(item);

    return success(201, item);
  } catch (error) {
    console.error('createTodo error', error);
    return failure(500, 'Failed to create todo');
  }
};
