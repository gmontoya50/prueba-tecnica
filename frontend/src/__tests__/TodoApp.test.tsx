import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { act } from 'react-dom/test-utils';
import App from '../App';

// Helper para mockear fetch de forma compacta
const res = (data: any, ok = true, status = 200) =>
  ({ ok, status, json: async () => data } as any);

describe('TodoApp (API mocked)', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn() as any;
    jest.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch as any;
  });

  it('renderiza lista vacía (GET /todos)', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(res([]));

    render(<App />);

    // Espera a que cargue y muestre el estado vacío
    expect(await screen.findByText(/no hay tareas/i)).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('crea y muestra un todo (POST /todos)', async () => {
    const user = userEvent.setup();

    // 1) GET inicial vacío
    (global.fetch as jest.Mock).mockResolvedValueOnce(res([]));
    // 2) POST crea
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      res({ id: '1', title: 'Comprar pan', completed: false }, true, 201)
    );

    render(<App />);

    const input = await screen.findByPlaceholderText(/agrega una tarea/i);
    const addBtn = screen.getByRole('button', { name: /agregar/i });

    await act(async () => {
      await user.type(input, 'Comprar pan');
      await user.click(addBtn);
    });

    expect(await screen.findByText(/comprar pan/i)).toBeInTheDocument();
    expect((global.fetch as jest.Mock)).toHaveBeenCalledTimes(2);
  });

  it('toggle de un todo (PUT /todos/:id)', async () => {
    const user = userEvent.setup();

    // 1) GET con 1 item
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      res([{ id: '1', title: 'Tarea', completed: false }])
    );
    // 2) PUT devuelve actualizado
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      res({ id: '1', title: 'Tarea', completed: true })
    );

    render(<App />);

    const chk = await screen.findByLabelText('Tarea');
    expect(chk).not.toBeChecked();

    await act(async () => {
      await user.click(chk);
    });

    await waitFor(() => expect(chk).toBeChecked());
    expect((global.fetch as jest.Mock)).toHaveBeenCalledTimes(2);
  });

  it('muestra error si falla GET /todos', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      res({ error: 'boom' }, false, 500)
    );

    render(<App />);

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
