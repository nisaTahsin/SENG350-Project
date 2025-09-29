import React from 'react';
import GenericPage from '../GenericPage';

const AdminSystemHealth: React.FC = () => {
  return (
    <GenericPage
      title="System Health"
      description="Monitor system performance and health metrics"
      userType="admin"
    />
  );
};

export default AdminSystemHealth;
