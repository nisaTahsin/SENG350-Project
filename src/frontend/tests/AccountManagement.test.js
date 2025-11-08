"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
const user_event_1 = __importDefault(require("@testing-library/user-event"));
const react_router_dom_1 = require("react-router-dom");
const AccountManagement_1 = __importDefault(require("../src/components/AccountManagement"));
describe('AccountManagement', () => {
    it('opens Change Permissions modal and shows controls', async () => {
        (0, react_2.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(AccountManagement_1.default, {}) }));
        // Open the modal (pick the first "Change Permissions" action)
        const openBtns = react_2.screen.getAllByRole('button', { name: /change permissions/i });
        await user_event_1.default.click(openBtns[0]);
        // Scope queries to the modal contents
        const heading = await react_2.screen.findByRole('heading', { name: /change permissions/i });
        const modal = heading.closest('div') ?? document.body;
        const utils = (0, react_2.within)(modal);
        // Don’t rely on label association; assert by roles present in your DOM
        expect(utils.getByRole('combobox')).toBeInTheDocument(); // the <select>
        expect(utils.getByRole('checkbox')).toBeInTheDocument(); // the "Disabled" toggle
        expect(utils.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });
});
//# sourceMappingURL=AccountManagement.test.js.map