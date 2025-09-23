import {
  render,
  screen,
  waitFor,
  cleanup,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App.jsx';

jest.mock('../api.js', () => ({
  listTodos: jest.fn().mockResolvedValue([]),
  createTodo: jest.fn().mockImplementation(async (payload) => ({
    id: 'x',
    title: payload.title,
    description: payload.description,
    completed: false,
    createdAt: Date.now(),
  })),
  updateTodo: jest.fn().mockImplementation(async (_id, payload) => ({
    id: 'x',
    title: payload.title ?? 'x',
    description: payload.description,
    completed: false,
    createdAt: Date.now(),
  })),
  updateTodoStatus: jest.fn(),
  deleteTodo: jest.fn(),
}));

describe('App forms', () => {
  afterEach(() => cleanup());
  it('valida creación: requiere título', async () => {
    render(<App />);
    const user = userEvent.setup();

    const addButton = await screen.findByRole('button', { name: /añadir/i });
    await user.click(addButton);

    expect(await screen.findByText(/título es requerido/i)).toBeInTheDocument();
  });

  it('crea una tarea cuando el formulario es válido', async () => {
    render(<App />);
    const user = userEvent.setup();

    const titleInput = await screen.findByPlaceholderText(
      /qué necesitas hacer/i
    );
    await user.type(titleInput, 'Nueva tarea');

    const addButton = await screen.findByRole('button', { name: /añadir/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Nueva tarea')).toBeInTheDocument();
    });
  });

  it('no acepta título solo con espacios (trim) y muestra error', async () => {
    render(<App />);
    const user = userEvent.setup();

    const titleInput = await screen.findByPlaceholderText(
      /qué necesitas hacer/i
    );
    await user.type(titleInput, '   ');
    const addButton = await screen.findByRole('button', { name: /añadir/i });
    await user.click(addButton);

    expect(await screen.findByText(/título es requerido/i)).toBeInTheDocument();
  });

  it('valida longitud máxima del título (200) y descripción (1000)', async () => {
    render(<App />);
    const user = userEvent.setup();

    const titleLargo = 'x'.repeat(201);
    const descLarga = 'y'.repeat(1001);

    const titleInput = await screen.findByPlaceholderText(
      /qué necesitas hacer/i
    );
    await user.type(titleInput, titleLargo);

    const addButton = await screen.findByRole('button', { name: /añadir/i });
    await user.click(addButton);

    expect(
      await screen.findByText(/no puede exceder 200 caracteres/i)
    ).toBeInTheDocument();

    await user.clear(titleInput);
    await user.type(titleInput, 'ok');

    const descInput = screen.getByPlaceholderText(/descripción/i);
    fireEvent.change(descInput, { target: { value: descLarga } });
    await user.click(addButton);

    expect(
      await screen.findByText(/no puede exceder 1000 caracteres/i)
    ).toBeInTheDocument();
  });

  it('limpia el formulario tras crear exitosamente y recorta espacios', async () => {
    const api = require('../api.js');
    api.createTodo.mockClear();

    render(<App />);
    const user = userEvent.setup();

    const titleInput = await screen.findByPlaceholderText(
      /qué necesitas hacer/i
    );
    const descInput = screen.getByPlaceholderText(/descripción/i);

    await user.type(titleInput, '   Tarea trim   ');
    await user.clear(descInput);

    const addButton = await screen.findByRole('button', { name: /añadir/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Tarea trim')).toBeInTheDocument();
    });

    expect(api.createTodo).toHaveBeenCalledWith({
      title: 'Tarea trim',
      description: undefined,
    });

    expect(titleInput).toHaveValue('');
    expect(descInput).toHaveValue('');
  });

  it('muestra error de red al fallar la creación', async () => {
    const api = require('../api.js');
    api.createTodo.mockRejectedValueOnce(new Error('network'));

    render(<App />);
    const user = userEvent.setup();

    const titleInput = await screen.findByPlaceholderText(
      /qué necesitas hacer/i
    );
    await user.type(titleInput, 'Falla');

    const addButton = await screen.findByRole('button', { name: /añadir/i });
    await user.click(addButton);

    expect(
      await screen.findByText(/no se pudo crear la tarea/i)
    ).toBeInTheDocument();
  });
});
