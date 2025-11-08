"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
const AdminSystemHealthTable_1 = __importDefault(require("../components/AdminSystemHealthTable"));
it('shows health status and metrics', () => {
    (0, react_2.render)((0, jsx_runtime_1.jsx)(AdminSystemHealthTable_1.default, {}));
    expect(react_2.screen.getByText(/last updated/i)).toBeInTheDocument();
    expect(react_2.screen.getByRole('heading', { name: /service uptime/i })).toBeInTheDocument();
    expect(react_2.screen.getByRole('heading', { name: /performance metrics/i })).toBeInTheDocument();
});
//# sourceMappingURL=AdminSystemHealthTable.js.map