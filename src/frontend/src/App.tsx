import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import StaffDashboard from './components/StaffDashboard';
import RegistrarDashboard from './components/RegistrarDashboard';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const AppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  // Redirect to appropriate dashboard based on user type
  const getDashboardRoute = () => {
    if (!isAuthenticated || !user) return '/login';
    
    switch (user.userType) {
      case 'staff':
        return '/staff-dashboard';
      case 'registrar':
        return '/registrar-dashboard';
      case 'admin':
        return '/admin-dashboard';
      default:
        return '/login';
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/staff-dashboard" 
            element={
              <ProtectedRoute>
                <StaffDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/registrar-dashboard" 
            element={
              <ProtectedRoute>
                <RegistrarDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={<Navigate to={getDashboardRoute()} replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
