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

interface MaintenanceWindow {
  id?: number;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
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
  // Maintenance states
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [maintenance, setMaintenance] = useState<MaintenanceWindow>({ date: '', startTime: '', endTime: '', type: 'maintenance' });
  const [maintenanceSuccess, setMaintenanceSuccess] = useState('');
  const [updatingCapacityId, setUpdatingCapacityId] = useState<number | null>(null);
  const [capacityDraft, setCapacityDraft] = useState<number | null>(null);

  // Using GenericPage for header/back navigation

  // Fetch all rooms
  const fetchRooms = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:4000/rooms');
      const data = await res.json();

      // Defensive handling: backend may return an object (e.g. { success: true, rooms: [...] })
      if (Array.isArray(data)) {
        setRooms(data);
      } else if (data && Array.isArray((data as any).rooms)) {
        setRooms((data as any).rooms);
      } else if (data && Array.isArray((data as any).data)) {
        setRooms((data as any).data);
      } else {
        // preserve current rooms if response shape is unexpected
        console.warn('fetchRooms: unexpected response shape', data);
        setError('Unexpected response from server when fetching rooms');
      }
    } catch (err) {
      console.error('fetchRooms error', err);
      setError('Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
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

  // Update room capacity inline
  const handleUpdateCapacity = async (roomId: number) => {
    if (capacityDraft == null || capacityDraft < 0) {
      setError('Capacity must be a positive number');
      return;
    }
    
    setError('');
    try {
      const res = await fetch(`http://localhost:4000/rooms/${roomId}/capacity`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ capacity: capacityDraft }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ message: 'Failed to update capacity' }));
        throw new Error(errData.message || 'Failed to update capacity');
      }

      // After a successful PATCH, fetch the single updated room and merge it into state.
      try {
        const roomRes = await fetch(`http://localhost:4000/rooms/${roomId}`);
        if (roomRes.ok) {
          const updatedRoom = await roomRes.json().catch(() => null);
          if (updatedRoom && (updatedRoom.id || updatedRoom.room_name)) {
            // some APIs return the room object directly, some wrap it
            const roomObj = updatedRoom.room || updatedRoom.updatedRoom || updatedRoom;
            if (roomObj && roomObj.id) {
              setRooms(prev => prev.map(r => (r.id === roomObj.id ? { ...r, ...roomObj } : r)));
            } else {
              setRooms(prev => prev.map(r => (r.id === roomId ? { ...r, capacity: capacityDraft as number } : r)));
            }
          } else {
            // fallback optimistic update
            setRooms(prev => prev.map(r => (r.id === roomId ? { ...r, capacity: capacityDraft as number } : r)));
          }
        } else {
          // fallback optimistic update
          setRooms(prev => prev.map(r => (r.id === roomId ? { ...r, capacity: capacityDraft as number } : r)));
        }
      } catch (e) {
        // network or parse error -> optimistic update
        setRooms(prev => prev.map(r => (r.id === roomId ? { ...r, capacity: capacityDraft as number } : r)));
      }

      setUpdatingCapacityId(null);
      setCapacityDraft(null);
      setSuccessMsg('Capacity updated successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(typeof err === 'string' ? err : (err.message || 'Failed to update capacity'));
      // Keep the edit mode active so user can try again
      setCapacityDraft(capacityDraft);
    }
  };

  // --- Timeslot management ---
  const fetchTimeslots = async (roomId: number) => {
    try {
      const res = await fetch(`http://localhost:4000/timeslots?roomId=${roomId}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Failed to fetch timeslots: ${res.status}`);
      }

      const data = await res.json();
      // Handle different response shapes
      const timeslotArray = Array.isArray(data) ? data : 
                          Array.isArray(data.timeslots) ? data.timeslots :
                          Array.isArray(data.data) ? data.data : [];

      const sorted = timeslotArray.sort((a: Timeslot, b: Timeslot) => 
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
      setTimeslots(sorted);
      setError(''); // Clear any previous errors
    } catch (err: any) {
      console.error('Fetch timeslots error:', err);
      setError(err.message || 'Failed to fetch timeslots');
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

    // Validate time range (7:30 AM - 7:00 PM)
    const startHour = startDate.getHours() + startDate.getMinutes() / 60;
    const endHour = endDate.getHours() + endDate.getMinutes() / 60;

    if (startHour < 7.5 || startHour > 19 || endHour < 7.5 || endHour > 19) {
      setError('Time slots must be between 7:30 AM and 7:00 PM');
      return;
    }

    if (endDate <= startDate) {
      setError('End time must be after start time');
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/timeslots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          roomId: selectedRoom.id, 
          startTime: startDate.toISOString(), // Ensure proper ISO string format
          endTime: endDate.toISOString() 
        }),
      });

      if (!res.ok) {
        // try to extract JSON error, otherwise text
        let errMsg = 'Failed to add timeslot';
        try {
          const err = await res.json();
          errMsg = err.message || JSON.stringify(err);
          console.error('Timeslot error:', err); // Add logging
        } catch {
          const txt = await res.text().catch(() => '');
          if (txt) errMsg = txt;
          console.error('Timeslot error text:', txt); // Add logging
        }
        throw new Error(errMsg);
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
      const res = await fetch(`http://localhost:4000/timeslots/${id}`, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to delete timeslot');
      }

      if (selectedRoom) {
        fetchTimeslots(selectedRoom.id);
        setTimeslotSuccess('Timeslot deleted successfully');
        setTimeout(() => setTimeslotSuccess(''), 3000);
      }
    } catch (err: any) {
      console.error('Delete timeslot error:', err);
      setError(err.message || 'Failed to delete timeslot');
    }
  };

  // Maintenance handlers
  const openMaintenanceModal = (room: Room) => {
    setSelectedRoom(room);
    setShowMaintenanceModal(true);
    setMaintenance({ date: '', startTime: '', endTime: '', type: 'maintenance' });
    setMaintenanceSuccess('');
  };

  const handleAddMaintenance = async () => {
    if (!selectedRoom) return;
      if (!maintenance.date || !maintenance.startTime || !maintenance.endTime) {
        setError('Please fill in all fields');
        return;
      }

    setError('');
    setMaintenanceSuccess('');
   
      // Combine date and time into proper ISO string format
      const startDateTime = new Date(`${maintenance.date}T${maintenance.startTime}`);
      const endDateTime = new Date(`${maintenance.date}T${maintenance.endTime}`);

      if (endDateTime <= startDateTime) {
        setError('End time must be after start time');
        return;
      }

    try {
      // POST to the central maintenance endpoint (server exposes /maintenance)
      const res = await fetch(`http://localhost:4000/maintenance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: selectedRoom.id,
          date: maintenance.date,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          type: maintenance.type,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to add maintenance window');
      }
      // Clear form and show success
      setMaintenance({ date: '', startTime: '', endTime: '', type: 'maintenance' });
      setMaintenanceSuccess('Maintenance window added');
    } catch (err: any) {
      setError(err.message || 'Failed to add maintenance window');
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
                  <td style={{ padding: 8 }}>
                    {updatingCapacityId === room.id ? (
                      <>
                        <input
                          type="number"
                          value={capacityDraft ?? room.capacity}
                          onChange={(e) => setCapacityDraft(Number(e.target.value))}
                          style={{ width: 80, marginRight: 8 }}
                        />
                        <button onClick={() => handleUpdateCapacity(room.id)} style={{ marginRight: 4 }}>Save</button>
                        <button onClick={() => { setUpdatingCapacityId(null); setCapacityDraft(null); }}>Cancel</button>
                        </>) : (<>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: 8, minWidth: '40px' }}>{room.capacity}</span>
                            <button 
                              onClick={() => { setUpdatingCapacityId(room.id); setCapacityDraft(room.capacity); }}
                              style={{ 
                                padding: '4px 8px',
                                backgroundColor: '#f8f9fa',
                                border: '1px solid #dee2e6',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                            >
                              Edit
                            </button>
                          </div>
                        </>
                    )}
                  </td>
                  <td style={{ padding: 8 }}>
                    <button
                      onClick={() => openTimeslotModal(room)}
                      style={{ background: '#28a745', color: 'white', border: 'none', padding: '4px 8px', borderRadius: 4, cursor: 'pointer', marginRight: 4 }}
                    >
                      Time Slots
                    </button>
                    <button
                      onClick={() => openMaintenanceModal(room)}
                      style={{ background: '#ff9900', color: 'white', border: 'none', padding: '4px 8px', borderRadius: 4, cursor: 'pointer', marginRight: 4 }}
                    >
                      Maintenance
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2>Time Slots for {selectedRoom.room_name}</h2>
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
                  ✕ Close
                </button>
              </div>

              {/* Success / Error messages */}
              {timeslotSuccess && <div style={{ color: 'green', marginBottom: 8 }}>{timeslotSuccess}</div>}
              {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

              {/* Time Slot Grid */}
              <div style={{ marginBottom: 24 }}>
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

              {/* Existing Timeslots List */}
              {timeslots.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <h3>Existing Time Slots</h3>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                    gap: 8,
                    maxHeight: '200px',
                    overflowY: 'auto',
                    padding: '8px',
                    border: '1px solid #eee',
                    borderRadius: '4px'
                  }}>
                    {timeslots
                      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                      .map((slot) => {
                        const start = new Date(slot.startTime);
                        const end = new Date(slot.endTime);
                        const formatTime = (date: Date) => {
                          const hours = date.getHours();
                          const minutes = date.getMinutes();
                          const ampm = hours >= 12 ? 'PM' : 'AM';
                          const displayHours = hours % 12 || 12;
                          return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
                        };
                        return (
                          <div key={slot.id} style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '4px',
                            gap: '8px'
                          }}>
                            <span style={{ fontSize: '0.9em' }}>{formatTime(start)} - {formatTime(end)}</span>
                            <button
                              onClick={() => handleDeleteTimeslot(slot.id)}
                              style={{
                                background: '#dc3545',
                                color: 'white',
                                border: 'none',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.8em'
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Maintenance modal */}
        {showMaintenanceModal && selectedRoom && (
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
            <div style={{ background: 'white', padding: 24, borderRadius: 8, width: 480 }}>
              <h2>Maintenance for {selectedRoom.room_name}</h2>
              {maintenanceSuccess && <div style={{ color: 'green' }}>{maintenanceSuccess}</div>}
              {error && <div style={{ color: 'red' }}>{error}</div>}

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <input type="date" value={maintenance.date} onChange={(e) => setMaintenance({ ...maintenance, date: e.target.value })} />
                <input type="time" value={maintenance.startTime} onChange={(e) => setMaintenance({ ...maintenance, startTime: e.target.value })} />
                <input type="time" value={maintenance.endTime} onChange={(e) => setMaintenance({ ...maintenance, endTime: e.target.value })} />
              </div>
              <div style={{ marginTop: 8 }}>
                <select value={maintenance.type} onChange={(e) => setMaintenance({ ...maintenance, type: e.target.value })}>
                  <option value="maintenance">Maintenance</option>
                  <option value="capacity_check">Capacity Check</option>
                  <option value="av_check">AV Check</option>
                </select>
              </div>

              <div style={{ marginTop: 12 }}>
                <button onClick={handleAddMaintenance} style={{ marginRight: 8, background: '#28a745', color: 'white', padding: '6px 12px' }}>Add</button>
                <button onClick={() => { setShowMaintenanceModal(false); setSelectedRoom(null); setMaintenanceSuccess(''); setError(''); }} style={{ background: '#6c757d', color: 'white', padding: '6px 12px' }}>Close</button>
              </div>
            </div>
          </div>
        )}


      </>
    </GenericPage>
  );
};

export default RegistrarClassroomManagement;
