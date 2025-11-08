"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const GenericPage_1 = __importDefault(require("../GenericPage"));
const TimeslotTable_1 = __importDefault(require("../TimeslotTable"));
const times = [
    '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM',
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM',
    '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM',
    '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM'
];
const buildingData = {
    'Elliot Building': {
        rooms: ['ELL 060 – Classroom', 'ELL 162 – Classroom', 'ELL 168 – Lecture theatre', 'ELL 167 – Lecture theatre'],
        bookings: {
            'ELL 060 – Classroom': {
                '10:00 AM': { label: 'Example Booking', span: 3 },
            },
        },
    },
    'Maclaurin Building': {
        rooms: ['MAC D116 – Classroom', 'MAC D115 – Classroom'],
        bookings: {},
    },
};
const buildings = [
    'Elliot Building',
    'Maclaurin Building',
];
const StaffBrowseAvailability = () => {
    const [selectedBuilding, setSelectedBuilding] = (0, react_1.useState)(buildings[0]);
    const [startTime, setStartTime] = (0, react_1.useState)('');
    const [endTime, setEndTime] = (0, react_1.useState)('');
    const [selectedDate, setSelectedDate] = (0, react_1.useState)('');
    const { rooms, bookings } = buildingData[selectedBuilding];
    // Filter rooms by availability in the selected time slot range
    let filteredRooms = rooms;
    let filteredBookings = bookings;
    if (startTime && endTime) {
        const startIdx = times.indexOf(startTime);
        const endIdx = times.indexOf(endTime);
        if (startIdx !== -1 && endIdx !== -1 && startIdx <= endIdx) {
            filteredRooms = rooms.filter(room => {
                for (let i = startIdx; i <= endIdx; i++) {
                    const t = times[i];
                    const booking = bookings[room]?.[t];
                    if (booking)
                        return false;
                }
                return true;
            });
            filteredBookings = {};
            filteredRooms.forEach(room => {
                filteredBookings[room] = bookings[room] || {};
            });
        }
    }
    else if (startTime || endTime) {
        // If only one is selected, treat as single slot filter
        const filterSlot = startTime || endTime;
        filteredRooms = rooms.filter(room => {
            const booking = bookings[room]?.[filterSlot];
            return !booking;
        });
        filteredBookings = {};
        filteredRooms.forEach(room => {
            filteredBookings[room] = bookings[room] || {};
        });
    }
    return ((0, jsx_runtime_1.jsxs)(GenericPage_1.default, { title: "Browse Availability", description: "View available classrooms and time slots for booking", userType: "staff", children: [(0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 16, marginBottom: 24, display: 'flex', gap: 24, alignItems: 'center' }, children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "date-filter", style: { fontWeight: 'bold', marginRight: 8 }, children: "Date:" }), (0, jsx_runtime_1.jsx)("input", { id: "date-filter", type: "date", value: selectedDate, onChange: e => setSelectedDate(e.target.value), style: { padding: '4px 8px', fontSize: '1rem', marginRight: 8 } })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "building-select", style: { fontWeight: 'bold', marginRight: 8 }, children: "Select Building:" }), (0, jsx_runtime_1.jsx)("select", { id: "building-select", value: selectedBuilding, onChange: e => setSelectedBuilding(e.target.value), style: { padding: '4px 8px', fontSize: '1rem' }, children: buildings.map(b => ((0, jsx_runtime_1.jsx)("option", { value: b, children: b }, b))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "start-time-filter", style: { fontWeight: 'bold', marginRight: 8 }, children: "Start Time:" }), (0, jsx_runtime_1.jsxs)("select", { id: "start-time-filter", value: startTime, onChange: e => setStartTime(e.target.value), style: { padding: '4px 8px', fontSize: '1rem', marginRight: 8 }, children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "Any" }), times.map(t => ((0, jsx_runtime_1.jsx)("option", { value: t, children: t }, t)))] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "end-time-filter", style: { fontWeight: 'bold', marginRight: 8 }, children: "End Time:" }), (0, jsx_runtime_1.jsxs)("select", { id: "end-time-filter", value: endTime, onChange: e => setEndTime(e.target.value), style: { padding: '4px 8px', fontSize: '1rem' }, children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "Any" }), times.map(t => ((0, jsx_runtime_1.jsx)("option", { value: t, children: t }, t)))] })] })] }), (0, jsx_runtime_1.jsx)("div", { style: { marginTop: 8 }, children: (0, jsx_runtime_1.jsx)(TimeslotTable_1.default, { times: times, rooms: filteredRooms, bookings: filteredBookings }) })] }));
};
exports.default = StaffBrowseAvailability;
//# sourceMappingURL=StaffBrowseAvailability.js.map