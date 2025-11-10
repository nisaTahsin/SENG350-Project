import React from 'react';
import GenericPage from '../../GenericPage';

const AdminMonitoring: React.FC = () => {
  return (
    <GenericPage
      title="System Monitoring"
      description="Monitor system activity without daily intervention"
      userType="admin"
    />
  );
};

export default AdminMonitoring;
