"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../contexts/AuthContext");
require("./Dashboard.css");
const RegistrarDashboard = () => {
    const { user, logout } = (0, AuthContext_1.useAuth)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    return ((0, jsx_runtime_1.jsxs)("div", { className: "dashboard", children: [(0, jsx_runtime_1.jsxs)("header", { className: "dashboard-header", children: [(0, jsx_runtime_1.jsx)("h1", { children: "Registrar Dashboard" }), (0, jsx_runtime_1.jsxs)("div", { className: "user-info", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Welcome, ", user?.username, "!"] }), (0, jsx_runtime_1.jsx)("button", { onClick: logout, className: "logout-button", children: "Logout" })] })] }), (0, jsx_runtime_1.jsxs)("main", { className: "dashboard-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "dashboard-card", children: [(0, jsx_runtime_1.jsx)("h2", { children: "Classroom & Time Slot Management" }), (0, jsx_runtime_1.jsx)("p", { children: "Edit classroom information and configure available time slots" }), (0, jsx_runtime_1.jsx)("button", { className: "action-button", onClick: () => navigate('/registrar/classroom-management'), children: "Manage Classrooms" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "dashboard-card", children: [(0, jsx_runtime_1.jsx)("h2", { children: "Handle Escalations" }), (0, jsx_runtime_1.jsx)("p", { children: "Review and resolve booking conflicts and issues" }), (0, jsx_runtime_1.jsx)("button", { className: "action-button", onClick: () => navigate('/registrar/escalations'), children: "View Escalations" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "dashboard-card", children: [(0, jsx_runtime_1.jsx)("h2", { children: "Account Management" }), (0, jsx_runtime_1.jsx)("p", { children: "Block abusive accounts or manually release bookings" }), (0, jsx_runtime_1.jsx)("button", { className: "action-button", onClick: () => navigate('/registrar/account-management'), children: "Manage Accounts" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "dashboard-card", children: [(0, jsx_runtime_1.jsx)("h2", { children: "Statistics & System Logs" }), (0, jsx_runtime_1.jsx)("p", { children: "View booking statistics, generate reports, and monitor system activity" }), (0, jsx_runtime_1.jsx)("button", { className: "action-button", onClick: () => navigate('/registrar/statistics-logs'), children: "View Statistics & Logs" })] })] })] }));
};
exports.default = RegistrarDashboard;
//# sourceMappingURL=RegistrarDashboard.js.map