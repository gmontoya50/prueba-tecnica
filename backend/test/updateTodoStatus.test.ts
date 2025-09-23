jest.mock('../src/lib/dynamo', () => ({
  getItemById: jest.fn(),
  updateById: jest.fn(),
}));

import type { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

function requireHandlers() {
  const mod = require('../src/handlers/updateTodoStatus');
  return mod as typeof import('../src/handlers/updateTodoStatus');
}

function makeEvent(id?: string, body?: any) {
  return {
    pathParameters: id ? { id } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  } as any;
}

describe('updateTodoStatus handler', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env.TODO_TABLE = 'Todos';
  });

  it('valida id requerido', async () => {
    const { handler } = requireHandlers();
    const res = (await handler(makeEvent(undefined, { completed: true }))) as APIGatewayProxyStructuredResultV2 | string;
    expect(typeof res).not.toBe('string');
    expect((res as APIGatewayProxyStructuredResultV2).statusCode).toBe(400);
  });

  it('valida body requerido', async () => {
    const { handler } = requireHandlers();
    const res = (await handler(makeEvent('1'))) as APIGatewayProxyStructuredResultV2 | string;
    expect(typeof res).not.toBe('string');
    expect((res as APIGatewayProxyStructuredResultV2).statusCode).toBe(400);
  });

  it('retorna 404 si no existe', async () => {
    const { getItemById } = require('../src/lib/dynamo');
    (getItemById as jest.Mock).mockResolvedValue(null);

    const { handler } = requireHandlers();
    const res = (await handler(makeEvent('1', { completed: true }))) as APIGatewayProxyStructuredResultV2 | string;
    expect(typeof res).not.toBe('string');
    expect((res as APIGatewayProxyStructuredResultV2).statusCode).toBe(404);
  });

  it('actualiza campos permitidos y retorna 200', async () => {
    const { getItemById, updateById } = require('../src/lib/dynamo');
    (getItemById as jest.Mock).mockResolvedValue({ id: '1', title: 'T', createdAt: 1, completed: false });
    (updateById as jest.Mock).mockResolvedValue(undefined);

    const { handler } = requireHandlers();
    const res = (await handler(makeEvent('1', { completed: true, title: 'Nuevo' }))) as APIGatewayProxyStructuredResultV2 | string;
    expect(typeof res).not.toBe('string');
    const r = res as APIGatewayProxyStructuredResultV2;
    expect(r.statusCode).toBe(200);
    const body = JSON.parse(r.body!);
    expect(body).toMatchObject({ id: '1', completed: true, title: 'Nuevo' });
    expect(updateById).toHaveBeenCalled();
  });
});
