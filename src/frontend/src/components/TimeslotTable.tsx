import React from 'react';

interface BookingCell {
  label: string;
  span: number; // number of time slots this booking covers
}

interface TimeslotTableProps {
  times: string[];
  rooms: string[];
  // bookings: { [room: string]: { [time: string]: string } };
  bookings: { [room: string]: { [time: string]: string | BookingCell } };
}

const TimeslotTable: React.FC<TimeslotTableProps> = ({ times, rooms, bookings }) => {
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
    skipCell[room] = {};
  });

  return (
    <div style={{ maxWidth: '900px', overflowX: 'auto', margin: '0 auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#0a4a7e', color: 'white' }}>
            <th style={{ ...timeColStyle, border: 'none', padding: 12, textAlign: 'left', fontWeight: 'bold', fontSize: 14 }}>TIME</th>
            {rooms.map(room => (
              <th
                key={room}
                style={{ border: 'none', padding: 12, whiteSpace: 'nowrap', textAlign: 'left', fontWeight: 'bold', fontSize: 14 }}
              >
                {room}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map((time, rowIdx) => (
            <tr key={time} style={{ borderBottom: '1px solid #dee2e6' }}>
              <td style={{ ...timeColStyle, padding: 12, fontSize: 13, fontFamily: 'monospace', background: '#f8f9fa', textAlign: 'left' }}>{time}</td>
              {rooms.map(room => {
                if (skipCell[room][time]) return null;
                const booking = bookings[room]?.[time];
                if (booking && typeof booking === 'object' && 'span' in booking && booking.span > 1) {
                  for (let i = 1; i < booking.span; i++) {
                    const nextTime = times[rowIdx + i];
                    if (nextTime) skipCell[room][nextTime] = true;
                  }
                  return (
                    <td
                      key={room}
                      rowSpan={booking.span}
                      style={{ border: '1px solid #ccc', padding: 12, background: '#bcd', verticalAlign: 'middle', fontWeight: 'bold', fontSize: 13, textAlign: 'center' }}
                    >
                      {booking.label}
                    </td>
                  );
                }
                if (typeof booking === 'string') {
                  return (
                    <td key={room} style={{ border: '1px solid #ccc', padding: 12, background: '#bcd', fontWeight: 'bold', fontSize: 13, textAlign: 'center' }}>{booking}</td>
                  );
                }
                return (
                  <td key={room} style={{ border: '1px solid #ccc', padding: 12, background: '#fff', fontSize: 13, textAlign: 'center' }} />
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
