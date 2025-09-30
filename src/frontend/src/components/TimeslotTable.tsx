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
      <table style={{ borderCollapse: 'collapse', width: '100%', tableLayout: 'auto' }}>
        <thead>
          <tr>
            <th style={timeColStyle}>Time</th>
            {rooms.map(room => (
              <th key={room} style={{ border: '1px solid #ccc', padding: '4px', whiteSpace: 'nowrap' }}>{room}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map((time, rowIdx) => (
            <tr key={time}>
              <td style={timeColStyle}>{time}</td>
              {rooms.map(room => {
                // If this cell should be skipped due to rowspan, render nothing
                if (skipCell[room][time]) return null;
                const booking = bookings[room]?.[time];
                // If booking is a BookingCell with span > 1, render with rowspan
                if (booking && typeof booking === 'object' && 'span' in booking && booking.span > 1) {
                  // Mark the next (span-1) time slots for this room as skipped
                  for (let i = 1; i < booking.span; i++) {
                    const nextTime = times[rowIdx + i];
                    if (nextTime) skipCell[room][nextTime] = true;
                  }
                  return (
                    <td
                      key={room}
                      rowSpan={booking.span}
                      style={{ border: '1px solid #ccc', padding: '4px', background: '#bcd', verticalAlign: 'middle' }}
                    >
                      {booking.label}
                    </td>
                  );
                }
                // If booking is a string (single slot), render as before
                if (typeof booking === 'string') {
                  return (
                    <td key={room} style={{ border: '1px solid #ccc', padding: '4px', background: '#bcd' }}>{booking}</td>
                  );
                }
                // Otherwise, render empty cell
                return (
                  <td key={room} style={{ border: '1px solid #ccc', padding: '4px' }} />
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
