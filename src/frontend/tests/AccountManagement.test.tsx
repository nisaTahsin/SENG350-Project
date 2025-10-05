// tests/AccountManagement.test.tsx
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import AccountManagement from '../src/components/AccountManagement';
import { WithAuthAndRouter } from './test-utils';
import userEvent from '@testing-library/user-event';

it("opens Change Permissions modal", async () => {
  render(
    <WithAuthAndRouter>
      <AccountManagement />
    </WithAuthAndRouter>
  );

  // click the row action button
  await userEvent.click(screen.getByRole('button', { name: /change permissions/i }));

  const modalHeading = await screen.findByRole('heading', { level: 3, name: /change permissions/i });
  expect(modalHeading).toBeInTheDocument();

  
  const modal = modalHeading.closest('div');
  const utils = modal ? within(modal) : screen;

  expect(utils.getByLabelText(/role/i)).toBeInTheDocument();
  expect(utils.getByRole('button', { name: /save/i })).toBeInTheDocument();
});
