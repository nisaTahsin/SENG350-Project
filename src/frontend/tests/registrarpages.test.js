"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
const react_router_dom_1 = require("react-router-dom");
const RegistrarClassroomManagement_1 = __importDefault(require("../src/components/pages/RegistrarClassroomManagement"));
const RegistrarEscalations_1 = __importDefault(require("../src/components/pages/RegistrarEscalations"));
const RegistrarStatisticsLogs_1 = __importDefault(require("../src/components/pages/RegistrarStatisticsLogs"));
const RegistrarTimeSlotManagement_1 = __importDefault(require("../src/components/pages/RegistrarTimeSlotManagement"));
describe('Registrar pages render correctly', () => {
    it('renders Classroom Management page', () => {
        (0, react_2.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(RegistrarClassroomManagement_1.default, {}) }));
        expect(react_2.screen.getByRole('heading')).toHaveTextContent(/classroom/i);
    });
    it('renders Escalations page', () => {
        (0, react_2.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(RegistrarEscalations_1.default, {}) }));
        expect(react_2.screen.getByRole('heading')).toHaveTextContent(/escalations/i);
    });
    it('renders Statistics & Logs page', () => {
        (0, react_2.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(RegistrarStatisticsLogs_1.default, {}) }));
        expect(react_2.screen.getByRole('heading')).toHaveTextContent(/statistics|logs/i);
    });
    it('renders Time Slot Management page', () => {
        (0, react_2.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(RegistrarTimeSlotManagement_1.default, {}) }));
        expect(react_2.screen.getByRole('heading')).toHaveTextContent(/time slot/i);
    });
});
//# sourceMappingURL=registrarpages.test.js.map