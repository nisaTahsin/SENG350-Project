import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserType } from '../contexts/AuthContext';
import './Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState<UserType>('staff');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim(), userType);
      
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
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome! Please Login</h2>
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
          
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
