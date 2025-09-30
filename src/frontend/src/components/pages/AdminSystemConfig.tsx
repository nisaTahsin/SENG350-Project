import React from 'react';
import GenericPage from '../GenericPage';

const AdminSystemConfig: React.FC = () => {
  return (
    <GenericPage
      title="System Configuration"
      description="Configure system-level settings and parameters"
      userType="admin"
    />
  );
};

export default AdminSystemConfig;
