jest.mock('../src/lib/dynamo', () => ({
  getItemById: jest.fn(),
  deleteById: jest.fn(),
}));

import type { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

function requireHandlers() {
  const mod = require('../src/handlers/deleteTodo');
  return mod as typeof import('../src/handlers/deleteTodo');
}

function makeEvent(id?: string) {
  return {
    pathParameters: id ? { id } : undefined,
  } as any;
}

describe('deleteTodo handler', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env.TODO_TABLE = 'Todos';
  });

  it('valida id requerido', async () => {
    const { handler } = requireHandlers();
    const res = (await handler(makeEvent())) as APIGatewayProxyStructuredResultV2 | string;
    expect(typeof res).not.toBe('string');
    expect((res as APIGatewayProxyStructuredResultV2).statusCode).toBe(400);
  });

  it('retorna 404 si no existe', async () => {
    const { getItemById } = require('../src/lib/dynamo');
    (getItemById as jest.Mock).mockResolvedValue(null);

    const { handler } = requireHandlers();
    const res = (await handler(makeEvent('1'))) as APIGatewayProxyStructuredResultV2 | string;
    expect(typeof res).not.toBe('string');
    expect((res as APIGatewayProxyStructuredResultV2).statusCode).toBe(404);
  });

  it('elimina y retorna 204', async () => {
    const { getItemById, deleteById } = require('../src/lib/dynamo');
    (getItemById as jest.Mock).mockResolvedValue({ id: '1', title: 'T', createdAt: 1, completed: false });
    (deleteById as jest.Mock).mockResolvedValue(undefined);

    const { handler } = requireHandlers();
    const res = (await handler(makeEvent('1'))) as APIGatewayProxyStructuredResultV2 | string;
    expect(typeof res).not.toBe('string');
    const r = res as APIGatewayProxyStructuredResultV2;
    expect(r.statusCode).toBe(204);
    expect(deleteById).toHaveBeenCalled();
  });
});
