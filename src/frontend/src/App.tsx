import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import BlockedAccount from './components/pages/staff_pages/staff_components/BlockedAccount';
import StaffDashboard from './components/pages/staff_pages/staff_components/StaffDashboard';
import RegistrarDashboard from './components/pages/registrar_pages/registrar_components/RegistrarDashboard';
import AdminDashboard from './components/pages/admin_pages/admin_components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';


// Staff pages
import StaffBrowseAvailability from './components/pages/staff_pages/StaffBrowseAvailability';
import StaffMyBookings from './components/pages/staff_pages/StaffMyBookings';

// Registrar pages
import RegistrarClassroomManagement from './components/pages/registrar_pages/RegistrarClassroomManagement';
import RegistrarTimeSlotManagement from './components/pages/registrar_pages/RegistrarTimeSlotManagement';
import RegistrarEscalations from './components/pages/registrar_pages/RegistrarEscalations';
import RegistrarAccountManagement from './components/pages/registrar_pages/RegistrarAccountManagement';
import RegistrarStatisticsLogs from './components/pages/registrar_pages/RegistrarStatisticsLogs';
import AdminScheduleIntegrity from './components/pages/registrar_pages/RegistrarScheduleIntegrity'; // reused for registrar route now

// Admin pages
import AdminSystemConfig from './components/pages/admin_pages/AdminSystemConfig';
import AdminAuditRecords from './components/pages/admin_pages/AdminAuditRecords';
import AdminSystemHealth from './components/pages/admin_pages/AdminSystemHealth';
import AdminDatabase from './components/pages/admin_pages/AdminDatabase';
import AdminMonitoring from './components/pages/admin_pages/AdminMonitoring';

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
          <Route path="/blocked-account" element={<BlockedAccount />} />
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
          {/* Registrar schedule integrity (moved from admin) */}
          <Route 
            path="/registrar/schedule-integrity" 
            element={
              <ProtectedRoute>
                <AdminScheduleIntegrity />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin routes (removed schedule-integrity now moved to registrar) */}
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
