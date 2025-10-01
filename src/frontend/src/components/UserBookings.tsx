import React, { useState } from 'react';

// Reuse the Booking type and mockBookings from StaffMyBookings
// In a real app, pass bookings as props or fetch from backend

type Booking = {
  id: string;
  title: string;
  building: string;
  room: string;
  date: string;
  startTime: string;
  endTime: string;
};

const mockBookings: Booking[] = [
  {
    id: 'b1',
    title: 'Project Sync',
    building: 'Elliot Building',
    room: 'ELL 060 – Classroom',
    date: '2025-10-02',
    startTime: '10:00 AM',
    endTime: '11:30 AM',
  },
  {
    id: 'b2',
    title: 'Workshop Prep',
    building: 'Maclaurin Building',
    room: 'MAC D116 – Classroom',
    date: '2025-10-03',
    startTime: '1:00 PM',
    endTime: '2:30 PM',
  },
];

const roomDetails: Record<string, { capacity: number; av: string; url: string }> = {
  'ELL 060 – Classroom': {
    capacity: 68,
    av: '1 digital video projector; 1 document camera; A built-in classroom computer with webcam; Lecture capture capability; Podium; Room speakers; Video and audio laptop connectors (HDMI, VGA, 3.5mm audio); Wireless mic',
    url: 'https://www.uvic.ca/search/rooms/pages/ell-060-classroom.php',
  },
  'MAC D116 – Classroom': {
    capacity: 59,
    av: '1 digital video projector; 1 document camera; A built-in classroom computer with webcam; Lecture capture capability; Room speakers; Video and audio laptop connectors (HDMI, VGA, 3.5mm audio); Wireless mic',
    url: 'https://www.uvic.ca/search/rooms/pages/mac-d116-classroom.php',
  },
};

const UserBookings: React.FC<{ userName: string; onClose: () => void }> = ({ userName, onClose }) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <div style={{ background: 'white', borderRadius: 10, padding: 32, minWidth: 400, maxWidth: 600, boxShadow: '0 2px 10px rgba(0,0,0,0.2)', maxHeight: '80vh', overflowY: 'auto' }}>
        <h2 style={{ marginTop: 0 }}>Bookings for {userName}</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {mockBookings.map((b) => (
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
                <button
                  type="button"
                  style={{
                    padding: '6px 10px',
                    borderRadius: 6,
                    border: '1px solid #c33',
                    background: '#fbeaea',
                    color: '#a11',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    // Placeholder action
                    alert(`Cancel booking: ${b.title}`);
                  }}
                >
                  Cancel
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
        <div style={{ textAlign: 'right', marginTop: 16 }}>
          <button onClick={onClose} style={{ padding: '8px 20px', borderRadius: 6, background: '#2257bf', color: 'white', border: 'none' }}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default UserBookings;
