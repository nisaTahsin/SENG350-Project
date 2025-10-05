// src/__tests__/AdminAuditRecordsTable.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminAuditRecordsTable from '../src/components/AdminAuditRecordsTable';

it('filters rows by search text', async () => {
  render(<AdminAuditRecordsTable />);
  const before = screen.getAllByRole('row').length;
  await userEvent.type(screen.getByPlaceholderText(/search/i), 'delete');
  const after = screen.getAllByRole('row').length;
  expect(after).toBeLessThan(before);
});
