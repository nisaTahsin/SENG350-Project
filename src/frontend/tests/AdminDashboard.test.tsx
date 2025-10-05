// tests/AdminDashboard.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminDashboard from '../src/components/AdminDashboard';
import { WithAuthAndRouter } from './test-utils';

it('renders admin action cards', () => {
  render(
    <WithAuthAndRouter>
      <AdminDashboard />
    </WithAuthAndRouter>
  );
  expect(screen.getByText(/manage users/i)).toBeInTheDocument();
  expect(screen.getByText(/audit logs|audit records/i)).toBeInTheDocument();
});
