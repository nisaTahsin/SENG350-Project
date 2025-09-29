import React from 'react';
import GenericPage from '../GenericPage';

const AdminPermissions: React.FC = () => {
  return (
    <GenericPage
      title="User Roles & Permissions"
      description="Manage user roles and system permissions"
      userType="admin"
    />
  );
};

export default AdminPermissions;
