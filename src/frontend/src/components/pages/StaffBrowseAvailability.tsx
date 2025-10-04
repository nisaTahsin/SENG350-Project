
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
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');

  const { rooms, bookings } = buildingData[selectedBuilding];

  // Filter rooms by availability in the selected time slot range
  let filteredRooms = rooms;
  let filteredBookings = bookings;
  if (startTime && endTime) {
    const startIdx = times.indexOf(startTime);
    const endIdx = times.indexOf(endTime);
    if (startIdx !== -1 && endIdx !== -1 && startIdx <= endIdx) {
      filteredRooms = rooms.filter(room => {
        for (let i = startIdx; i <= endIdx; i++) {
          const t = times[i];
          const booking = bookings[room]?.[t];
          if (booking) return false;
        }
        return true;
      });
      filteredBookings = {};
      filteredRooms.forEach(room => {
        filteredBookings[room] = bookings[room] || {};
      });
    }
  } else if (startTime || endTime) {
    // If only one is selected, treat as single slot filter
    const filterSlot = startTime || endTime;
    filteredRooms = rooms.filter(room => {
      const booking = bookings[room]?.[filterSlot];
      return !booking;
    });
    filteredBookings = {};
    filteredRooms.forEach(room => {
      filteredBookings[room] = bookings[room] || {};
    });
  }

  return (
    <GenericPage
      title="Browse Availability"
      description="View available classrooms and time slots for booking"
      userType="staff"
    >
      <div style={{ marginTop: 16, marginBottom: 24, display: 'flex', gap: 24, alignItems: 'center' }}>
        <div>
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
        <div>
          <label htmlFor="start-time-filter" style={{ fontWeight: 'bold', marginRight: 8 }}>Start Time:</label>
          <select
            id="start-time-filter"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            style={{ padding: '4px 8px', fontSize: '1rem', marginRight: 8 }}
          >
            <option value="">Any</option>
            {times.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="end-time-filter" style={{ fontWeight: 'bold', marginRight: 8 }}>End Time:</label>
          <select
            id="end-time-filter"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            style={{ padding: '4px 8px', fontSize: '1rem' }}
          >
            <option value="">Any</option>
            {times.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
      <div style={{ marginTop: 8 }}>
        <TimeslotTable times={times} rooms={filteredRooms} bookings={filteredBookings} />
      </div>
    </GenericPage>
  );
};

export default StaffBrowseAvailability;
