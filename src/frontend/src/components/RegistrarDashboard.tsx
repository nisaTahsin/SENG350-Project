import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const RegistrarDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
          <button className="action-button" onClick={() => navigate('/registrar/classroom-management')}>Manage Classrooms</button>
        </div>
        
        <div className="dashboard-card">
          <h2>Time Slot Management</h2>
          <p>Configure available time slots and scheduling rules</p>
          <button className="action-button" onClick={() => navigate('/registrar/time-slot-management')}>Manage Time Slots</button>
        </div>
        
        <div className="dashboard-card">
          <h2>Handle Escalations</h2>
          <p>Review and resolve booking conflicts and issues</p>
          <button className="action-button" onClick={() => navigate('/registrar/escalations')}>View Escalations</button>
        </div>
        
        <div className="dashboard-card">
          <h2>Account Management</h2>
          <p>Block abusive accounts or manually release bookings</p>
          <button className="action-button" onClick={() => navigate('/registrar/account-management')}>Manage Accounts</button>
        </div>
        
        <div className="dashboard-card">
          <h2>Statistics & System Logs</h2>
          <p>View booking statistics, generate reports, and monitor system activity</p>
          <button className="action-button" onClick={() => navigate('/registrar/statistics-logs')}>View Statistics & Logs</button>
        </div>
      </main>
    </div>
  );
};

export default RegistrarDashboard;
