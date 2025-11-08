"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../contexts/AuthContext");
require("./Login.css");
const Login = () => {
    const [username, setUsername] = (0, react_1.useState)('');
    const [userType, setUserType] = (0, react_1.useState)('staff');
    const { login } = (0, AuthContext_1.useAuth)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            login(username.trim(), userType);
            // Navigate to appropriate dashboard based on user type
            switch (userType) {
                case 'staff':
                    navigate('/staff-dashboard');
                    break;
                case 'registrar':
                    navigate('/registrar-dashboard');
                    break;
                case 'admin':
                    navigate('/admin-dashboard');
                    break;
                default:
                    navigate('/login');
            }
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "login-container", children: (0, jsx_runtime_1.jsxs)("div", { className: "login-card", children: [(0, jsx_runtime_1.jsx)("h2", { children: "Welcome! Please Login" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "login-form", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "username", children: "Username:" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "username", value: username, onChange: (e) => setUsername(e.target.value), placeholder: "Enter your username", required: true })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "userType", children: "User Type:" }), (0, jsx_runtime_1.jsxs)("select", { id: "userType", value: userType, onChange: (e) => setUserType(e.target.value), children: [(0, jsx_runtime_1.jsx)("option", { value: "staff", children: "Staff" }), (0, jsx_runtime_1.jsx)("option", { value: "registrar", children: "Registrar" }), (0, jsx_runtime_1.jsx)("option", { value: "admin", children: "Admin" })] })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "login-button", children: "Login" })] })] }) }));
};
exports.default = Login;
//# sourceMappingURL=Login.js.map