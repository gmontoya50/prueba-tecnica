import supertest from 'supertest';

const API_URL = process.env.API_URL || 'http://localhost:4000';
const request = supertest(API_URL);

describe('Todos API (E2E)', () => {
  let createdId = '';

  it('GET /todos → 200 (lista)', async () => {
    const res = await request.get('/todos');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /todos → 201 (crea)', async () => {
    const payload = {
      title: 'Test Todo',
      description: 'Creado desde Jest',
      status: 'pending'
    };

    const res = await request.post('/todos').send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe(payload.title);
    createdId = res.body.id;
  });

  it('GET /todos/:id → 200 (obtiene creado)', async () => {
    const res = await request.get(`/todos/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', createdId);
    expect(res.body).toHaveProperty('title', 'Test Todo');
  });

  it('PUT /todos/:id → 200 (actualiza)', async () => {
    const res = await request
      .put(`/todos/${createdId}`)
      .send({ status: 'completed', title: 'Test Todo (edit)' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'completed');
    expect(res.body).toHaveProperty('title', 'Test Todo (edit)');
  });

  it('DELETE /todos/:id → 200 (elimina)', async () => {
    const res = await request.delete(`/todos/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Todo deleted');
  });

  it('GET /todos/:id → 404 (ya no existe)', async () => {
    const res = await request.get(`/todos/${createdId}`);
    expect(res.status).toBe(404);
  });

  // Casos de validación / error
  it('POST /todos → 400 si falta title', async () => {
    const res = await request.post('/todos').send({ description: 'sin título' });
    expect([400, 422]).toContain(res.status);
  });

  it('PUT /todos/:id → 404 si no existe', async () => {
    const res = await request.put(`/todos/NO-EXISTE`).send({ status: 'completed' });
    expect(res.status).toBe(404);
  });

  it('DELETE /todos/:id → 404 si no existe', async () => {
    const res = await request.delete(`/todos/NO-EXISTE`);
    expect(res.status).toBe(404);
  });
});
