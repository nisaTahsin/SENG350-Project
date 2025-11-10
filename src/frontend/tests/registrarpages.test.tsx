import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegistrarClassroomManagement from '../src/components/pages/registrar_pages/RegistrarClassroomManagement';
import RegistrarEscalations from '../src/components/pages/registrar_pages/RegistrarEscalations';
import RegistrarStatisticsLogs from '../src/components/pages/registrar_pages/RegistrarStatisticsLogs';
import RegistrarTimeSlotManagement from '../src/components/pages/registrar_pages/RegistrarTimeSlotManagement';

describe('Registrar pages render correctly', () => {
  it('renders Classroom Management page', () => {
    render(
      <MemoryRouter>
        <RegistrarClassroomManagement />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading')).toHaveTextContent(/classroom/i);
  });

  it('renders Escalations page', () => {
    render(
      <MemoryRouter>
        <RegistrarEscalations />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading')).toHaveTextContent(/escalations/i);
  });

  it('renders Statistics & Logs page', () => {
    render(
      <MemoryRouter>
        <RegistrarStatisticsLogs />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading')).toHaveTextContent(/statistics|logs/i);
  });

  it('renders Time Slot Management page', () => {
    render(
      <MemoryRouter>
        <RegistrarTimeSlotManagement />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading')).toHaveTextContent(/time slot/i);
  });
});
