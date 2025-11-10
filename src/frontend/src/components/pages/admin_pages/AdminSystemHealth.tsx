import React from 'react';
import GenericPage from '../../GenericPage';
import AdminSystemHealthTable from './admin_components/AdminSystemHealthTable';

const AdminSystemHealth: React.FC = () => {
  return (
    <GenericPage
      title="System Health"
      description="Monitor system performance and health metrics"
      userType="admin"
    >
      <div style={{ marginTop: 32 }}>
        <AdminSystemHealthTable />
      </div>
    </GenericPage>
  );
};

export default AdminSystemHealth;
