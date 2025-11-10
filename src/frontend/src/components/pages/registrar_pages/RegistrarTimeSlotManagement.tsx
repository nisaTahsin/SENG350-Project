
import React, { useEffect, useState } from 'react';
import GenericPage from '../../GenericPage';

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
      title="Timeslot Management"
      description="Configure available time slots and scheduling rules"
      userType="registrar"
    >
      <div style={{ margin: '16px 0' }}>
        <div style={{
          border: '1px solid #eee',
          borderRadius: 8,
          padding: '12px 16px',
          background: '#fff',
          marginBottom: 16,
        }}>
          <h3 style={{ marginTop: 0 }}>Add New Timeslot</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <input
              type="number"
              placeholder="Room ID"
              value={newTimeslot.roomId}
              onChange={e => setNewTimeslot({ ...newTimeslot, roomId: Number(e.target.value) })}
              style={{ padding: '6px 8px' }}
            />
            <input
              type="datetime-local"
              placeholder="Start Time"
              value={newTimeslot.startTime}
              onChange={e => setNewTimeslot({ ...newTimeslot, startTime: e.target.value })}
              style={{ padding: '6px 8px' }}
            />
            <input
              type="datetime-local"
              placeholder="End Time"
              value={newTimeslot.endTime}
              onChange={e => setNewTimeslot({ ...newTimeslot, endTime: e.target.value })}
              style={{ padding: '6px 8px' }}
            />
            <button onClick={handleAddTimeslot} style={{ padding: '6px 12px' }}>Add Timeslot</button>
          </div>
        </div>

        {loading ? (
          <div>Loading timeslots...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : (
          <div style={{
            border: '1px solid #eee',
            borderRadius: 8,
            padding: '12px 16px',
            background: '#fff',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Room ID</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Start Time</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>End Time</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {timeslots.map(timeslot => (
                  <tr key={timeslot.id}>
                    <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{timeslot.roomId}</td>
                    <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{timeslot.startTime}</td>
                    <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{timeslot.endTime}</td>
                    <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>
                      <button onClick={() => handleDeleteTimeslot(timeslot.id)} style={{ padding: '4px 10px' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </GenericPage>
  );
};

export default RegistrarTimeSlotManagement;
