"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
const AuthContext_1 = require("../src/contexts/AuthContext");
function Probe() {
    const { isAuthenticated, user, login, logout } = (0, AuthContext_1.useAuth)();
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { "data-testid": "auth", children: String(isAuthenticated) }), (0, jsx_runtime_1.jsx)("div", { "data-testid": "user", children: user ? `${user.username}:${user.userType}` : 'none' }), (0, jsx_runtime_1.jsx)("button", { onClick: () => login('bob', 'registrar'), children: "login" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => logout(), children: "logout" })] }));
}
describe('AuthContext', () => {
    it('logs in and out correctly', async () => {
        (0, react_2.render)((0, jsx_runtime_1.jsx)(AuthContext_1.AuthProvider, { children: (0, jsx_runtime_1.jsx)(Probe, {}) }));
        expect(react_2.screen.getByTestId('auth')).toHaveTextContent('false');
        react_2.screen.getByText('login').click();
        await (0, react_2.waitFor)(() => expect(react_2.screen.getByTestId('auth')).toHaveTextContent('true'));
        expect(react_2.screen.getByTestId('user')).toHaveTextContent('bob:registrar');
        react_2.screen.getByText('logout').click();
        await (0, react_2.waitFor)(() => expect(react_2.screen.getByTestId('auth')).toHaveTextContent('false'));
    });
});
//# sourceMappingURL=AuthContext.test.js.map