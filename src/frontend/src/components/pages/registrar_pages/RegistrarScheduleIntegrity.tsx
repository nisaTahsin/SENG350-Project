import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GenericPage from '../../GenericPage';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface RoomUtilization {
  room_name: string;
  bookings: number;
  capacity: number;
  utilizationRate: number;
  avgFill: number;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  rooms: {
    roomName: string;
    totalBookings: number;
    capacity: number;
    avgFill: string | number;
  }[];
}

const RegistrarScheduleIntegrity: React.FC = () => {
  const [data, setData] = useState<RoomUtilization[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse>("http://localhost:4000/analytics/schedule-integrity");
        if (response.data.success) {
          const chartData: RoomUtilization[] = response.data.rooms.map((room) => ({
            room_name: room.roomName,
            bookings: room.totalBookings,
            capacity: room.capacity,
            utilizationRate: Number(room.avgFill),
            avgFill: Number(room.avgFill),
          }));
          setData(chartData);
        } else {
          setError(response.data.message || "Failed to load data");
        }
      } catch (err: any) {
        setError(err.message || "Server error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <GenericPage
      title="Schedule Integrity"
      description="Room utilization metrics and schedule integrity overview"
      userType="registrar"
    >
      {loading ? (
        <p>Loading room utilization data...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : data.length === 0 ? (
        <p>No room utilization data available.</p>
      ) : (
        <>
          <div style={{ width: "100%", height: 360, marginBottom: "1.5rem" }}>
            <ResponsiveContainer>
              <BarChart data={data} margin={{ top: 5, right: 25, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="room_name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" name="Booking Count" fill="#0a4a7e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.9rem",
            }}
          >
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "6px" }}>Room</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "6px" }}>Capacity</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "6px" }}>Bookings</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "6px" }}>Avg Fill (%)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((room) => (
                <tr key={room.room_name}>
                  <td style={{ borderBottom: "1px solid #eee", padding: "6px" }}>{room.room_name}</td>
                  <td style={{ borderBottom: "1px solid #eee", padding: "6px" }}>{room.capacity}</td>
                  <td style={{ borderBottom: "1px solid #eee", padding: "6px" }}>{room.bookings}</td>
                  <td style={{ borderBottom: "1px solid #eee", padding: "6px" }}>{room.avgFill}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </GenericPage>
  );
};

export default RegistrarScheduleIntegrity;
