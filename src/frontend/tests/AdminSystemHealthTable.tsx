
import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminSystemHealthTable from '../components/AdminSystemHealthTable';
it('shows health status and metrics', () => {
  render(<AdminSystemHealthTable />);
  expect(screen.getByText(/last updated/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /service uptime/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /performance metrics/i })).toBeInTheDocument();
});