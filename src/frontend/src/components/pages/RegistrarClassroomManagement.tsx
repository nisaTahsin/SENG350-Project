
import React, { useEffect, useState } from 'react';
import GenericPage from '../GenericPage';

type Room = {
  id: number;
  name: string;
  building: string;
  capacity: number;
};

const RegistrarClassroomManagement: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newRoom, setNewRoom] = useState({ name: '', building: '', capacity: 0 });

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('http://localhost:4000/rooms');
        const data = await response.json();
        setRooms(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to fetch rooms');
      }
      setLoading(false);
    };
    fetchRooms();
  }, []);

  const handleAddRoom = async () => {
    try {
      const response = await fetch('http://localhost:4000/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRoom),
      });
      const data = await response.json();
      if (data && data.id) {
        setRooms(prev => [...prev, data]);
        setNewRoom({ name: '', building: '', capacity: 0 });
      } else {
        setError('Failed to add room');
      }
    } catch {
      setError('Failed to add room');
    }
  };

  const handleDeleteRoom = async (id: number) => {
    try {
      await fetch(`http://localhost:4000/rooms/${id}`, { method: 'DELETE' });
      setRooms(prev => prev.filter(r => r.id !== id));
    } catch {
      setError('Failed to delete room');
    }
  };

  return (
    <GenericPage
      title="Classroom Management"
      description="Add, edit, or remove classroom information and settings"
      userType="registrar"
    >
      <div style={{ margin: '16px 0' }}>
        <h3>Add New Room</h3>
        <input
          type="text"
          placeholder="Name"
          value={newRoom.name}
          onChange={e => setNewRoom({ ...newRoom, name: e.target.value })}
          style={{ marginRight: 8 }}
        />
        <input
          type="text"
          placeholder="Building"
          value={newRoom.building}
          onChange={e => setNewRoom({ ...newRoom, building: e.target.value })}
          style={{ marginRight: 8 }}
        />
        <input
          type="number"
          placeholder="Capacity"
          value={newRoom.capacity}
          onChange={e => setNewRoom({ ...newRoom, capacity: Number(e.target.value) })}
          style={{ marginRight: 8 }}
        />
        <button onClick={handleAddRoom}>Add Room</button>
      </div>
      {loading ? (
        <div>Loading rooms...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Building</th>
              <th>Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(room => (
              <tr key={room.id}>
                <td>{room.name}</td>
                <td>{room.building}</td>
                <td>{room.capacity}</td>
                <td>
                  <button onClick={() => handleDeleteRoom(room.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </GenericPage>
  );
};

export default RegistrarClassroomManagement;
