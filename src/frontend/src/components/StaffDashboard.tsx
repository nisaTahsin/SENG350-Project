import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const StaffDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Staff Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.username}!</span>
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      </header>
      
      <main className="dashboard-content">
        <div className="dashboard-card">
          <h2>Browse Availability</h2>
          <p>View available classrooms and time slots for booking</p>
          <button className="action-button" onClick={() => navigate('/staff/browse-availability')}>Browse Availability</button>
        </div>
        
        <div className="dashboard-card">
          <h2>My Bookings</h2>
          <p>View and manage your current bookings</p>
          <button className="action-button" onClick={() => navigate('/staff/my-bookings')}>View My Bookings</button>
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;
