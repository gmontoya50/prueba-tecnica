import { render, screen, waitFor } from '@testing-library/react';
import App from '../App.jsx';

jest.mock('../api.js', () => ({
  listTodos: jest.fn().mockResolvedValue([]),
  createTodo: jest.fn(),
  updateTodo: jest.fn(),
  deleteTodo: jest.fn(),
  requestAttachmentUrl: jest.fn()
}));

describe('App', () => {
  it('renders the header after loading', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /todo list serverless/i })).toBeInTheDocument();
    });
  });
});
