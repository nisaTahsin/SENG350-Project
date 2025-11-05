import React from 'react';
import GenericPage from '../GenericPage';
import AdminPermissionsTable from '../AdminPermissionsTable';

const AdminPermissions: React.FC = () => {
  return (
    <GenericPage
      title="Block Users"
      description="Block users who are potentially causing harm to the system"
      userType="admin"
    >
      <div style={{ marginTop: 32 }}>
        <AdminPermissionsTable />
      </div>
    </GenericPage>
  );
};

export default AdminPermissions;
