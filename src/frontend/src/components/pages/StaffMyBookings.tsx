import React from 'react';
import GenericPage from '../GenericPage';

const StaffMyBookings: React.FC = () => {
  return (
    <GenericPage
      title="My Bookings"
      description="View and manage your current bookings"
      userType="staff"
    />
  );
};

export default StaffMyBookings;
