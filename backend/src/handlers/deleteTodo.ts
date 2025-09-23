import { success, failure } from '../lib/responses';
import { deleteById, getItemById } from '../lib/dynamo';
import type { Todo } from '../lib/types';

export const handler = async (event: any) => {
  try {
    const id = event?.pathParameters?.id as string | undefined;
    if (!id) return failure(400, 'Parámetro id es requerido');

    const existing = await getItemById<Todo>(id);
    if (!existing) return failure(404, 'Todo no encontrado');

    await deleteById(id);
    return success(204, '');
  } catch (error) {
    console.error('deleteTodo error', error);
    return failure(500, 'Failed to delete todo');
  }
};
