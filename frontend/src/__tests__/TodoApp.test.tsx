import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from '../App'; // ajusta si tu entry point es otro

describe('TodoApp (API mocked)', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    // Evitamos "as any" problemático para Babel/TS usando (global as any)
    (global as any).fetch = jest.fn();
  });

  afterEach(() => {
    (global as any).fetch = originalFetch;
    jest.resetAllMocks();
  });

  test('renderiza lista vacía (GET /todos)', async () => {
    // GET inicial → []
    ((global as any).fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ([]),
    });

    render(<App />);

    // Ajusta el texto a tu UI ("No hay tareas", "Sin tareas", etc.)
    expect(await screen.findByText(/no hay tareas|sin tareas|no todos yet/i)).toBeInTheDocument();

    // Verifica que llamó a /todos
    expect((global as any).fetch).toHaveBeenCalledTimes(1);
    expect(((global as any).fetch as jest.Mock).mock.calls[0][0].toString()).toMatch(/\/todos$/);
  });

  test('crea y muestra un todo (POST /todos)', async () => {
    // 1) GET inicial vacío
    ((global as any).fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ([]),
    });
    // 2) POST creación
    ((global as any).fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1', title: 'Aprender testing', completed: false }),
    });
    // (Opcional) 3) si tu App re-fetchea tras POST, agrega otro mock GET:
    // ((global as any).fetch as jest.Mock).mockResolvedValueOnce({
    //   ok: true,
    //   json: async () => ([{ id: '1', title: 'Aprender testing', completed: false }]),
    // });

    render(<App />);

    // Ajusta placeholder y label a tu UI real
    const input = await screen.findByPlaceholderText(/agrega una tarea|add todo/i);
    const btn = screen.getByRole('button', { name: /agregar|add/i });

    await userEvent.type(input, 'Aprender testing');
    await userEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByText('Aprender testing')).toBeInTheDocument();
    });

    // Verifica que el POST lleve el body correcto
    const calls = ((global as any).fetch as jest.Mock).mock.calls;
    const postCall = calls.find((c: any[]) => c[1]?.method === 'POST');
    expect(postCall).toBeTruthy();
    const body = JSON.parse(postCall![1].body);
    expect(body.title).toBe('Aprender testing');
  });

  test('toggle de un todo (PUT /todos/:id)', async () => {
    // 1) GET con item sin completar
    ((global as any).fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ([{ id: '1', title: 'Test', completed: false }]),
    });
    // 2) PUT toggle → completed: true
    ((global as any).fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1', title: 'Test', completed: true }),
    });

    render(<App />);

    // Si usas checkbox con label accesible
    const cb = await screen.findByRole('checkbox', { name: /test/i });
    expect(cb).not.toBeChecked();

    fireEvent.click(cb);

    await waitFor(() => {
      expect(cb).toBeChecked();
    });

    // Verifica que hubo PUT a /todos/1
    const calls = ((global as any).fetch as jest.Mock).mock.calls;
    const putCall = calls.find((c: any[]) => c[1]?.method === 'PUT');
    expect(putCall?.[0].toString()).toMatch(/\/todos\/1$/);
  });

  // Opcional: manejo de error
  test('muestra error si falla GET /todos', async () => {
    ((global as any).fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Internal Error' }),
    });

    render(<App />);
    // Ajusta al mensaje de tu UI
    expect(await screen.findByText(/error|falló|algo salió mal/i)).toBeInTheDocument();
  });
});
