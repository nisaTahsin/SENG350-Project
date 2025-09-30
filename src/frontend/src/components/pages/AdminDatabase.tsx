import React from 'react';
import GenericPage from '../GenericPage';

const AdminDatabase: React.FC = () => {
  return (
    <GenericPage
      title="Database Management"
      description="Oversee database operations and maintenance"
      userType="admin"
    />
  );
};

export default AdminDatabase;
