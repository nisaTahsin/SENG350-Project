"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const react_2 = require("@testing-library/react");
const ProtectedRoute_1 = __importDefault(require("../src/components/ProtectedRoute"));
const AuthContext_1 = require("../src/contexts/AuthContext");
function Dummy() {
    return (0, jsx_runtime_1.jsx)("div", { children: "Private Page" });
}
describe("ProtectedRoute", () => {
    it("blocks unauthenticated user", () => {
        (0, react_2.render)((0, jsx_runtime_1.jsx)(AuthContext_1.AuthProvider, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { initialEntries: ["/private"], children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/private", element: (0, jsx_runtime_1.jsx)(ProtectedRoute_1.default, { element: (0, jsx_runtime_1.jsx)(Dummy, {}) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/login", element: (0, jsx_runtime_1.jsx)("div", { children: "Login Page" }) })] }) }) }));
        expect(react_2.screen.getByText(/login page/i)).toBeInTheDocument();
    });
});
//# sourceMappingURL=ProtectedRoute.test.js.map