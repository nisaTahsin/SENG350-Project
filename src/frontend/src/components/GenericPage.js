"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
require("./GenericPage.css");
const GenericPage = ({ title, description, userType, children }) => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const getDashboardPath = () => {
        switch (userType) {
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
    return ((0, jsx_runtime_1.jsxs)("div", { className: "generic-page", children: [(0, jsx_runtime_1.jsxs)("header", { className: "page-header", children: [(0, jsx_runtime_1.jsx)("button", { className: "back-button", onClick: () => navigate(getDashboardPath()), children: "\u2190 Back to Dashboard" }), (0, jsx_runtime_1.jsx)("h1", { children: title })] }), (0, jsx_runtime_1.jsx)("main", { className: "page-content", children: (0, jsx_runtime_1.jsxs)("div", { className: "page-card", children: [(0, jsx_runtime_1.jsx)("p", { children: description }), children ? ((0, jsx_runtime_1.jsx)("div", { className: "custom-content", children: children })) : ((0, jsx_runtime_1.jsxs)("div", { className: "placeholder-content", children: [(0, jsx_runtime_1.jsx)("p", { children: "This page has been excluded from the scope of Implementation I." }), (0, jsx_runtime_1.jsx)("p", { children: "Content will be added here in future updates." })] }))] }) })] }));
};
exports.default = GenericPage;
//# sourceMappingURL=GenericPage.js.map