"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
const react_router_dom_1 = require("react-router-dom");
// Adjust this path to match where your app imports GenericPage from.
// The mock makes the test independent of app wiring.
vi.mock('../src/components/GenericPage', () => ({
    default: ({ title }) => (0, jsx_runtime_1.jsx)("h1", { children: title }),
}));
const GenericPage_1 = __importDefault(require("../src/components/GenericPage"));
describe('GenericPage', () => {
    it('renders a generic page title', () => {
        (0, react_2.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(GenericPage_1.default, { title: "Hello" }) }));
        expect(react_2.screen.getByRole('heading', { name: /hello/i })).toBeInTheDocument();
    });
});
//# sourceMappingURL=genericPage.test.js.map