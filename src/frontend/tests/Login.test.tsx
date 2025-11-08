import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../src/contexts/AuthContext';
import Login from '../src/components/Login';

describe('Login', () => {
  it('renders login form', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/login']}>
          <Login />
        </MemoryRouter>
      </AuthProvider>
    );

    // Matches your actual heading and controls
    expect(screen.getByRole('heading', { name: /welcome! please login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/user type/i)).toBeInTheDocument();
    // The button is "Login" (not "Sign in")
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
});
