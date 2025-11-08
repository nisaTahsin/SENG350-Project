"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
// tests/TimeslotTable.test.tsx
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
const TimeslotTable_1 = __importDefault(require("../src/components/TimeslotTable"));
test('TimeslotTable renders bookings including multi-slot rowSpan cells', () => {
    const times = ['09:00', '09:30', '10:00'];
    const rooms = ['Room A', 'Room B'];
    const bookings = {
        'Room A': {
            '09:00': { label: 'Reserved A1', span: 2 },
            '10:00': 'Reserved A3',
        },
        'Room B': {
            '09:30': 'Reserved B2',
        },
    };
    (0, react_2.render)((0, jsx_runtime_1.jsx)(TimeslotTable_1.default, { times: times, rooms: rooms, bookings: bookings }));
    const multi = react_2.screen.getByText('Reserved A1');
    expect(multi).toBeInTheDocument();
    expect(multi.closest('td')).toHaveAttribute('rowspan', '2');
    expect(react_2.screen.getByText('Reserved A3')).toBeInTheDocument();
    expect(react_2.screen.getByText('Reserved B2')).toBeInTheDocument();
});
//# sourceMappingURL=TimeslotTable.test.js.map