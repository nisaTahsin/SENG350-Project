"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
const react_router_dom_1 = require("react-router-dom");
const StaffBrowseAvailability_1 = __importDefault(require("../src/components/pages/StaffBrowseAvailability"));
const StaffMyBookings_1 = __importDefault(require("../src/components/pages/StaffMyBookings"));
const StaffBookingHistory_1 = __importDefault(require("../src/components/pages/StaffBookingHistory"));
describe("Staff Pages", () => {
    it("renders Browse Availability", () => {
        (0, react_2.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(StaffBrowseAvailability_1.default, {}) }));
        expect(react_2.screen.getByRole("heading", { name: /browse/i })).toBeInTheDocument();
    });
    it("renders My Bookings", () => {
        (0, react_2.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(StaffMyBookings_1.default, {}) }));
        expect(react_2.screen.getByRole("heading", { name: /bookings/i })).toBeInTheDocument();
    });
    it("renders Booking History", () => {
        (0, react_2.render)((0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { children: (0, jsx_runtime_1.jsx)(StaffBookingHistory_1.default, {}) }));
        expect(react_2.screen.getByRole("heading", { name: /history/i })).toBeInTheDocument();
    });
});
//# sourceMappingURL=Staffpages.test.js.map