import React from 'react';
import GenericPage from '../GenericPage';

const RegistrarStatisticsLogs: React.FC = () => {
  return (
    <GenericPage
      title="Statistics & System Logs"
      description="View booking statistics, generate reports, and monitor system activity"
      userType="registrar"
    />
  );
};

export default RegistrarStatisticsLogs;
