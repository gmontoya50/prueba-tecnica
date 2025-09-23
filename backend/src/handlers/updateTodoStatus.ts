import { success, failure } from '../lib/responses';
import { updateById, getItemById } from '../lib/dynamo';
import type { Todo } from '../lib/types';
import { UpdateTodoSchema } from '../lib/schemas';

export const handler = async (event: any) => {
  try {
    const id = event?.pathParameters?.id as string | undefined;
    if (!id) return failure(400, 'Parámetro id es requerido');
    if (!event.body) return failure(400, 'Body requerido');
    let parsed: Partial<Pick<Todo, 'title' | 'description' | 'completed'>>;
    try {
      parsed = UpdateTodoSchema.parse(JSON.parse(event.body));
    } catch (e: any) {
      const message = e?.errors?.[0]?.message ?? 'Payload inválido';
      return failure(400, message);
    }

    const existing = await getItemById<Todo>(id);
    if (!existing) return failure(404, 'Todo no encontrado');

    const now = Date.now();
    const updates: string[] = ['#updatedAt = :updatedAt'];
    const values: Record<string, any> = { ':updatedAt': now };
    const names: Record<string, string> = { '#updatedAt': 'updatedAt' };

    if (parsed.title !== undefined) {
      updates.unshift('#title = :title');
      values[':title'] = parsed.title;
      names['#title'] = 'title';
    }
    if (parsed.description !== undefined) {
      updates.unshift('#description = :description');
      values[':description'] = parsed.description;
      names['#description'] = 'description';
    }
    if (parsed.completed !== undefined) {
      updates.unshift('#completed = :completed');
      values[':completed'] = parsed.completed;
      names['#completed'] = 'completed';
    }

    await updateById(id, `SET ${updates.join(', ')}`, values, names);

    return success(200, { ...existing, ...parsed, updatedAt: now });
  } catch (error) {
    console.error('updateTodoStatus error', error);
    return failure(500, 'Failed to update todo');
  }
};
