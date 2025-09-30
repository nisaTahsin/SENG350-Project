import React from 'react';
import GenericPage from '../GenericPage';

const RegistrarAccountManagement: React.FC = () => {
  return (
    <GenericPage
      title="Account Management"
      description="Block abusive accounts or manually release bookings"
      userType="registrar"
    />
  );
};

export default RegistrarAccountManagement;
