import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const StaffDashboard: React.FC = () => {
  const { user, logout } = useAuth();

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
          <button className="action-button">Browse Availability</button>
        </div>
        
        <div className="dashboard-card">
          <h2>Create Booking</h2>
          <p>Book a classroom for your meeting or event</p>
          <button className="action-button">Create New Booking</button>
        </div>
        
        <div className="dashboard-card">
          <h2>My Bookings</h2>
          <p>View and manage your current bookings</p>
          <button className="action-button">View My Bookings</button>
        </div>
        
        <div className="dashboard-card">
          <h2>Cancel Booking</h2>
          <p>Cancel or modify your existing bookings</p>
          <button className="action-button">Manage Bookings</button>
        </div>
        
        <div className="dashboard-card">
          <h2>Booking History</h2>
          <p>View your past booking history and records</p>
          <button className="action-button">View History</button>
        </div>
        
        <div className="dashboard-card">
          <h2>Quick Book</h2>
          <p>Quickly book a room for immediate use</p>
          <button className="action-button">Quick Book</button>
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;
