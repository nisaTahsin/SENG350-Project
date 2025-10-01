import React from 'react';
import GenericPage from '../GenericPage';
import AdminSystemConfigurationTable from '../AdminSystemConfigurationTable';

const AdminSystemConfig: React.FC = () => {
  return (
    <GenericPage
      title="System Configuration"
      description="Configure system-level settings and parameters"
      userType="admin"
    >
      <div style={{ marginTop: 32 }}>
        <AdminSystemConfigurationTable />
      </div>
    </GenericPage>
  );
};

export default AdminSystemConfig;
