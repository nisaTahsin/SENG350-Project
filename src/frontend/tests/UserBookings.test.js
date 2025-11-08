"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
const UserBookings_1 = __importDefault(require("../src/components/UserBookings"));
describe("UserBookings", () => {
    it("renders bookings list inside modal", () => {
        (0, react_2.render)((0, jsx_runtime_1.jsx)(UserBookings_1.default, { isOpen: true, onClose: () => { }, user: { id: "u1", name: "Test User" } }));
        // check heading instead of dialog role
        expect(react_2.screen.getByText(/bookings for/i)).toBeInTheDocument();
        expect(react_2.screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
    });
});
//# sourceMappingURL=UserBookings.test.js.map