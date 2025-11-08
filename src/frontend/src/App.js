"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("./contexts/AuthContext");
const Login_1 = __importDefault(require("./components/Login"));
const StaffDashboard_1 = __importDefault(require("./components/StaffDashboard"));
const RegistrarDashboard_1 = __importDefault(require("./components/RegistrarDashboard"));
const AdminDashboard_1 = __importDefault(require("./components/AdminDashboard"));
const ProtectedRoute_1 = __importDefault(require("./components/ProtectedRoute"));
// Staff pages
const StaffBrowseAvailability_1 = __importDefault(require("./components/pages/StaffBrowseAvailability"));
const StaffMyBookings_1 = __importDefault(require("./components/pages/StaffMyBookings"));
const StaffBookingHistory_1 = __importDefault(require("./components/pages/StaffBookingHistory"));
// Registrar pages
const RegistrarClassroomManagement_1 = __importDefault(require("./components/pages/RegistrarClassroomManagement"));
const RegistrarTimeSlotManagement_1 = __importDefault(require("./components/pages/RegistrarTimeSlotManagement"));
const RegistrarEscalations_1 = __importDefault(require("./components/pages/RegistrarEscalations"));
const RegistrarAccountManagement_1 = __importDefault(require("./components/pages/RegistrarAccountManagement"));
const RegistrarStatisticsLogs_1 = __importDefault(require("./components/pages/RegistrarStatisticsLogs"));
// Admin pages
const AdminSystemConfig_1 = __importDefault(require("./components/pages/AdminSystemConfig"));
const AdminAuditRecords_1 = __importDefault(require("./components/pages/AdminAuditRecords"));
const AdminSystemHealth_1 = __importDefault(require("./components/pages/AdminSystemHealth"));
const AdminPermissions_1 = __importDefault(require("./components/pages/AdminPermissions"));
const AdminDatabase_1 = __importDefault(require("./components/pages/AdminDatabase"));
const AdminMonitoring_1 = __importDefault(require("./components/pages/AdminMonitoring"));
require("./App.css");
const AppContent = () => {
    const { user, isAuthenticated } = (0, AuthContext_1.useAuth)();
    // Redirect to appropriate dashboard based on user type
    const getDashboardRoute = () => {
        if (!isAuthenticated || !user)
            return '/login';
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
    return ((0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: (0, jsx_runtime_1.jsx)("div", { className: "App", children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/login", element: (0, jsx_runtime_1.jsx)(Login_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/staff-dashboard", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { children: (0, jsx_runtime_1.jsx)(StaffDashboard_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/registrar-dashboard", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { children: (0, jsx_runtime_1.jsx)(RegistrarDashboard_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/admin-dashboard", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { children: (0, jsx_runtime_1.jsx)(AdminDashboard_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/staff/browse-availability", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { children: (0, jsx_runtime_1.jsx)(StaffBrowseAvailability_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/staff/my-bookings", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { children: (0, jsx_runtime_1.jsx)(StaffMyBookings_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/staff/booking-history", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { children: (0, jsx_runtime_1.jsx)(StaffBookingHistory_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/registrar/classroom-management", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { children: (0, jsx_runtime_1.jsx)(RegistrarClassroomManagement_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/registrar/time-slot-management", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { children: (0, jsx_runtime_1.jsx)(RegistrarTimeSlotManagement_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/registrar/escalations", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { children: (0, jsx_runtime_1.jsx)(RegistrarEscalations_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/registrar/account-management", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { children: (0, jsx_runtime_1.jsx)(RegistrarAccountManagement_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/registrar/statistics-logs", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { children: (0, jsx_runtime_1.jsx)(RegistrarStatisticsLogs_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/admin/system-config", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { children: (0, jsx_runtime_1.jsx)(AdminSystemConfig_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/admin/audit-records", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { children: (0, jsx_runtime_1.jsx)(AdminAuditRecords_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/admin/system-health", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { children: (0, jsx_runtime_1.jsx)(AdminSystemHealth_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/admin/permissions", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { children: (0, jsx_runtime_1.jsx)(AdminPermissions_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/admin/database", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { children: (0, jsx_runtime_1.jsx)(AdminDatabase_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/admin/monitoring", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { children: (0, jsx_runtime_1.jsx)(AdminMonitoring_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/", element: (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: getDashboardRoute(), replace: true }) })] }) }) }));
};
function App() {
    return ((0, jsx_runtime_1.jsx)(AuthContext_1.AuthProvider, { children: (0, jsx_runtime_1.jsx)(AppContent, {}) }));
}
exports.default = App;
//# sourceMappingURL=App.js.map