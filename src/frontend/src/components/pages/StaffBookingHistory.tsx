import React from 'react';
import GenericPage from '../GenericPage';

const StaffBookingHistory: React.FC = () => {
  return (
    <GenericPage
      title="Booking History"
      description="View your past booking history and records"
      userType="staff"
    />
  );
};

export default StaffBookingHistory;
