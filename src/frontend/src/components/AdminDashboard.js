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
const AdminDashboard = () => {
    const { user, logout } = (0, AuthContext_1.useAuth)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    return ((0, jsx_runtime_1.jsxs)("div", { className: "dashboard", children: [(0, jsx_runtime_1.jsxs)("header", { className: "dashboard-header", children: [(0, jsx_runtime_1.jsx)("h1", { children: "Admin Dashboard" }), (0, jsx_runtime_1.jsxs)("div", { className: "user-info", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Welcome, ", user?.username, "!"] }), (0, jsx_runtime_1.jsx)("button", { onClick: logout, className: "logout-button", children: "Logout" })] })] }), (0, jsx_runtime_1.jsxs)("main", { className: "dashboard-content", children: [(0, jsx_runtime_1.jsxs)("div", { className: "dashboard-card", children: [(0, jsx_runtime_1.jsx)("h2", { children: "System Configuration" }), (0, jsx_runtime_1.jsx)("p", { children: "Configure system-level settings and parameters" }), (0, jsx_runtime_1.jsx)("button", { className: "action-button", onClick: () => navigate('/admin/system-config'), children: "System Config" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "dashboard-card", children: [(0, jsx_runtime_1.jsx)("h2", { children: "Audit Records" }), (0, jsx_runtime_1.jsx)("p", { children: "View comprehensive audit trails and system records" }), (0, jsx_runtime_1.jsx)("button", { className: "action-button", onClick: () => navigate('/admin/audit-records'), children: "View Audit Records" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "dashboard-card", children: [(0, jsx_runtime_1.jsx)("h2", { children: "System Health" }), (0, jsx_runtime_1.jsx)("p", { children: "Monitor system performance and health metrics" }), (0, jsx_runtime_1.jsx)("button", { className: "action-button", onClick: () => navigate('/admin/system-health'), children: "System Health" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "dashboard-card", children: [(0, jsx_runtime_1.jsx)("h2", { children: "User Roles & Permissions" }), (0, jsx_runtime_1.jsx)("p", { children: "Manage user roles and system permissions" }), (0, jsx_runtime_1.jsx)("button", { className: "action-button", onClick: () => navigate('/admin/permissions'), children: "Manage Permissions" })] })] })] }));
};
exports.default = AdminDashboard;
//# sourceMappingURL=AdminDashboard.js.map