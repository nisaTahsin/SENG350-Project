import React from 'react';
import GenericPage from '../GenericPage';

const RegistrarTimeSlotManagement: React.FC = () => {
  return (
    <GenericPage
      title="Time Slot Management"
      description="Configure available time slots and scheduling rules"
      userType="registrar"
    />
  );
};

export default RegistrarTimeSlotManagement;
