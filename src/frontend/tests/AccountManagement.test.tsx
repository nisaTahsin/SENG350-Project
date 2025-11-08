import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AccountManagement from '../src/components/AccountManagement';

describe('AccountManagement', () => {
  it('opens Change Permissions modal and shows controls', async () => {
    render(
      <MemoryRouter>
        <AccountManagement />
      </MemoryRouter>
    );

    // Open the modal (pick the first "Change Permissions" action)
    const openBtns = screen.getAllByRole('button', { name: /change permissions/i });
    await userEvent.click(openBtns[0]);

    // Scope queries to the modal contents
    const heading = await screen.findByRole('heading', { name: /change permissions/i });
    const modal = heading.closest('div') ?? document.body;
    const utils = within(modal);

    // Don’t rely on label association; assert by roles present in your DOM
    expect(utils.getByRole('combobox')).toBeInTheDocument(); // the <select>
    expect(utils.getByRole('checkbox')).toBeInTheDocument(); // the "Disabled" toggle
    expect(utils.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });
});
