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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
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
const UserBookings = ({ userName, onClose }) => {
    const [expandedIds, setExpandedIds] = (0, react_1.useState)(new Set());
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
    return ((0, jsx_runtime_1.jsx)("div", { style: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }, children: (0, jsx_runtime_1.jsxs)("div", { style: { background: 'white', borderRadius: 10, padding: 32, minWidth: 400, maxWidth: 600, boxShadow: '0 2px 10px rgba(0,0,0,0.2)', maxHeight: '80vh', overflowY: 'auto' }, children: [(0, jsx_runtime_1.jsxs)("h2", { style: { marginTop: 0 }, children: ["Bookings for ", userName] }), (0, jsx_runtime_1.jsx)("ul", { style: { listStyle: 'none', padding: 0, margin: 0 }, children: mockBookings.map((b) => ((0, jsx_runtime_1.jsxs)("li", { style: {
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
                                }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: 6 }, children: [(0, jsx_runtime_1.jsx)("strong", { children: "Capacity:" }), ' ', roomDetails[b.room]?.capacity ?? 'N/A'] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: 6 }, children: [(0, jsx_runtime_1.jsx)("strong", { children: "AV Equipment:" }), ' ', (0, jsx_runtime_1.jsx)("span", { style: { color: '#444' }, children: roomDetails[b.room]?.av ?? 'N/A' })] }), roomDetails[b.room]?.url && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "More info:" }), ' ', (0, jsx_runtime_1.jsx)("a", { href: roomDetails[b.room].url, target: "_blank", rel: "noreferrer", children: "View room details (uvic.ca)" })] }))] }))] }, b.id))) }), (0, jsx_runtime_1.jsx)("div", { style: { textAlign: 'right', marginTop: 16 }, children: (0, jsx_runtime_1.jsx)("button", { onClick: onClose, style: { padding: '8px 20px', borderRadius: 6, background: '#2257bf', color: 'white', border: 'none' }, children: "Close" }) })] }) }));
};
exports.default = UserBookings;
//# sourceMappingURL=UserBookings.js.map