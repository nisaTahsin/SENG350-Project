import React from 'react';
import GenericPage from '../GenericPage';

const RegistrarClassroomManagement: React.FC = () => {
  return (
    <GenericPage
      title="Classroom Management"
      description="Add, edit, or remove classroom information and settings"
      userType="registrar"
    />
  );
};

export default RegistrarClassroomManagement;
