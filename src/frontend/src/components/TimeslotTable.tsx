import React from 'react';

interface BookingCell {
  label: string;
  span: number; // number of time slots this booking covers
}

interface Room {
  id: number;
  name: string;
  building: string;
}

interface TimeslotTableProps {
  times: string[];
  rooms: Room[];
  bookings: { [room: string]: { [time: string]: string | BookingCell } };
  onBookRoom?: (roomId: number, roomName: string, time: string) => void;
  bookingState?: {[key: string]: boolean};
  selectedDate?: string;
}

const TimeslotTable: React.FC<TimeslotTableProps> = ({ times, rooms, bookings, onBookRoom, bookingState = {}, selectedDate = '' }) => {
  console.log('TimeslotTable received bookingState:', bookingState);
  
  const timeColStyle: React.CSSProperties = {
    border: '1px solid #ccc',
    padding: '4px',
    width: '100px',
    minWidth: '100px',
    maxWidth: '100px',
    textAlign: 'center',
  };
  // Track which cells should be skipped due to rowspan
  const skipCell: { [room: string]: { [time: string]: boolean } } = {};
  rooms.forEach(room => {
    skipCell[room.name] = {};
  });

  return (
    <div style={{ maxWidth: '900px', overflowX: 'auto', margin: '0 auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#0a4a7e', color: 'white' }}>
            <th style={{ ...timeColStyle, border: 'none', padding: 12, textAlign: 'left', fontWeight: 'bold', fontSize: 14 }}>TIME</th>
            {rooms.map(room => (
              <th
                key={room.id}
                style={{ border: 'none', padding: 12, whiteSpace: 'nowrap', textAlign: 'left', fontWeight: 'bold', fontSize: 14 }}
              >
                {room.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map((time, rowIdx) => (
            <tr key={time} style={{ borderBottom: '1px solid #dee2e6' }}>
              <td style={{ ...timeColStyle, padding: 12, fontSize: 13, fontFamily: 'monospace', background: '#f8f9fa', textAlign: 'left' }}>{time}</td>
              {rooms.map(room => {
                if (skipCell[room.name][time]) return null;
                const booking = bookings[room.name]?.[time];
                if (booking && typeof booking === 'object' && 'span' in booking && booking.span > 1) {
                  for (let i = 1; i < booking.span; i++) {
                    const nextTime = times[rowIdx + i];
                    if (nextTime) skipCell[room.name][nextTime] = true;
                  }
                  return (
                    <td
                      key={room.id}
                      rowSpan={booking.span}
                      style={{ border: '1px solid #ccc', padding: 12, background: '#bcd', verticalAlign: 'middle', fontWeight: 'bold', fontSize: 13, textAlign: 'center' }}
                    >
                      {booking.label}
                    </td>
                  );
                }
                if (typeof booking === 'string') {
                  return (
                    <td key={room.id} style={{ border: '1px solid #ccc', padding: 12, background: '#bcd', fontWeight: 'bold', fontSize: 13, textAlign: 'center' }}>{booking}</td>
                  );
                }
                // Check if this room-time slot is booked
                const bookingKey = `${room.id}-${time}-${selectedDate}`;
                const isBooked = bookingState[bookingKey] || false;
                
                return (
                  <td key={room.id} style={{ border: '1px solid #ccc', padding: 12, background: isBooked ? '#d4edda' : '#fff', fontSize: 13, textAlign: 'center' }}>
                    {isBooked ? (
                      <span style={{ color: '#155724', fontWeight: 'bold', fontSize: '12px' }}>
                        ✓ Booked
                      </span>
                    ) : onBookRoom ? (
                      <button
                        onClick={() => onBookRoom(room.id, room.name, time)} // Pass the actual room ID and name
                        style={{
                          background: '#007bff',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        Book
                      </button>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimeslotTable;
