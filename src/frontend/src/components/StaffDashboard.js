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
const StaffDashboard = () => {
    const { user, logout } = (0, AuthContext_1.useAuth)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    return ((0, jsx_runtime_1.jsxs)("div", { className: "dashboard", children: [(0, jsx_runtime_1.jsxs)("header", { className: "dashboard-header", children: [(0, jsx_runtime_1.jsx)("h1", { children: "Staff Dashboard" }), (0, jsx_runtime_1.jsxs)("div", { className: "user-info", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Welcome, ", user?.username, "!"] }), (0, jsx_runtime_1.jsx)("button", { onClick: logout, className: "logout-button", children: "Logout" })] })] }), (0, jsx_runtime_1.jsxs)("main", { className: "dashboard-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "dashboard-card", children: [(0, jsx_runtime_1.jsx)("h2", { children: "Browse Availability" }), (0, jsx_runtime_1.jsx)("p", { children: "View available classrooms and time slots for booking" }), (0, jsx_runtime_1.jsx)("button", { className: "action-button", onClick: () => navigate('/staff/browse-availability'), children: "Browse Availability" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "dashboard-card", children: [(0, jsx_runtime_1.jsx)("h2", { children: "My Bookings" }), (0, jsx_runtime_1.jsx)("p", { children: "View and manage your current bookings" }), (0, jsx_runtime_1.jsx)("button", { className: "action-button", onClick: () => navigate('/staff/my-bookings'), children: "View My Bookings" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "dashboard-card", children: [(0, jsx_runtime_1.jsx)("h2", { children: "Booking History" }), (0, jsx_runtime_1.jsx)("p", { children: "View your past booking history and records" }), (0, jsx_runtime_1.jsx)("button", { className: "action-button", onClick: () => navigate('/staff/booking-history'), children: "View History" })] })] })] }));
};
exports.default = StaffDashboard;
//# sourceMappingURL=StaffDashboard.js.map