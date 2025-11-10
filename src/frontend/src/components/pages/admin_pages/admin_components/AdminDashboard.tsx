import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import '../../../Dashboard.css';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.username}!</span>
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      </header>
      
      <main className="dashboard-content">
        <div className="dashboard-card">
          <h2>System Configuration</h2>
          <p>Configure system-level settings and parameters</p>
          <button
            className="action-button"
            onClick={() => navigate('/admin/system-config')}
          >
            System Config
          </button>
        </div>
        
        <div className="dashboard-card">
          <h2>Audit Records</h2>
          <p>View comprehensive audit trails and system records</p>
          <button
            className="action-button"
            onClick={() => navigate('/admin/audit-records')}
          >
            View Audit Records
          </button>
        </div>
        
        <div className="dashboard-card">
          <h2>System Health</h2>
          <p>Monitor system performance and health metrics</p>
          <button
            className="action-button"
            onClick={() => navigate('/admin/system-health')}
          >
            System Health
          </button>
        </div>

        {/* Schedule Integrity moved to Registrar dashboard */}

      </main>
    </div>
  );
};

export default AdminDashboard;
