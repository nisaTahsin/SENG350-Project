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
const mockBookings = [
    {
        id: 'b1',
        title: 'Project Sync',
        building: 'Elliot Building',
        room: 'ELL 060 – Classroom',
        date: '2025-10-02',
        startTime: '10:00 AM',
        endTime: '11:30 AM',
    },
    {
        id: 'b2',
        title: 'Workshop Prep',
        building: 'Maclaurin Building',
        room: 'MAC D116 – Classroom',
        date: '2025-10-03',
        startTime: '1:00 PM',
        endTime: '2:30 PM',
    },
];
const StaffMyBookings = () => {
    const [expandedIds, setExpandedIds] = (0, react_1.useState)(new Set());
    const [selectedDate, setSelectedDate] = (0, react_1.useState)('');
    // Minimal room details extracted from backend/uvic_rooms.csv
    const roomDetails = {
        'ELL 060 – Classroom': {
            capacity: 68,
            av: '1 digital video projector; 1 document camera; A built-in classroom computer with webcam; Lecture capture capability; Podium; Room speakers; Video and audio laptop connectors (HDMI, VGA, 3.5mm audio); Wireless mic',
            url: 'https://www.uvic.ca/search/rooms/pages/ell-060-classroom.php',
        },
        'MAC D116 – Classroom': {
            capacity: 59,
            av: '1 digital video projector; 1 document camera; A built-in classroom computer with webcam; Lecture capture capability; Room speakers; Video and audio laptop connectors (HDMI, VGA, 3.5mm audio); Wireless mic',
            url: 'https://www.uvic.ca/search/rooms/pages/mac-d116-classroom.php',
        },
    };
    const toggleExpanded = (id) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id))
                next.delete(id);
            else
                next.add(id);
            return next;
        });
    };
    // Filter bookings by selected date
    const filteredBookings = selectedDate
        ? mockBookings.filter(b => b.date === selectedDate)
        : mockBookings;
    return ((0, jsx_runtime_1.jsxs)(GenericPage_1.default, { title: "My Bookings", description: "View and manage your current bookings", userType: "staff", children: [(0, jsx_runtime_1.jsx)("div", { style: { marginTop: 16, marginBottom: 24, display: 'flex', gap: 24, alignItems: 'center' }, children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "date-filter", style: { fontWeight: 'bold', marginRight: 8 }, children: "Date:" }), (0, jsx_runtime_1.jsx)("input", { id: "date-filter", type: "date", value: selectedDate, onChange: e => setSelectedDate(e.target.value), style: { padding: '4px 8px', fontSize: '1rem', marginRight: 8 } })] }) }), (0, jsx_runtime_1.jsx)("div", { style: { marginTop: 16 }, children: (0, jsx_runtime_1.jsx)("ul", { style: { listStyle: 'none', padding: 0, margin: 0 }, children: filteredBookings.map((b) => ((0, jsx_runtime_1.jsxs)("li", { style: {
                            border: '1px solid #ddd',
                            borderRadius: 8,
                            padding: '12px 16px',
                            marginBottom: 12,
                            background: '#fff',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                        }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }, children: [(0, jsx_runtime_1.jsx)("h3", { style: { margin: 0 }, children: b.title }), (0, jsx_runtime_1.jsx)("span", { style: { color: '#555' }, children: b.date })] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 6, color: '#333' }, children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Location:" }), " ", b.building, " \u2014 ", b.room] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Time:" }), " ", b.startTime, " \u2013 ", b.endTime] })] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 10, display: 'flex', gap: 8 }, children: [(0, jsx_runtime_1.jsx)("button", { type: "button", style: {
                                            padding: '6px 10px',
                                            borderRadius: 6,
                                            border: '1px solid #bbb',
                                            background: '#f7f7f7',
                                            cursor: 'pointer',
                                        }, onClick: () => toggleExpanded(b.id), children: expandedIds.has(b.id) ? 'Hide details' : 'Details' }), (0, jsx_runtime_1.jsx)("button", { type: "button", style: {
                                            padding: '6px 10px',
                                            borderRadius: 6,
                                            border: '1px solid #c33',
                                            background: '#fbeaea',
                                            color: '#a11',
                                            cursor: 'pointer',
                                        }, onClick: () => {
                                            // Placeholder action
                                            alert(`Cancel booking: ${b.title}`);
                                        }, children: "Cancel" })] }), expandedIds.has(b.id) && ((0, jsx_runtime_1.jsxs)("div", { style: {
                                    marginTop: 12,
                                    padding: '10px 12px',
                                    background: '#fafafa',
                                    border: '1px solid #eee',
                                    borderRadius: 6,
                                }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: 6 }, children: [(0, jsx_runtime_1.jsx)("strong", { children: "Capacity:" }), ' ', roomDetails[b.room]?.capacity ?? 'N/A'] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: 6 }, children: [(0, jsx_runtime_1.jsx)("strong", { children: "AV Equipment:" }), ' ', (0, jsx_runtime_1.jsx)("span", { style: { color: '#444' }, children: roomDetails[b.room]?.av ?? 'N/A' })] }), roomDetails[b.room]?.url && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "More info:" }), ' ', (0, jsx_runtime_1.jsx)("a", { href: roomDetails[b.room].url, target: "_blank", rel: "noreferrer", children: "View room details (uvic.ca)" })] }))] }))] }, b.id))) }) })] }));
};
exports.default = StaffMyBookings;
//# sourceMappingURL=StaffMyBookings.js.map