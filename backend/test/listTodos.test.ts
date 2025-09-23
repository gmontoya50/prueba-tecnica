jest.mock('../src/lib/dynamo', () => ({
  scanAll: jest.fn(),
}));

import type { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

function requireHandlers() {
  const mod = require('../src/handlers/listTodos');
  return mod as typeof import('../src/handlers/listTodos');
}

describe('listTodos handler', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env.TODO_TABLE = 'Todos';
  });

  it('retorna 200 y los items ordenados por createdAt desc', async () => {
    const { scanAll } = require('../src/lib/dynamo');
    (scanAll as jest.Mock).mockResolvedValue([
      { id: '2', title: 'B', createdAt: 2, completed: false },
      { id: '1', title: 'A', createdAt: 1, completed: false },
    ]);

    const { handler } = requireHandlers();
    const res = (await handler({} as any)) as APIGatewayProxyStructuredResultV2 | string;
    expect(typeof res).not.toBe('string');
    const r = res as APIGatewayProxyStructuredResultV2;
    expect(r.statusCode).toBe(200);
    const body = JSON.parse(r.body!);
    expect(body.map((t: any) => t.id)).toEqual(['2', '1']);
  });
});
