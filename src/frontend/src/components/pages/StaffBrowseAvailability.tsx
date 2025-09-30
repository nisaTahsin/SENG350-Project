
import React, { useState } from 'react';
import GenericPage from '../GenericPage';
import TimeslotTable from '../TimeslotTable';


const times = [
  '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM',
  '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM',
  '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM'
];


type BookingCell = { label: string; span: number };
type BookingMap = { [room: string]: { [time: string]: string | BookingCell } };
type BuildingData = {
  [building: string]: {
    rooms: string[];
    bookings: BookingMap;
  };
};

const buildingData: BuildingData = {
  'Elliot Building': {
    rooms: ['ELL 060 – Classroom', 'ELL 162 – Classroom', 'ELL 168 – Lecture theatre', 'ELL 167 – Lecture theatre'],
    bookings: {
      'ELL 060 – Classroom': {
        '10:00 AM': { label: 'Example Booking', span: 3 },
      },
    },
  },
  'Maclaurin Building': {
    rooms: ['MAC D116 – Classroom', 'MAC D115 – Classroom'],
    bookings: {
      
    },
  },
};

const buildings = [
  'Elliot Building',
  'Maclaurin Building',
];

const StaffBrowseAvailability: React.FC = () => {
  const [selectedBuilding, setSelectedBuilding] = useState(buildings[0]);

  // In a real app, you would filter rooms/bookings by building

  const { rooms, bookings } = buildingData[selectedBuilding];

  return (
    <GenericPage
      title="Browse Availability"
      description="View available classrooms and time slots for booking"
      userType="staff"
    >
      <div style={{ marginTop: 16, marginBottom: 24 }}>
        <label htmlFor="building-select" style={{ fontWeight: 'bold', marginRight: 8 }}>Select Building:</label>
        <select
          id="building-select"
          value={selectedBuilding}
          onChange={e => setSelectedBuilding(e.target.value)}
          style={{ padding: '4px 8px', fontSize: '1rem' }}
        >
          {buildings.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>
      <div style={{ marginTop: 8 }}>
        <TimeslotTable times={times} rooms={rooms} bookings={bookings} />
      </div>
    </GenericPage>
  );
};

export default StaffBrowseAvailability;
