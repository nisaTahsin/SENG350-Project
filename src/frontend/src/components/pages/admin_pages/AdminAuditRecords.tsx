import React from 'react';
import GenericPage from '../../GenericPage';
import AdminAuditRecordsTable from './admin_components/AdminAuditRecordsTable';

const AdminAuditRecords: React.FC = () => {
  return (
    <GenericPage
      title="Audit Records"
      description="View comprehensive audit trails and system records"
      userType="admin"
    >
      <div style={{ marginTop: 32 }}>
        <AdminAuditRecordsTable />
      </div>
    </GenericPage>
  );
};

export default AdminAuditRecords;
