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
const pastBookings = [
    {
        id: 'h1',
        title: 'Guest Lecture',
        building: 'Elliot Building',
        room: 'ELL 060 – Classroom',
        date: '2025-09-12',
        startTime: '9:00 AM',
        endTime: '10:30 AM',
    },
    {
        id: 'h2',
        title: 'TA Meeting',
        building: 'Elliot Building',
        room: 'ELL 162 – Classroom',
        date: '2025-09-18',
        startTime: '2:00 PM',
        endTime: '3:00 PM',
    },
    {
        id: 'h3',
        title: 'Practice Session',
        building: 'Maclaurin Building',
        room: 'MAC D116 – Classroom',
        date: '2025-08-29',
        startTime: '11:00 AM',
        endTime: '12:00 PM',
    },
];
// Minimal room details derived from backend/uvic_rooms.csv for known rooms
const roomDetails = {
    'ELL 060 – Classroom': {
        capacity: 68,
        av: '1 digital video projector; 1 document camera; A built-in classroom computer with webcam; Lecture capture capability; Podium; Room speakers; Video and audio laptop connectors (HDMI, VGA, 3.5mm audio); Wireless mic',
        url: 'https://www.uvic.ca/search/rooms/pages/ell-060-classroom.php',
    },
    'ELL 162 – Classroom': {
        capacity: 54,
        av: '1 digital video projector; 1 document camera; A built-in classroom computer with webcam; Lecture capture capability; Podium; Room speakers; Video and audio laptop connectors (HDMI, VGA, 3.5mm audio); Wireless mic',
        url: 'https://www.uvic.ca/search/rooms/pages/ell-162-classroom.php',
    },
    'MAC D116 – Classroom': {
        capacity: 59,
        av: '1 digital video projector; 1 document camera; A built-in classroom computer with webcam; Lecture capture capability; Room speakers; Video and audio laptop connectors (HDMI, VGA, 3.5mm audio); Wireless mic',
        url: 'https://www.uvic.ca/search/rooms/pages/mac-d116-classroom.php',
    },
};
const StaffBookingHistory = () => {
    const buildings = (0, react_1.useMemo)(() => Array.from(new Set(pastBookings.map((b) => b.building))), []);
    const [selectedBuilding, setSelectedBuilding] = (0, react_1.useState)('');
    const [selectedDate, setSelectedDate] = (0, react_1.useState)('');
    const roomsForBuilding = (0, react_1.useMemo)(() => {
        if (!selectedBuilding)
            return [];
        return Array.from(new Set(pastBookings
            .filter((b) => b.building === selectedBuilding)
            .map((b) => b.room)));
    }, [selectedBuilding]);
    const [selectedRoom, setSelectedRoom] = (0, react_1.useState)('');
    const [expandedIds, setExpandedIds] = (0, react_1.useState)(new Set());
    const filtered = (0, react_1.useMemo)(() => {
        return pastBookings.filter((b) => {
            if (selectedBuilding && b.building !== selectedBuilding)
                return false;
            if (selectedRoom && b.room !== selectedRoom)
                return false;
            if (selectedDate && b.date !== selectedDate)
                return false;
            return true;
        });
    }, [selectedBuilding, selectedRoom, selectedDate]);
    const toggleExpanded = (id) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id))
                next.delete(id);
            else
                next.add(id);
            return next;
        });
    };
    return ((0, jsx_runtime_1.jsxs)(GenericPage_1.default, { title: "Booking History", description: "View your past booking history and records", userType: "staff", children: [(0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 16, marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }, children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "date-filter", style: { fontWeight: 'bold', marginRight: 8 }, children: "Date:" }), (0, jsx_runtime_1.jsx)("input", { id: "date-filter", type: "date", value: selectedDate, onChange: e => setSelectedDate(e.target.value), style: { padding: '4px 8px', fontSize: '1rem', marginRight: 8 } })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "hist-building", style: { fontWeight: 'bold', marginRight: 8 }, children: "Building:" }), (0, jsx_runtime_1.jsxs)("select", { id: "hist-building", value: selectedBuilding, onChange: (e) => {
                                    setSelectedBuilding(e.target.value);
                                    setSelectedRoom('');
                                }, style: { padding: '4px 8px', fontSize: '1rem' }, children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "All" }), buildings.map((b) => ((0, jsx_runtime_1.jsx)("option", { value: b, children: b }, b)))] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "hist-room", style: { fontWeight: 'bold', marginRight: 8 }, children: "Classroom:" }), (0, jsx_runtime_1.jsxs)("select", { id: "hist-room", value: selectedRoom, onChange: (e) => setSelectedRoom(e.target.value), disabled: !selectedBuilding, style: { padding: '4px 8px', fontSize: '1rem' }, children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "All" }), roomsForBuilding.map((r) => ((0, jsx_runtime_1.jsx)("option", { value: r, children: r }, r)))] })] })] }), (0, jsx_runtime_1.jsx)("ul", { style: { listStyle: 'none', padding: 0, margin: 0 }, children: filtered.map((b) => ((0, jsx_runtime_1.jsxs)("li", { style: {
                        border: '1px solid #ddd',
                        borderRadius: 8,
                        padding: '12px 16px',
                        marginBottom: 12,
                        background: '#fff',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }, children: [(0, jsx_runtime_1.jsx)("h3", { style: { margin: 0 }, children: b.title }), (0, jsx_runtime_1.jsx)("span", { style: { color: '#555' }, children: b.date })] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 6, color: '#333' }, children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Location:" }), " ", b.building, " \u2014 ", b.room] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Time:" }), " ", b.startTime, " \u2013 ", b.endTime] })] }), (0, jsx_runtime_1.jsx)("div", { style: { marginTop: 10, display: 'flex', gap: 8 }, children: (0, jsx_runtime_1.jsx)("button", { type: "button", style: {
                                    padding: '6px 10px',
                                    borderRadius: 6,
                                    border: '1px solid #bbb',
                                    background: '#f7f7f7',
                                    cursor: 'pointer',
                                }, onClick: () => toggleExpanded(b.id), children: expandedIds.has(b.id) ? 'Hide details' : 'Details' }) }), expandedIds.has(b.id) && ((0, jsx_runtime_1.jsxs)("div", { style: {
                                marginTop: 12,
                                padding: '10px 12px',
                                background: '#fafafa',
                                border: '1px solid #eee',
                                borderRadius: 6,
                            }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: 6 }, children: [(0, jsx_runtime_1.jsx)("strong", { children: "Capacity:" }), ' ', roomDetails[b.room]?.capacity ?? 'N/A'] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: 6 }, children: [(0, jsx_runtime_1.jsx)("strong", { children: "AV Equipment:" }), ' ', (0, jsx_runtime_1.jsx)("span", { style: { color: '#444' }, children: roomDetails[b.room]?.av ?? 'N/A' })] }), roomDetails[b.room]?.url && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "More info:" }), ' ', (0, jsx_runtime_1.jsx)("a", { href: roomDetails[b.room].url, target: "_blank", rel: "noreferrer", children: "View room details (uvic.ca)" })] }))] }))] }, b.id))) })] }));
};
exports.default = StaffBookingHistory;
//# sourceMappingURL=StaffBookingHistory.js.map