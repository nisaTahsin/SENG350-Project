
import React, { useState, useEffect } from 'react';
import GenericPage from '../GenericPage';
import TimeslotTable from '../TimeslotTable';
import BookingForm from '../BookingForm';


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

type Room = {
  id: number;
  name: string;
  building: string;
  capacity: number;
  location?: string;
  url?: string;
  avEquipment?: string[];
  isActive: boolean;
};

const StaffBrowseAvailability: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]); // Used for API data
  const [buildings, setBuildings] = useState<string[]>([]);
  const [buildingData, setBuildingData] = useState<BuildingData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<{ id: number; name: string; time: string } | null>(null);
  const [bookingState, setBookingState] = useState<{[key: string]: boolean}>({});

  // Fetch rooms from API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/rooms?' + new Date().getTime());
        if (!response.ok) {
          throw new Error('Failed to fetch rooms');
        }
        const roomsData: Room[] = await response.json();
        console.log('Fetched rooms:', roomsData.length, 'rooms');
        setRooms(roomsData);
        
        // Group rooms by building
        const buildingsSet = new Set<string>();
        const buildingDataMap: BuildingData = {};
        
        roomsData.forEach(room => {
          if (room.isActive) {
            buildingsSet.add(room.building);
            if (!buildingDataMap[room.building]) {
              buildingDataMap[room.building] = {
                rooms: [],
                bookings: {}
              };
            }
            buildingDataMap[room.building].rooms.push(room.name);
          }
        });
        
        setBuildings(Array.from(buildingsSet));
        setBuildingData(buildingDataMap);
        console.log('Buildings:', Array.from(buildingsSet));
        console.log('Building data:', buildingDataMap);
        
        // Set default selected building
        if (buildingsSet.size > 0) {
          setSelectedBuilding(Array.from(buildingsSet)[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Get rooms and bookings for selected building
  const currentBuildingData = buildingData[selectedBuilding] || { rooms: [], bookings: {} };
  const { rooms: buildingRooms, bookings } = currentBuildingData;

  // Filter rooms by availability in the selected time slot range
  let filteredRooms = buildingRooms;
  let filteredBookings = bookings;
  if (startTime && endTime) {
    const startIdx = times.indexOf(startTime);
    const endIdx = times.indexOf(endTime);
    if (startIdx !== -1 && endIdx !== -1 && startIdx <= endIdx) {
      filteredRooms = buildingRooms.filter(room => {
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
    filteredRooms = buildingRooms.filter(room => {
      const booking = bookings[room]?.[filterSlot];
      return !booking;
    });
    filteredBookings = {};
    filteredRooms.forEach(room => {
      filteredBookings[room] = bookings[room] || {};
    });
  }

  if (loading) {
    return (
      <GenericPage
        title="Browse Availability"
        description="View available classrooms and time slots for booking"
        userType="staff"
      >
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading rooms...</p>
        </div>
      </GenericPage>
    );
  }

         if (error) {
           return (
             <GenericPage
               title="Browse Availability"
               description="View available classrooms and time slots for booking"
               userType="staff"
             >
               <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
                 <p>Error: {error}</p>
               </div>
             </GenericPage>
           );
         }

         const handleBookRoom = (roomId: number, roomName: string, time: string) => {
           setSelectedRoom({ id: roomId, name: roomName, time });
           setShowBookingForm(true);
         };

         const handleBookingSuccess = () => {
           // Mark the room-time slot as booked
           if (selectedRoom) {
             const bookingKey = `${selectedRoom.id}-${selectedRoom.time}`;
             setBookingState(prev => ({
               ...prev,
               [bookingKey]: true
             }));
           }
           console.log('Booking created successfully!');
         };

  return (
    <GenericPage
      title="Browse Availability"
      description="View available classrooms and time slots for booking"
      userType="staff"
    >
      <div style={{ marginTop: 16, marginBottom: 24, display: 'flex', gap: 24, alignItems: 'center' }}>
        <div>
          <label htmlFor="date-filter" style={{ fontWeight: 'bold', marginRight: 8 }}>Date:</label>
          <input
            id="date-filter"
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            style={{ padding: '4px 8px', fontSize: '1rem', marginRight: 8 }}
          />
        </div>
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
               <TimeslotTable 
                 times={times} 
                 rooms={filteredRooms} 
                 bookings={filteredBookings}
                 onBookRoom={handleBookRoom}
                 bookingState={bookingState}
               />
             </div>
             
             {showBookingForm && selectedRoom && (
               <BookingForm
                 roomId={selectedRoom.id}
                 roomName={selectedRoom.name}
                 selectedTime={selectedRoom.time}
                 onClose={() => {
                   setShowBookingForm(false);
                   setSelectedRoom(null);
                 }}
                 onSuccess={handleBookingSuccess}
               />
             )}
           </GenericPage>
         );
       };

export default StaffBrowseAvailability;
