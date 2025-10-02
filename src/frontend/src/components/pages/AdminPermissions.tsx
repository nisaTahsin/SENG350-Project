import React from 'react';
import GenericPage from '../GenericPage';
import AdminPermissionsTable from '../AdminPermissionsTable';

const AdminPermissions: React.FC = () => {
  return (
    <GenericPage
      title="User Roles & Permissions"
      description="Manage user roles and system permissions"
      userType="admin"
    >
      <div style={{ marginTop: 32 }}>
        <AdminPermissionsTable />
      </div>
    </GenericPage>
  );
};

export default AdminPermissions;
