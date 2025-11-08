import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Room {
  id: number;
  room_name: string;
  building: string;
  capacity: number;
}

const RegistrarClassroomManagement: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [name, setName] = useState('');
  const [building, setBuilding] = useState('');
  const [capacity, setCapacity] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

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

      // Hide success message after 5 seconds
      setTimeout(() => setSuccessMsg(''), 5000);

      fetchRooms();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:4000/rooms/${id}`, { method: 'DELETE' });
      fetchRooms();
    } catch {
      setError('Failed to delete room');
    }
  };

  return (
    <div style={{ padding: 24, background: 'white', borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>Classroom Management</h1>

      <button
        style={{
          marginBottom: 24,
          background: '#6c757d',
          color: 'white',
          border: 'none',
          padding: '8px 18px',
          borderRadius: 4,
          fontSize: 14,
          cursor: 'pointer'
        }}
        onClick={() => navigate('/registrar-dashboard')}
      >
        ← Back to Dashboard
      </button>

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
    </div>
  );
};

export default RegistrarClassroomManagement;
