"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../src/contexts/AuthContext");
const Login_1 = __importDefault(require("../src/components/Login"));
describe('Login', () => {
    it('renders login form', () => {
        (0, react_2.render)((0, jsx_runtime_1.jsx)(AuthContext_1.AuthProvider, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { initialEntries: ['/login'], children: (0, jsx_runtime_1.jsx)(Login_1.default, {}) }) }));
        // Matches your actual heading and controls
        expect(react_2.screen.getByRole('heading', { name: /welcome! please login/i })).toBeInTheDocument();
        expect(react_2.screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(react_2.screen.getByLabelText(/user type/i)).toBeInTheDocument();
        // The button is "Login" (not "Sign in")
        expect(react_2.screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });
});
//# sourceMappingURL=Login.test.js.map