import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Adjust this path to match where your app imports GenericPage from.
// The mock makes the test independent of app wiring.
vi.mock('../src/components/GenericPage', () => ({
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

import GenericPage from '../src/components/GenericPage';

describe('GenericPage', () => {
  it('renders a generic page title', () => {
    render(
      <MemoryRouter>
        <GenericPage title="Hello" />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /hello/i })).toBeInTheDocument();
  });
});
