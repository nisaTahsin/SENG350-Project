import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import StaffDashboard from './components/StaffDashboard';
import RegistrarDashboard from './components/RegistrarDashboard';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Staff pages
import StaffBrowseAvailability from './components/pages/StaffBrowseAvailability';
import StaffMyBookings from './components/pages/StaffMyBookings';
import StaffBookingHistory from './components/pages/StaffBookingHistory';

// Registrar pages
import RegistrarClassroomManagement from './components/pages/RegistrarClassroomManagement';
import RegistrarTimeSlotManagement from './components/pages/RegistrarTimeSlotManagement';
import RegistrarEscalations from './components/pages/RegistrarEscalations';
import RegistrarAccountManagement from './components/pages/RegistrarAccountManagement';
import RegistrarStatisticsLogs from './components/pages/RegistrarStatisticsLogs';

// Admin pages
import AdminSystemConfig from './components/pages/AdminSystemConfig';
import AdminAuditRecords from './components/pages/AdminAuditRecords';
import AdminSystemHealth from './components/pages/AdminSystemHealth';
import AdminPermissions from './components/pages/AdminPermissions';
import AdminDatabase from './components/pages/AdminDatabase';
import AdminMonitoring from './components/pages/AdminMonitoring';
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
          {/* Staff routes */}
          <Route 
            path="/staff/browse-availability" 
            element={
              <ProtectedRoute>
                <StaffBrowseAvailability />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/staff/my-bookings" 
            element={
              <ProtectedRoute>
                <StaffMyBookings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/staff/booking-history" 
            element={
              <ProtectedRoute>
                <StaffBookingHistory />
              </ProtectedRoute>
            } 
          />
          
          {/* Registrar routes */}
          <Route 
            path="/registrar/classroom-management" 
            element={
              <ProtectedRoute>
                <RegistrarClassroomManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/registrar/time-slot-management" 
            element={
              <ProtectedRoute>
                <RegistrarTimeSlotManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/registrar/escalations" 
            element={
              <ProtectedRoute>
                <RegistrarEscalations />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/registrar/account-management" 
            element={
              <ProtectedRoute>
                <RegistrarAccountManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/registrar/statistics-logs" 
            element={
              <ProtectedRoute>
                <RegistrarStatisticsLogs />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin routes */}
          <Route 
            path="/admin/system-config" 
            element={
              <ProtectedRoute>
                <AdminSystemConfig />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/audit-records" 
            element={
              <ProtectedRoute>
                <AdminAuditRecords />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/system-health" 
            element={
              <ProtectedRoute>
                <AdminSystemHealth />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/permissions" 
            element={
              <ProtectedRoute>
                <AdminPermissions />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/database" 
            element={
              <ProtectedRoute>
                <AdminDatabase />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/monitoring" 
            element={
              <ProtectedRoute>
                <AdminMonitoring />
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
