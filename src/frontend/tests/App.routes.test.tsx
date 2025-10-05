// tests/App.routes.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../src/App';
import { WithAuthOnly } from './test-utils';
import Routes from '../src/AppRoutes';
renderWithProviders(<Routes />, { initialEntries: ['/'] });


describe('App router integration', () => {
  test('renders landing route by default', () => {
    // simulate landing path
    window.history.pushState({}, '', '/');
    render(
      <WithAuthOnly>
        <App />
      </WithAuthOnly>
    );
    expect(screen.getByText(/welcome|landing|home/i)).toBeInTheDocument();
  });

  test('navigates to login route', () => {
    window.history.pushState({}, '', '/login');
    render(
      <WithAuthOnly>
        <App />
      </WithAuthOnly>
    );
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });
});
