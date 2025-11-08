import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminAIBooking from './pages/AdminAIBooking';

<Route path="/admin/ai-agent" element={<ProtectedRoute><AdminAIBooking /></ProtectedRoute>} />
<Route path="/registrar/ai-agent" element={<ProtectedRoute><AdminAIBooking /></ProtectedRoute>} />
<Route path="/staff/ai-agent" element={<ProtectedRoute><AdminAIBooking /></ProtectedRoute>} />

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
