import React, { useEffect, useState } from 'react';
import GenericPage from '../GenericPage';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface StatItem {
  status: string;
  count: number;
}

interface Room {
  id: number;
  room_name: string;
  building: string;
  capacity: number;
  booking_count: number;
}

interface AuditLog {
  id: number;
  timestamp: string;
  actor_username?: string;
  actorId?: number;
  action: string;
  targetType?: string;
  targetId?: number;
}

const RegistrarStatisticsLogs: React.FC = () => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [popularRooms, setPopularRooms] = useState<Room[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
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

        // Normalize booking stats
        const normalizedStats: StatItem[] = statsData.data
          ? Object.entries(statsData.data).map(([status, count]) => ({
              status,
              count: Number(count),
            }))
          : [];

        setStats(normalizedStats);
        setPopularRooms(roomsData.success ? roomsData.data || [] : []);
        setAuditLogs(auditData.success ? auditData.data || [] : []);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch statistics or logs');
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

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
          {/* Booking Statistics */}
          <section style={{ marginBottom: 40 }}>
            <h3>📊 Booking Statistics</h3>
            {stats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={stats.map((item) => ({
                    name: item.status,
                    count: item.count,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div>No booking statistics available.</div>
            )}
          </section>

          {/* Popular Rooms */}
          <section style={{ marginBottom: 40 }}>
            <h3>🏫 Popular Rooms</h3>
            {popularRooms.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#0a4a7e', color: 'white' }}>
                    <th style={{ padding: 8 }}>Room Name</th>
                    <th style={{ padding: 8 }}>Building</th>
                    <th style={{ padding: 8 }}>Capacity</th>
                    <th style={{ padding: 8 }}>Booking Count</th>
                  </tr>
                </thead>
                <tbody>
                  {popularRooms.map((room) => (
                    <tr key={room.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: 8 }}>{room.room_name}</td>
                      <td style={{ padding: 8 }}>{room.building}</td>
                      <td style={{ padding: 8 }}>{room.capacity}</td>
                      <td style={{ padding: 8 }}>{room.booking_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>No popular rooms data available.</div>
            )}
          </section>

          {/* Recent Audit Logs */}
          <section>
            <h3>🧾 Recent Audit Logs</h3>
            {auditLogs.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#0a4a7e', color: 'white' }}>
                    <th style={{ padding: 8 }}>Timestamp</th>
                    <th style={{ padding: 8 }}>Actor</th>
                    <th style={{ padding: 8 }}>Action</th>
                    <th style={{ padding: 8 }}>Target</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: 8 }}>{formatDate(log.timestamp)}</td>
                      <td style={{ padding: 8 }}>{log.actor_username || log.actorId}</td>
                      <td style={{ padding: 8 }}>{log.action}</td>
                      <td style={{ padding: 8 }}>{`${log.targetType || ''} ${log.targetId || ''}`}</td>
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
