import { v4 } from 'uuid';
import {
  docClient,
  TABLE_NAME,
  ensureTablePromise,
  dynamoGet,
  dynamoPut,
  dynamoScan,
  dynamoUpdate,
} from '@/lib/dynamo';

import { appErrors } from '@/lib/errors';
import {
  CreateTodoArgs,
  DeleteTodoArgs,
  GetTodoArgs,
  ListTodosArgs,
  Todo,
  UpdateTodoArgs,
} from './types/todo';

export class TodosService {
  async createTodo({ body }: CreateTodoArgs) {
    await ensureTablePromise;
    const now = new Date().toISOString();

    const todo: Todo = {
      id: v4(),
      title: body.title,
      description: body.description ?? '',
      completed: body.completed ?? false,
      // attachmentKey: body.attachmentKey ?? null,
      createdAt: now,
      updatedAt: now,
    };

    const tableInput = dynamoPut({
      TableName: TABLE_NAME,
      Item: todo,
      ConditionExpression: 'attribute_not_exists(id)',
    });

    await docClient.send(tableInput);

    return { data: todo };
  }
  async listTodo({ params }: ListTodosArgs) {
    await ensureTablePromise;

    const limit = params?.limit ?? 25;
    const items: Todo[] = [];
    let exclusiveStartKey = params?.cursor;
    let nextPage: { id: string } | undefined;

    do {
      const tableInput = dynamoScan({
        TableName: TABLE_NAME,
        Limit: limit - items.length,
        ExclusiveStartKey: exclusiveStartKey,
        FilterExpression: 'attribute_not_exists(deletedAt)',
      });

      const dbRes = await docClient.send(tableInput);
      const pageItems = (dbRes.Items as Todo[]) ?? [];
      items.push(...pageItems);

      if (dbRes.LastEvaluatedKey && typeof dbRes.LastEvaluatedKey.id === 'string') {
        nextPage = { id: dbRes.LastEvaluatedKey.id };
        exclusiveStartKey = dbRes.LastEvaluatedKey as { id: string };
      } else {
        exclusiveStartKey = undefined;
        nextPage = undefined;
      }
    } while (items.length < limit && exclusiveStartKey);

    return {
      data: items.slice(0, limit),
      nextPage,
    };
  }
  async getTodo({ params }: GetTodoArgs) {
    await ensureTablePromise;

    const tableInput = dynamoGet({
      TableName: TABLE_NAME,
      Key: { id: params.id },
    });

    const dbRes = await docClient.send(tableInput);
    const item = dbRes.Item as Todo;

    if (!item) throw appErrors.notFound();

    return { data: !item?.deletedAt ? item : undefined };
  }
  async updateTodo({ params, body }: UpdateTodoArgs) {
    await ensureTablePromise;

    const now = new Date().toISOString();

    const { data } = await this.getTodo({ params });

    const tableInput = dynamoUpdate({
      TableName: TABLE_NAME,
      Key: { id: params.id },
      UpdateExpression:
        'set title = :title, #description = :description, completed = :completed, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#description': 'description',
      },
      ExpressionAttributeValues: {
        ':title': body.title ?? data?.title,
        ':description':
          body.description && body.description.length > 0 ? body.description : data?.description,
        ':completed': body.completed ?? data?.completed,
        // ':attachmentKey':
        //   body.attachmentKey && body.attachmentKey.length > 0
        //     ? body.attachmentKey
        //     : data?.attachmentKey,
        ':updatedAt': now,
      },
      ConditionExpression: 'attribute_exists(id) AND attribute_not_exists(deletedAt)',
      ReturnValues: 'ALL_NEW',
    });

    const dbRes = await docClient.send(tableInput);

    return { data: dbRes.Attributes };
  }
  async deleteTodo({ params, body }: DeleteTodoArgs) {
    await ensureTablePromise;

    const days = (n: number) => n * 24 * 60 * 60;
    const ttl = Math.floor(Date.now() / 1000) + days(body?.retainDays ?? 1);
    const now = new Date().toISOString();

    const tableInput = dynamoUpdate({
      TableName: TABLE_NAME,
      Key: { id: params.id },
      UpdateExpression: 'SET deletedAt = :now, #ttl = :ttl, updatedAt = :now',
      ExpressionAttributeNames: {
        '#ttl': 'ttl',
      },
      ExpressionAttributeValues: {
        ':now': now,
        ':ttl': ttl,
      },
      ConditionExpression: 'attribute_exists(id) AND attribute_not_exists(deletedAt)',
      ReturnValues: 'ALL_NEW',
    });

    const dbRes = await docClient.send(tableInput);

    return { data: dbRes.Attributes };
  }
}
