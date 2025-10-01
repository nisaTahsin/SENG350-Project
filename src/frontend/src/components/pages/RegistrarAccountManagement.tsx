
import React from 'react';
import GenericPage from '../GenericPage';
import RegistrarAccountManagementTable from '../RegistrarAccountManagementTable';


const RegistrarAccountManagement: React.FC = () => {
  return (
    <GenericPage
      title="Account Management"
      description="Block abusive accounts or manually release bookings"
      userType="registrar"
    >
      <div style={{ marginTop: 32 }}>
        <RegistrarAccountManagementTable />
      </div>
    </GenericPage>
  );
};

export default RegistrarAccountManagement;
