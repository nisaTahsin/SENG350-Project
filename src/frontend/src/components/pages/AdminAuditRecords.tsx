import React from 'react';
import GenericPage from '../GenericPage';

const AdminAuditRecords: React.FC = () => {
  return (
    <GenericPage
      title="Audit Records"
      description="View comprehensive audit trails and system records"
      userType="admin"
    />
  );
};

export default AdminAuditRecords;
