import React, { useState, useEffect, ChangeEvent } from 'react';
import GenericPage from '../../GenericPage';

interface Room {
  id: number;
  room_name: string;
  building: string;
  capacity: number;
}

interface Timeslot {
  id: number;
  startTime: string;
  endTime: string;
}

const RegistrarClassroomManagement: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [name, setName] = useState('');
  const [building, setBuilding] = useState('');
  const [capacity, setCapacity] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Timeslot states
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [timeslotSuccess, setTimeslotSuccess] = useState('');

  // Using GenericPage for header/back navigation

  // Fetch all rooms
  const fetchRooms = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:4000/rooms');
      const data = await res.json();
      setRooms(data);
    } catch {
      setError('Failed to fetch rooms');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Add a new room
  const handleAddRoom = async () => {
    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch('http://localhost:4000/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_name: name, building, capacity }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to add room');
      }
      setName('');
      setBuilding('');
      setCapacity(0);
      setSuccessMsg('Room added successfully!');
      setTimeout(() => setSuccessMsg(''), 5000);
      fetchRooms();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Delete a room
  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:4000/rooms/${id}`, { method: 'DELETE' });
      fetchRooms();
    } catch {
      setError('Failed to delete room');
    }
  };

  // --- Timeslot management ---
  const fetchTimeslots = async (roomId: number) => {
    try {
      const res = await fetch(`http://localhost:4000/timeslots?roomId=${roomId}`);
      const data = await res.json();
      const sorted = Array.isArray(data)
        ? data.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
        : [];
      setTimeslots(sorted);
    } catch {
      setError('Failed to fetch timeslots');
      setTimeslots([]);
    }
  };

  const openTimeslotModal = (room: Room) => {
    setSelectedRoom(room);
    setShowModal(true);
    setTimeslotSuccess('');
    fetchTimeslots(room.id);
  };

  const handleAddTimeslot = async () => {
    if (!selectedRoom) return;

    setError('');
    setTimeslotSuccess('');

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (endDate <= startDate) {
      setError('End time must be after start time');
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/timeslots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: selectedRoom.id, startTime: startDate, endTime: endDate }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to add timeslot');
      }

      setStart('');
      setEnd('');
      setTimeslotSuccess('Timeslot added successfully!');
      fetchTimeslots(selectedRoom.id);
    } catch (err: any) {
      setError(err.message || 'Failed to add timeslot');
    }
  };

  const handleDeleteTimeslot = async (id: number) => {
    try {
      await fetch(`http://localhost:4000/timeslots/${id}`, { method: 'DELETE' });
      if (selectedRoom) fetchTimeslots(selectedRoom.id);
    } catch {
      setError('Failed to delete timeslot');
    }
  };
  // --- End timeslot management ---

  return (
    <GenericPage
      title="Classroom Management"
      description="Create, update, and manage rooms and their time slots"
      userType="registrar"
    >
      <>
        {/* Add Room Form */}
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div>
            <h3 style={{ marginBottom: 8 }}>Add New Room</h3>
            {error && <div style={{ color: 'red', marginBottom: 4 }}>{error}</div>}
            {successMsg && <div style={{ color: 'green', marginBottom: 4 }}>{successMsg}</div>}
            <input
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ marginRight: 8, padding: 4 }}
            />
            <input
              placeholder="Building"
              value={building}
              onChange={e => setBuilding(e.target.value)}
              style={{ marginRight: 8, padding: 4 }}
            />
            <input
              type="number"
              placeholder="Capacity"
              value={capacity}
              onChange={e => setCapacity(Number(e.target.value))}
              style={{ marginRight: 8, padding: 4, width: 80 }}
            />
            <button
              onClick={handleAddRoom}
              style={{ background: '#2257bf', color: 'white', padding: '6px 12px', borderRadius: 4, cursor: 'pointer' }}
            >
              Add Room
            </button>
          </div>
        </div>

        {/* Rooms Table */}
        {loading ? (
          <div>Loading rooms...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0a4a7e', color: 'white' }}>
                <th style={{ padding: 8 }}>Name</th>
                <th style={{ padding: 8 }}>Building</th>
                <th style={{ padding: 8 }}>Capacity</th>
                <th style={{ padding: 8 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(room => (
                <tr key={room.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: 8 }}>{room.room_name}</td>
                  <td style={{ padding: 8 }}>{room.building}</td>
                  <td style={{ padding: 8 }}>{room.capacity}</td>
                  <td style={{ padding: 8 }}>
                    <button
                      onClick={() => openTimeslotModal(room)}
                      style={{ background: '#28a745', color: 'white', border: 'none', padding: '4px 8px', borderRadius: 4, cursor: 'pointer', marginRight: 4 }}
                    >
                      Time Slots
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      style={{ background: '#dc3545', color: 'white', border: 'none', padding: '4px 8px', borderRadius: 4, cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {rooms.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: 16 }}>
                    No rooms available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* --- Modal for time slots --- */}
        {showModal && selectedRoom && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.4)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}
          >
            <div
              style={{
                background: 'white',
                padding: 24,
                borderRadius: 8,
                width: '500px',
                maxHeight: '80%',
                overflowY: 'auto',
              }}
            >
              <h2>Time Slots for {selectedRoom.room_name}</h2>

              {/* Success / Error messages */}
              {timeslotSuccess && <div style={{ color: 'green', marginBottom: 8 }}>{timeslotSuccess}</div>}
              {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

              {/* Inputs to add new timeslot */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <input
                  type="datetime-local"
                  value={start}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setStart(e.target.value)}
                  style={{ flex: 1, padding: 4 }}
                />
                <input
                  type="datetime-local"
                  value={end}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEnd(e.target.value)}
                  style={{ flex: 1, padding: 4 }}
                />
                <button
                  onClick={handleAddTimeslot}
                  disabled={!start || !end}
                  style={{
                    background: '#28a745',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: 4,
                    cursor: !start || !end ? 'not-allowed' : 'pointer',
                  }}
                >
                  Add
                </button>
              </div>

              {/* --- Half-hour time slot grid --- */}
              <div style={{ marginTop: 16 }}>
                <h3>Available Time Slots (7:30 AM – 7:00 PM)</h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 8,
                    marginTop: 8,
                  }}
                >
                  {(() => {
                    const slots: string[] = [];
                    for (let hour = 7.5; hour <= 19; hour += 0.5) {
                      const h = Math.floor(hour);
                      const m = (hour - h) * 60;
                      const hh = h.toString().padStart(2, '0');
                      const mm = m === 0 ? '00' : '30';
                      slots.push(`${hh}:${mm}`);
                    }

                    return slots.map((slot) => {
                      const isBooked = timeslots.some((ts) => {
                        const tsStart = new Date(ts.startTime);
                        const slotStr = `${tsStart.getHours().toString().padStart(2, '0')}:${tsStart.getMinutes() === 0 ? '00' : '30'}`;
                        return slotStr === slot;
                      });

                      const h = parseInt(slot.split(':')[0], 10);
                      const m = parseInt(slot.split(':')[1], 10);
                      const displayHour = h % 12 === 0 ? 12 : h % 12;
                      const ampm = h >= 12 ? 'PM' : 'AM';
                      const displayTime = `${displayHour}:${m === 0 ? '00' : '30'} ${ampm}`;

                      return (
                        <div
                          key={slot}
                          style={{
                            padding: 8,
                            borderRadius: 6,
                            textAlign: 'center',
                            cursor: isBooked ? 'not-allowed' : 'pointer',
                            backgroundColor: isBooked ? '#ffd1d1' : '#d1ffd1',
                            color: isBooked ? '#a80000' : '#006400',
                            fontWeight: 'bold',
                          }}
                          onClick={() => {
                            if (!isBooked && selectedRoom) {
                              const today = new Date();
                              const startTime = new Date(today);
                              startTime.setHours(h, m, 0, 0);
                              const endTime = new Date(startTime);
                              endTime.setMinutes(endTime.getMinutes() + 30);

                              setStart(startTime.toISOString().slice(0, 16));
                              setEnd(endTime.toISOString().slice(0, 16));
                            }
                          }}
                        >
                          {isBooked ? `${displayTime} ✓` : displayTime}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Close modal button */}
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setTimeslots([]);
                    setSelectedRoom(null);
                    setStart('');
                    setEnd('');
                    setError('');
                    setTimeslotSuccess('');
                  }}
                  style={{
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: 4,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    </GenericPage>
  );
};

export default RegistrarClassroomManagement;
