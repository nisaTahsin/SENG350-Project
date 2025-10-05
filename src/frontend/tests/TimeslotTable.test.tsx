// src/components/TimeslotTable.tsx
import React from 'react';

export type TimeslotCell =
  | 'FREE'
  | { label: string; span: number };

type Room = string | { id: string; name: string };

type Props = {
  times: string[];
  rooms: Room[];
  // data is keyed by roomId (object.id) or by the room string itself
  data: Record<string, TimeslotCell[]>;
};

function resolveRoomKey(room: Room) {
  return typeof room === 'string' ? room : room.id;
}

function resolveRoomLabel(room: Room) {
  return typeof room === 'string' ? room : room.name;
}

const TimeslotTable: React.FC<Props> = ({ times, rooms, data }) => {
  return (
    <table role="table" style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th style={{ padding: 8 }} />
          {rooms.map((room) => {
            const key = resolveRoomKey(room);
            const label = resolveRoomLabel(room);
            return (
              <th key={key} style={{ padding: 8 }}>
                {label}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {times.map((time, rowIdx) => (
          <tr key={time}>
            <td style={{ padding: 8 }}>{time}</td>
            {rooms.map((room) => {
              const roomKey = resolveRoomKey(room);
              const row = data[roomKey] ?? [];
              const cell = row[rowIdx];

              if (!cell) {
                return (
                  <td key={`${roomKey}-${rowIdx}`} style={{ padding: 8 }}>
                    FREE
                  </td>
                );
              }

              if (cell === 'FREE') {
                return (
                  <td key={`${roomKey}-${rowIdx}`} style={{ padding: 8 }}>
                    FREE
                  </td>
                );
              }

              // merged / spanning cell (render only at the first row of the span)
              // We assume `data` is precomputed so that only the top cell holds the object.
              return (
                <td
                  key={`${roomKey}-${rowIdx}`}
                  style={{ padding: 8, textAlign: 'center', fontWeight: 600 }}
                  rowSpan={cell.span}
                >
                  {cell.label}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TimeslotTable;
export type { Room };
