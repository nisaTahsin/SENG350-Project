import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from '../src/components/AdminDashboard';

// Minimal auth stub so component can show greeting/logout without full app wiring
vi.mock('../src/contexts/AuthContext', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    useAuth: () => ({ user: { username: 'Admin' }, logout: vi.fn() }),
    AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

describe('AdminDashboard', () => {
  it('renders the visible cards and their buttons', () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    // Headings visible in your DOM
    expect(screen.getByText(/system configuration/i)).toBeInTheDocument();
    expect(screen.getByText(/audit records/i)).toBeInTheDocument();
    expect(screen.getByText(/system health/i)).toBeInTheDocument();
    expect(screen.getByText(/user roles & permissions/i)).toBeInTheDocument();

    // Actual button labels in your DOM
    expect(screen.getByRole('button', { name: /system config/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view audit records/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /system health/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /manage permissions/i })).toBeInTheDocument();
  });
});
