import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserType } from '../contexts/AuthContext';
import './Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('staff');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    if (username.trim() && password.trim()) {
      try {
        await login(username.trim(), userType, password.trim());
        
        // Navigate to appropriate dashboard based on user type
        switch (userType) {
          case 'staff':
            navigate('/staff-dashboard');
            break;
          case 'registrar':
            navigate('/registrar-dashboard');
            break;
          case 'admin':
            navigate('/admin-dashboard');
            break;
          default:
            navigate('/login');
        }
      } catch (err) {
        console.error('Login error:', err);
        setError(err instanceof Error ? err.message : 'Login failed');
      }
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="page-title">UVIC Classroom Booking Page</h1>
          <h2>Welcome! Please Login</h2>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="userType">User Type:</label>
            <select
              id="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value as UserType)}
            >
              <option value="staff">Staff</option>
              <option value="registrar">Registrar</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          {error && (
            <div className="error-message" style={{ 
              color: 'red', 
              marginTop: '10px', 
              padding: '10px', 
              backgroundColor: '#ffe6e6', 
              border: '1px solid #ffcccc', 
              borderRadius: '4px' 
            }}>
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
