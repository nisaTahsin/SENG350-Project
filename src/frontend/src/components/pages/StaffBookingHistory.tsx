import React, { useMemo, useState } from 'react';
import GenericPage from '../GenericPage';

type PastBooking = {
  id: string;
  title: string;
  building: string;
  room: string;
  date: string; // past date
  startTime: string;
  endTime: string;
};

const pastBookings: PastBooking[] = [
  {
    id: 'h1',
    title: 'Guest Lecture',
    building: 'Elliot Building',
    room: 'ELL 060 – Classroom',
    date: '2025-09-12',
    startTime: '9:00 AM',
    endTime: '10:30 AM',
  },
  {
    id: 'h2',
    title: 'TA Meeting',
    building: 'Elliot Building',
    room: 'ELL 162 – Classroom',
    date: '2025-09-18',
    startTime: '2:00 PM',
    endTime: '3:00 PM',
  },
  {
    id: 'h3',
    title: 'Practice Session',
    building: 'Maclaurin Building',
    room: 'MAC D116 – Classroom',
    date: '2025-08-29',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
  },
];

// Minimal room details derived from backend/uvic_rooms.csv for known rooms
const roomDetails: Record<string, { capacity: number; av: string; url: string }> = {
  'ELL 060 – Classroom': {
    capacity: 68,
    av: '1 digital video projector; 1 document camera; A built-in classroom computer with webcam; Lecture capture capability; Podium; Room speakers; Video and audio laptop connectors (HDMI, VGA, 3.5mm audio); Wireless mic',
    url: 'https://www.uvic.ca/search/rooms/pages/ell-060-classroom.php',
  },
  'ELL 162 – Classroom': {
    capacity: 54,
    av: '1 digital video projector; 1 document camera; A built-in classroom computer with webcam; Lecture capture capability; Podium; Room speakers; Video and audio laptop connectors (HDMI, VGA, 3.5mm audio); Wireless mic',
    url: 'https://www.uvic.ca/search/rooms/pages/ell-162-classroom.php',
  },
  'MAC D116 – Classroom': {
    capacity: 59,
    av: '1 digital video projector; 1 document camera; A built-in classroom computer with webcam; Lecture capture capability; Room speakers; Video and audio laptop connectors (HDMI, VGA, 3.5mm audio); Wireless mic',
    url: 'https://www.uvic.ca/search/rooms/pages/mac-d116-classroom.php',
  },
};

const StaffBookingHistory: React.FC = () => {
  const buildings = useMemo(
    () => Array.from(new Set(pastBookings.map((b) => b.building))),
    []
  );
  const [selectedBuilding, setSelectedBuilding] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const roomsForBuilding = useMemo(() => {
    if (!selectedBuilding) return [] as string[];
    return Array.from(
      new Set(
        pastBookings
          .filter((b) => b.building === selectedBuilding)
          .map((b) => b.room)
      )
    );
  }, [selectedBuilding]);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return pastBookings.filter((b) => {
      if (selectedBuilding && b.building !== selectedBuilding) return false;
      if (selectedRoom && b.room !== selectedRoom) return false;
      if (selectedDate && b.date !== selectedDate) return false;
      return true;
    });
  }, [selectedBuilding, selectedRoom, selectedDate]);

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <GenericPage
      title="Booking History"
      description="View your past booking history and records"
      userType="staff"
    >
      <div style={{ marginTop: 16, marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
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
          <label htmlFor="hist-building" style={{ fontWeight: 'bold', marginRight: 8 }}>Building:</label>
          <select
            id="hist-building"
            value={selectedBuilding}
            onChange={(e) => {
              setSelectedBuilding(e.target.value);
              setSelectedRoom('');
            }}
            style={{ padding: '4px 8px', fontSize: '1rem' }}
          >
            <option value="">All</option>
            {buildings.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="hist-room" style={{ fontWeight: 'bold', marginRight: 8 }}>Classroom:</label>
          <select
            id="hist-room"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            disabled={!selectedBuilding}
            style={{ padding: '4px 8px', fontSize: '1rem' }}
          >
            <option value="">All</option>
            {roomsForBuilding.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {filtered.map((b) => (
          <li
            key={b.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: '12px 16px',
              marginBottom: 12,
              background: '#fff',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 style={{ margin: 0 }}>{b.title}</h3>
              <span style={{ color: '#555' }}>{b.date}</span>
            </div>
            <div style={{ marginTop: 6, color: '#333' }}>
              <div>
                <strong>Location:</strong> {b.building} — {b.room}
              </div>
              <div>
                <strong>Time:</strong> {b.startTime} – {b.endTime}
              </div>
            </div>
            <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
              <button
                type="button"
                style={{
                  padding: '6px 10px',
                  borderRadius: 6,
                  border: '1px solid #bbb',
                  background: '#f7f7f7',
                  cursor: 'pointer',
                }}
                onClick={() => toggleExpanded(b.id)}
              >
                {expandedIds.has(b.id) ? 'Hide details' : 'Details'}
              </button>
            </div>
            {expandedIds.has(b.id) && (
              <div
                style={{
                  marginTop: 12,
                  padding: '10px 12px',
                  background: '#fafafa',
                  border: '1px solid #eee',
                  borderRadius: 6,
                }}
              >
                <div style={{ marginBottom: 6 }}>
                  <strong>Capacity:</strong>{' '}
                  {roomDetails[b.room]?.capacity ?? 'N/A'}
                </div>
                <div style={{ marginBottom: 6 }}>
                  <strong>AV Equipment:</strong>{' '}
                  <span style={{ color: '#444' }}>{roomDetails[b.room]?.av ?? 'N/A'}</span>
                </div>
                {roomDetails[b.room]?.url && (
                  <div>
                    <strong>More info:</strong>{' '}
                    <a href={roomDetails[b.room].url} target="_blank" rel="noreferrer">
                      View room details (uvic.ca)
                    </a>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </GenericPage>
  );
};

export default StaffBookingHistory;
