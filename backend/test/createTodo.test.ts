import type { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

jest.mock('../src/lib/dynamo', () => ({
  putItem: jest.fn(),
}));

function requireHandlers() {
  const mod = require('../src/handlers/createTodo');
  return mod as typeof import('../src/handlers/createTodo');
}

// Utilidad para crear un evento API Gateway simulado
function makeEvent(body?: any) {
  return {
    body: body ? JSON.stringify(body) : undefined,
  } as any;
}

describe('createTodo handler', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env.TODO_TABLE = 'Todos';
  });

  it('crea una tarea válida y retorna 201', async () => {
    const { putItem } = require('../src/lib/dynamo');
    (putItem as jest.Mock).mockResolvedValue(undefined);

    const { handler: createHandler } = requireHandlers();
    const res = (await createHandler(
      makeEvent({ title: 'Test', description: 'Desc' })
    )) as APIGatewayProxyStructuredResultV2 | string;

    expect(typeof res).not.toBe('string');
  const r = res as APIGatewayProxyStructuredResultV2;
    expect(r.statusCode).toBe(201);
    const body = JSON.parse(r.body!);
    expect(body).toMatchObject({
      title: 'Test',
      description: 'Desc',
      completed: false,
    });
    expect(putItem).toHaveBeenCalledTimes(1);
  });

  it('valida body requerido', async () => {
    const { handler: createHandler } = requireHandlers();
  const res = (await createHandler(makeEvent())) as APIGatewayProxyStructuredResultV2 | string;
    expect(typeof res).not.toBe('string');
  expect((res as APIGatewayProxyStructuredResultV2).statusCode).toBe(400);
  });

  it('retorna 400 si la validación Zod falla', async () => {
    const { handler: createHandler } = requireHandlers();
  const res = (await createHandler(makeEvent({ title: '' }))) as APIGatewayProxyStructuredResultV2 | string;
    expect(typeof res).not.toBe('string');
  expect((res as APIGatewayProxyStructuredResultV2).statusCode).toBe(400);
  });
});
