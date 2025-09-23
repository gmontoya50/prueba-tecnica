import { success, failure } from '../lib/responses';
import { scanAll } from '../lib/dynamo';
import type { Todo } from '../lib/types';


export const handler = async (_event: any) => {
  try {
    const items = await scanAll<Todo>();
    items.sort((a, b) => b.createdAt - a.createdAt);
    return success(200, items);
  } catch (error) {
    console.error('listTodos error', error);
    return failure(500, 'Failed to list todos');
  }
};
