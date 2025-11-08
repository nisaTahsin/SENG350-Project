// tests/TimeslotTable.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import TimeslotTable from '../src/components/TimeslotTable';

test('TimeslotTable renders bookings including multi-slot rowSpan cells', () => {
  const times = ['09:00', '09:30', '10:00'];
  const rooms = ['Room A', 'Room B'];
  const bookings = {
    'Room A': {
      '09:00': { label: 'Reserved A1', span: 2 },
      '10:00': 'Reserved A3',
    },
    'Room B': {
      '09:30': 'Reserved B2',
    },
  };

  render(<TimeslotTable times={times} rooms={rooms} bookings={bookings} />);

  const multi = screen.getByText('Reserved A1');
  expect(multi).toBeInTheDocument();
  expect(multi.closest('td')).toHaveAttribute('rowspan', '2');

  expect(screen.getByText('Reserved A3')).toBeInTheDocument();
  expect(screen.getByText('Reserved B2')).toBeInTheDocument();
});
