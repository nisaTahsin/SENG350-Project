"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../contexts/AuthContext");
const AdminAIBooking_1 = __importDefault(require("./pages/AdminAIBooking"));
(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/admin/ai-agent", element: (0, jsx_runtime_1.jsx)(ProtectedRoute, { children: (0, jsx_runtime_1.jsx)(AdminAIBooking_1.default, {}) }) })
    ,
        (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/registrar/ai-agent", element: (0, jsx_runtime_1.jsx)(ProtectedRoute, { children: (0, jsx_runtime_1.jsx)(AdminAIBooking_1.default, {}) }) })
            ,
                (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/staff/ai-agent", element: (0, jsx_runtime_1.jsx)(ProtectedRoute, { children: (0, jsx_runtime_1.jsx)(AdminAIBooking_1.default, {}) }) });
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = (0, AuthContext_1.useAuth)();
    return isAuthenticated ? (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children }) : (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/login", replace: true });
};
exports.default = ProtectedRoute;
//# sourceMappingURL=ProtectedRoute.js.map