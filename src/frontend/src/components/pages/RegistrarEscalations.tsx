import React from 'react';
import GenericPage from '../GenericPage';

const RegistrarEscalations: React.FC = () => {
  return (
    <GenericPage
      title="Handle Escalations"
      description="Review and resolve booking conflicts and issues"
      userType="registrar"
    />
  );
};

export default RegistrarEscalations;
