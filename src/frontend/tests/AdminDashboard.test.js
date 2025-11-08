"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
const react_router_dom_1 = require("react-router-dom");
const AdminDashboard_1 = __importDefault(require("../src/components/AdminDashboard"));
// Minimal auth stub so component can show greeting/logout without full app wiring
vi.mock('../src/contexts/AuthContext', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useAuth: () => ({ user: { username: 'Admin' }, logout: vi.fn() }),
        AuthProvider: ({ children }) => (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children }),
    };
});
describe('AdminDashboard', () => {
    it('renders the visible cards and their buttons', () => {
        (0, react_2.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(AdminDashboard_1.default, {}) }));
        // Headings visible in your DOM
        expect(react_2.screen.getByText(/system configuration/i)).toBeInTheDocument();
        expect(react_2.screen.getByText(/audit records/i)).toBeInTheDocument();
        expect(react_2.screen.getByText(/system health/i)).toBeInTheDocument();
        expect(react_2.screen.getByText(/user roles & permissions/i)).toBeInTheDocument();
        // Actual button labels in your DOM
        expect(react_2.screen.getByRole('button', { name: /system config/i })).toBeInTheDocument();
        expect(react_2.screen.getByRole('button', { name: /view audit records/i })).toBeInTheDocument();
        expect(react_2.screen.getByRole('button', { name: /system health/i })).toBeInTheDocument();
        expect(react_2.screen.getByRole('button', { name: /manage permissions/i })).toBeInTheDocument();
    });
});
//# sourceMappingURL=AdminDashboard.test.js.map