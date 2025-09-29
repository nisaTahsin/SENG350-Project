import React from 'react';
import GenericPage from '../GenericPage';

const StaffBrowseAvailability: React.FC = () => {
  return (
    <GenericPage
      title="Browse Availability"
      description="View available classrooms and time slots for booking"
      userType="staff"
    />
  );
};

export default StaffBrowseAvailability;
