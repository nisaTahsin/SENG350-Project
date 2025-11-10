import React, { useEffect, useState } from 'react';
import GenericPage from '../../GenericPage';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

interface StatItem {
  status: string;
  count: number;
  percentage?: number;
}

interface Room {
  id: number;
  room_name: string;
  building: string;
  capacity: number;
  booking_count: number;
  utilization_rate?: number;  // Percentage of capacity utilized
  total_hours_booked?: number;
}

interface AuditLog {
  id: number;
  timestamp: string;
  user?: string;
  userRole?: string;
  action: string;
  targetType?: string;
  targetId?: number;
  details?: string;
}

interface BookingTrend {
  date: string;
  bookings: number;
  cancellations: number;
}

const RegistrarStatisticsLogs: React.FC = () => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [popularRooms, setPopularRooms] = useState<Room[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [bookingTrends, setBookingTrends] = useState<BookingTrend[]>([]);
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Calculate utilization metrics
  const calculateUtilization = (rooms: Room[]) => {
    return rooms.map(room => ({
      ...room,
      utilization_rate: (room.booking_count / room.capacity) * 100
    }));
  };

  const renderUtilizationBadge = (utilization: number) => {
    let color = '#4CAF50'; // Green for good utilization
    if (utilization < 50) {
      color = '#f44336'; // Red for low utilization
    } else if (utilization < 75) {
      color = '#ff9800'; // Orange for medium utilization
    }
    return (
      <div style={{ 
        backgroundColor: color,
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        display: 'inline-block'
      }}>
        {utilization.toFixed(1)}%
      </div>
    );
  };

  useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      const [statsRes, roomsRes, auditRes, trendsRes] = await Promise.all([
        fetch('http://localhost:4000/analytics/booking-stats'),
        fetch('http://localhost:4000/analytics/popular-rooms'),
        fetch('http://localhost:4000/audit/recent?limit=10'),
        fetch(`http://localhost:4000/analytics/booking-trends?range=${timeRange}`),
      ]);

      if (!statsRes.ok || !roomsRes.ok || !auditRes.ok || !trendsRes.ok) {
        throw new Error('Backend not ready');
      }

      const statsData = await statsRes.json();
      const roomsData = await roomsRes.json();
      const auditData = await auditRes.json();
      const trendsData = await trendsRes.json();

      // Normal processing (if real data exists)
      const normalizedStats: StatItem[] = statsData.data
        ? Object.entries(statsData.data).map(([status, count]) => ({
            status,
            count: Number(count),
          }))
        : [];

      const totalBookings = normalizedStats.reduce((acc, stat) => acc + stat.count, 0);
      const statsWithPercentages = normalizedStats.map(stat => ({
        ...stat,
        percentage: totalBookings > 0 ? (stat.count / totalBookings) * 100 : 0
      }));

      const processedRooms = calculateUtilization(roomsData.success ? roomsData.data || [] : []);

      setStats(statsWithPercentages);
      setPopularRooms(processedRooms);
      setAuditLogs(auditData.success ? auditData.data || [] : []);
      setBookingTrends(trendsData.success ? trendsData.data || [] : []);
    } catch (err) {
      console.warn('Backend unavailable, showing mock data...');
      // --- mock fallback data for demo ---
      setStats([
        { status: 'confirmed', count: 45, percentage: 60 },
        { status: 'pending', count: 20, percentage: 27 },
        { status: 'cancelled', count: 10, percentage: 13 },
      ]);

      setPopularRooms([
        { id: 1, room_name: 'ECS 123', building: 'ECS', capacity: 50, booking_count: 15},
        { id: 2, room_name: 'CLE A207', building: 'CLE', capacity: 60, booking_count: 10 },
      ]);

      setAuditLogs([
        { id: 1, timestamp: new Date().toISOString(), user: 'admin', userRole: 'Registrar', action: 'Added room', details: 'ECS 123' },
        { id: 2, timestamp: new Date().toISOString(), user: 'staffA', userRole: 'Staff', action: 'Booked room', details: 'CLE A207' },
      ]);

      setBookingTrends([
        { date: 'Nov 01', bookings: 10, cancellations: 2 },
        { date: 'Nov 02', bookings: 14, cancellations: 1 },
        { date: 'Nov 03', bookings: 18, cancellations: 3 },
        { date: 'Nov 04', bookings: 22, cancellations: 2 },
        { date: 'Nov 05', bookings: 26, cancellations: 5 },
      ]);
    }

    setLoading(false);
  };

  fetchData();
}, [timeRange]);


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
        <div style={{ 
          padding: '20px',
          textAlign: 'center',
          background: '#f5f5f5',
          borderRadius: '4px'
        }}>
          Loading statistics and logs...
        </div>
      ) : error ? (
        <div style={{ 
          color: 'white',
          background: '#f44336',
          padding: '20px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      ) : (
        <>
          {/* Time Range Selector */}
          <div style={{ marginBottom: 20 }}>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value as 'daily' | 'weekly' | 'monthly')}
              style={{ 
                padding: '8px',
                marginRight: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            >
              <option value="daily">Daily View</option>
              <option value="weekly">Weekly View</option>
              <option value="monthly">Monthly View</option>
            </select>
          </div>

          {/* Booking Trends */}
          <section style={{ marginBottom: 40 }}>
            <h3>Booking Trends</h3>
            <div style={{ height: 300, marginTop: 20 }}>
              {bookingTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bookingTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="bookings" stroke="#8884d8" name="Bookings" />
                    <Line type="monotone" dataKey="cancellations" stroke="#82ca9d" name="Cancellations" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ textAlign: 'center', padding: 20, background: '#f5f5f5', borderRadius: 4 }}>
                  No booking trends available yet. Trends will appear here as bookings are made.
                </div>
              )}
            </div>
          </section>

          {/* Room Utilization */}
          <section style={{ marginBottom: 40 }}>
            <h3>Room Utilization</h3>
            {popularRooms.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa' }}>
                      <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Room</th>
                      <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Building</th>
                      <th style={{ padding: 12, textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Capacity</th>
                      <th style={{ padding: 12, textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Bookings</th>
                      <th style={{ padding: 12, textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Utilization</th>
                    </tr>
                  </thead>
                  <tbody>
                    {popularRooms.map((room) => (
                      <tr key={room.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                        <td style={{ padding: 12 }}>{room.room_name}</td>
                        <td style={{ padding: 12 }}>{room.building}</td>
                        <td style={{ padding: 12, textAlign: 'right' }}>{room.capacity}</td>
                        <td style={{ padding: 12, textAlign: 'right' }}>{room.booking_count}</td>
                        <td style={{ padding: 12, textAlign: 'right' }}>
                          {renderUtilizationBadge(room.utilization_rate || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 20, background: '#f5f5f5', borderRadius: 4 }}>
                No room utilization data available yet.
              </div>
            )}
          </section>

          {/* Recent Audit Logs */}
          <section style={{ marginBottom: 40 }}>
            <h3>Recent Audit Logs</h3>
            {auditLogs.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa' }}>
                      <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Timestamp</th>
                      <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>User</th>
                      <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Action</th>
                      <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                        <td style={{ padding: 12 }}>{formatDate(log.timestamp)}</td>
                        <td style={{ padding: 12 }}>{log.user || 'System'} ({log.userRole || 'N/A'})</td>
                        <td style={{ padding: 12 }}>{log.action}</td>
                        <td style={{ padding: 12 }}>
                          {log.targetType && log.targetId ? `${log.targetType} #${log.targetId}` : 'N/A'}
                          {log.details && ` - ${log.details}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 20, background: '#f5f5f5', borderRadius: 4 }}>
                No audit logs available yet.
              </div>
            )}
          </section>
        </>
      )}
    </GenericPage>
  );
};

export default RegistrarStatisticsLogs;
