import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';

function Probe() {
  const { isAuthenticated, user, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="auth">{String(isAuthenticated)}</div>
      <div data-testid="user">{user ? `${user.username}:${user.userType}` : 'none'}</div>
      <button onClick={() => login('bob', 'registrar')}>login</button>
      <button onClick={() => logout()}>logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  it('logs in and out correctly', async () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth')).toHaveTextContent('false');
    screen.getByText('login').click();

    await waitFor(() => expect(screen.getByTestId('auth')).toHaveTextContent('true'));
    expect(screen.getByTestId('user')).toHaveTextContent('bob:registrar');

    screen.getByText('logout').click();
    await waitFor(() => expect(screen.getByTestId('auth')).toHaveTextContent('false'));
  });
});
