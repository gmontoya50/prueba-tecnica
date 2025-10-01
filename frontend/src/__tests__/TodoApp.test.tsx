// src/__tests__/TodoApp.test.tsx
import React from 'react';
import userEvent from '@testing-library/user-event';
import {
  render as rtlRender,
  screen,
  waitFor,
  RenderOptions,
  within,
} from '@testing-library/react';

import App from '../App';
import { NotificationsProvider } from '@/notifications/NotificationsProvider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// ---------- Render helper con Providers ----------
// Desactivamos ripple en test para reducir warnings de TransitionGroup/TouchRipple
const theme = createTheme({
  components: {
    MuiButtonBase: { defaultProps: { disableRipple: true } },
  },
});

function render(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const Wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationsProvider>{children}</NotificationsProvider>
    </ThemeProvider>
  );
  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

// ---------- Helper fetch mock ----------
const res = (data: any, ok = true, status = 200) =>
  ({ ok, status, json: async () => data } as any);

describe('TodoApp (API mocked)', () => {
  const originalFetch = globalThis.fetch;

  // ---------- Silenciar warnings ruidosos SOLO en esta suite ----------
  const origError = console.error;
  const origWarn = console.warn;

  const SILENCE_PATTERNS = [
    'Warning: An update to',        // "An update to X was not wrapped in act(...)"
    'not wrapped in act(...',       // variante
    'Warning: act(...',             // variante
    'TransitionGroup',              // react-transition-group al montar
    'TouchRipple',                  // ripple de MUI
    'React does not recognize the', // props internos de MUI en DOM
  ];

  const shouldSilence = (args: unknown[]) => {
    const first = args[0];
    if (typeof first !== 'string') return false;
    return SILENCE_PATTERNS.some((p) => first.includes(p));
  };

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation((...args: any[]) => {
      if (shouldSilence(args)) return;
      origError(...args);
    });
    jest.spyOn(console, 'warn').mockImplementation((...args: any[]) => {
      if (shouldSilence(args)) return;
      origWarn(...args);
    });
  });

  afterAll(() => {
    (console.error as unknown as jest.Mock).mockRestore?.();
    (console.warn as unknown as jest.Mock).mockRestore?.();
  });
  // -------------------------------------------------------------------

  beforeEach(() => {
    // ts-expect-error: forzamos mock en entorno de test
    globalThis.fetch = jest.fn();
    jest.clearAllMocks();
  });

  afterEach(() => {
    // restaurar fetch original por si otras suites dependen de él
    // ts-expect-error: revertimos asignación
    globalThis.fetch = originalFetch;
  });

  it('renderiza lista vacía (GET /todos)', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce(res([]));

    render(<App />);

    expect(await screen.findByText(/no hay tareas/i)).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('crea y muestra un todo (POST /todos)', async () => {
    const user = userEvent.setup();

    // 1) GET inicial vacío
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce(res([]));
    // 2) POST crea
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce(
      res({ id: '1', title: 'Comprar pan', completed: false }, true, 201)
    );

    render(<App />);

    // Abrir el diálogo de "Agregar"
    const fab = await screen.findByRole('button', { name: /agregar/i });
    await user.click(fab);

    // En el diálogo puede no haber placeholder fijo; toma el primer textbox
    const input = await screen.findByRole('textbox');

    // Botón "Agregar" dentro del diálogo (si tu diálogo usa otro nombre, ajusta aquí)
    const addBtn = screen.getByRole('button', { name: /agregar/i });

    await user.type(input, 'Comprar pan');
    await user.click(addBtn);

    expect(await screen.findByText(/comprar pan/i)).toBeInTheDocument();
    expect((globalThis.fetch as jest.Mock)).toHaveBeenCalledTimes(2);
  });

  it('toggle de un todo (PUT /todos/:id)', async () => {
    const user = userEvent.setup();

    // 1) GET con 1 item
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce(
      res([{ id: '1', title: 'Tarea', completed: false }])
    );
    // 2) PUT devuelve actualizado
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce(
      res({ id: '1', title: 'Tarea', completed: true })
    );

    render(<App />);

    // Obtén el <li> que contiene "Tarea"
    const item = await screen.findByText('Tarea');
    // Sube al contenedor de la fila (li)
    const row = item.closest('li') ?? item.parentElement!;
    const utils = within(row);

    // Busca el checkbox dentro de esa fila
    const chk = utils.getByRole('checkbox');
    expect(chk).not.toBeChecked();

    await user.click(chk);

    await waitFor(() => expect(chk).toBeChecked());
    expect((globalThis.fetch as jest.Mock)).toHaveBeenCalledTimes(2);
  });

  it('muestra error si falla GET /todos', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce(
      res({ error: 'boom' }, false, 500)
    );

    render(<App />);

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });
});
