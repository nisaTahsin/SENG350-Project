
import React, { useEffect, useState } from 'react';
import GenericPage from '../GenericPage';

type Timeslot = {
  id: number;
  roomId: number;
  startTime: string;
  endTime: string;
};

const RegistrarTimeSlotManagement: React.FC = () => {
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTimeslot, setNewTimeslot] = useState({ roomId: 0, startTime: '', endTime: '' });

  useEffect(() => {
    const fetchTimeslots = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('http://localhost:4000/timeslots');
        const data = await response.json();
        setTimeslots(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to fetch timeslots');
      }
      setLoading(false);
    };
    fetchTimeslots();
  }, []);

  const handleAddTimeslot = async () => {
    try {
      const response = await fetch('http://localhost:4000/timeslots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTimeslot),
      });
      const data = await response.json();
      if (data && data.id) {
        setTimeslots(prev => [...prev, data]);
        setNewTimeslot({ roomId: 0, startTime: '', endTime: '' });
      } else {
        setError('Failed to add timeslot');
      }
    } catch {
      setError('Failed to add timeslot');
    }
  };

  const handleDeleteTimeslot = async (id: number) => {
    try {
      await fetch(`http://localhost:4000/timeslots/${id}`, { method: 'DELETE' });
      setTimeslots(prev => prev.filter(t => t.id !== id));
    } catch {
      setError('Failed to delete timeslot');
    }
  };

  return (
    <GenericPage
      title="Time Slot Management"
      description="Configure available time slots and scheduling rules"
      userType="registrar"
    >
      <div style={{ margin: '16px 0' }}>
        <h3>Add New Timeslot</h3>
        <input
          type="number"
          placeholder="Room ID"
          value={newTimeslot.roomId}
          onChange={e => setNewTimeslot({ ...newTimeslot, roomId: Number(e.target.value) })}
          style={{ marginRight: 8 }}
        />
        <input
          type="datetime-local"
          placeholder="Start Time"
          value={newTimeslot.startTime}
          onChange={e => setNewTimeslot({ ...newTimeslot, startTime: e.target.value })}
          style={{ marginRight: 8 }}
        />
        <input
          type="datetime-local"
          placeholder="End Time"
          value={newTimeslot.endTime}
          onChange={e => setNewTimeslot({ ...newTimeslot, endTime: e.target.value })}
          style={{ marginRight: 8 }}
        />
        <button onClick={handleAddTimeslot}>Add Timeslot</button>
      </div>
      {loading ? (
        <div>Loading timeslots...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Room ID</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {timeslots.map(timeslot => (
              <tr key={timeslot.id}>
                <td>{timeslot.roomId}</td>
                <td>{timeslot.startTime}</td>
                <td>{timeslot.endTime}</td>
                <td>
                  <button onClick={() => handleDeleteTimeslot(timeslot.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </GenericPage>
  );
};

export default RegistrarTimeSlotManagement;
