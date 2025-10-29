
import React, { useEffect, useState } from 'react';
import GenericPage from '../GenericPage';

const RegistrarStatisticsLogs: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [popularRooms, setPopularRooms] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [statsRes, roomsRes, auditRes] = await Promise.all([
          fetch('http://localhost:4000/analytics/booking-stats'),
          fetch('http://localhost:4000/analytics/popular-rooms'),
          fetch('http://localhost:4000/audit?limit=10'),
        ]);
        const statsData = await statsRes.json();
        const roomsData = await roomsRes.json();
        const auditData = await auditRes.json();
        setStats(statsData);
        setPopularRooms(roomsData.success ? roomsData.data || [] : []);
        setAuditLogs(auditData.success ? auditData.data || [] : []);
      } catch {
        setError('Failed to fetch statistics or logs');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <GenericPage
      title="Statistics & System Logs"
      description="View booking statistics, generate reports, and monitor system activity"
      userType="registrar"
    >
      {loading ? (
        <div>Loading statistics and logs...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <>
          <section style={{ marginBottom: 32 }}>
            <h3>Booking Statistics</h3>
            {stats && stats.success ? (
              <ul>
                {Object.entries(stats.data || {}).map(([status, count]) => (
                  <li key={status}><strong>{status}:</strong> {String(count)}</li>
                ))}
              </ul>
            ) : (
              <div>No booking statistics available.</div>
            )}
          </section>
          <section style={{ marginBottom: 32 }}>
            <h3>Popular Rooms</h3>
            {popularRooms.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th>Room Name</th>
                    <th>Building</th>
                    <th>Capacity</th>
                    <th>Booking Count</th>
                  </tr>
                </thead>
                <tbody>
                  {popularRooms.map((room: any) => (
                    <tr key={room.id}>
                      <td>{room.room_name}</td>
                      <td>{room.building}</td>
                      <td>{room.capacity}</td>
                      <td>{room.booking_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>No popular rooms data available.</div>
            )}
          </section>
          <section>
            <h3>Recent Audit Logs</h3>
            {auditLogs.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Actor</th>
                    <th>Action</th>
                    <th>Target</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log: any) => (
                    <tr key={log.id}>
                      <td>{log.timestamp}</td>
                      <td>{log.actor_username || log.actorId}</td>
                      <td>{log.action}</td>
                      <td>{log.targetType} {log.targetId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>No audit logs available.</div>
            )}
          </section>
        </>
      )}
    </GenericPage>
  );
};

export default RegistrarStatisticsLogs;
