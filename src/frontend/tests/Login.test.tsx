// tests/Login.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from '../src/components/Login';
import { WithAuthAndRouter } from './test-utils';

it('renders login form', () => {
  render(
    <WithAuthAndRouter>
      <Login />
    </WithAuthAndRouter>
  );
  expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /sign in|log in/i })).toBeInTheDocument();
});
