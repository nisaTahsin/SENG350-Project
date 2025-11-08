import React from 'react';
import { render, screen } from '@testing-library/react';
import * as rrd from 'react-router-dom';
import App from '../src/App';

// Use MemoryRouter instead of BrowserRouter and start on /login
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof rrd>();
  return {
    ...actual,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => (
      <actual.MemoryRouter initialEntries={['/login']}>{children}</actual.MemoryRouter>
    ),
  };
});

describe('App router integration', () => {
  it('renders the login route', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /welcome! please login/i })).toBeInTheDocument();
  });
});
