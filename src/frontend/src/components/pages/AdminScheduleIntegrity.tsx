import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

interface RoomUtilization {
  room_name: string;
  bookings: number;
  capacity: number;
  utilizationRate: number;
  avgFill: number;
}

// Expected API response format
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

const AdminScheduleIntegrity: React.FC = () => {
  const [data, setData] = useState<RoomUtilization[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        
        const response = await axios.get<ApiResponse>("http://localhost:4000/analytics/schedule-integrity");


        if (response.data.success) {
          const chartData: RoomUtilization[] = response.data.rooms.map((room: ApiResponse["rooms"][number]) => ({
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
    <div style={{ padding: "2rem" }}>
      <h1>Room Utilization & Schedule Integrity</h1>

      {loading ? (
        <p>Loading room utilization data...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : data.length === 0 ? (
        <p>No room utilization data available.</p>
      ) : (
        <>
          {/* Chart Section */}
          <div style={{ width: "100%", height: 400, marginBottom: "2rem" }}>
            <ResponsiveContainer>
              <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="room_name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" name="Booking Count" fill="#0a4a7e" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table Section */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "1rem",
              fontSize: "0.95rem",
            }}
          >
            <thead>
              <tr>
                <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>Room</th>
                <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>Capacity</th>
                <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>Bookings</th>
                <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>Avg Fill (%)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((room) => (
                <tr key={room.room_name}>
                  <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                    {room.room_name}
                  </td>
                  <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                    {room.capacity}
                  </td>
                  <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                    {room.bookings}
                  </td>
                  <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                    {room.avgFill}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminScheduleIntegrity;
