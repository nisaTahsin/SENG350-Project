import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const RegistrarDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Registrar Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.username}!</span>
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      </header>
      
      <main className="dashboard-content">
        <div className="dashboard-card">
          <h2>Classroom Management</h2>
          <p>Add, edit, or remove classroom information and settings</p>
          <button className="action-button">Manage Classrooms</button>
        </div>
        
        <div className="dashboard-card">
          <h2>Time Slot Management</h2>
          <p>Configure available time slots and scheduling rules</p>
          <button className="action-button">Manage Time Slots</button>
        </div>
        
        <div className="dashboard-card">
          <h2>Handle Escalations</h2>
          <p>Review and resolve booking conflicts and issues</p>
          <button className="action-button">View Escalations</button>
        </div>
        
        <div className="dashboard-card">
          <h2>Account Management</h2>
          <p>Block abusive accounts or manually release bookings</p>
          <button className="action-button">Manage Accounts</button>
        </div>
        
        <div className="dashboard-card">
          <h2>Statistics & Reports</h2>
          <p>View booking statistics and generate reports</p>
          <button className="action-button">View Statistics</button>
        </div>
        
        <div className="dashboard-card">
          <h2>System Logs</h2>
          <p>Monitor system activity and booking logs</p>
          <button className="action-button">View Logs</button>
        </div>
        
        <div className="dashboard-card">
          <h2>Schedule Integrity</h2>
          <p>Ensure schedule consistency and resolve conflicts</p>
          <button className="action-button">Manage Schedule</button>
        </div>
      </main>
    </div>
  );
};

export default RegistrarDashboard;
