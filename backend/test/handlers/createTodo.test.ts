import { handler } from '../../src/handlers/createTodo';

jest.mock('../../src/lib/dynamo', () => ({
  putItem: jest.fn().mockResolvedValue(undefined),
}));

describe('createTodo.handler', () => {
  it('debe responder 400 si falta body', async () => {
    const res: any = await handler({} as any);
    expect(res.statusCode).toBe(400);
  });

  it('debe crear y responder 201 con el item', async () => {
    const res: any = await handler({
      body: JSON.stringify({ title: 'Test' }),
    } as any);
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body).toHaveProperty('id');
    expect(body).toMatchObject({ title: 'Test', completed: false });
  });
});
