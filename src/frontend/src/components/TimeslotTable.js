"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const TimeslotTable = ({ times, rooms, bookings }) => {
    const timeColStyle = {
        border: '1px solid #ccc',
        padding: '4px',
        width: '100px',
        minWidth: '100px',
        maxWidth: '100px',
        textAlign: 'center',
    };
    // Track which cells should be skipped due to rowspan
    const skipCell = {};
    rooms.forEach(room => {
        skipCell[room] = {};
    });
    return ((0, jsx_runtime_1.jsx)("div", { style: { maxWidth: '900px', overflowX: 'auto', margin: '0 auto' }, children: (0, jsx_runtime_1.jsxs)("table", { style: { width: '100%', borderCollapse: 'collapse' }, children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { style: { background: '#0a4a7e', color: 'white' }, children: [(0, jsx_runtime_1.jsx)("th", { style: { ...timeColStyle, border: 'none', padding: 12, textAlign: 'left', fontWeight: 'bold', fontSize: 14 }, children: "TIME" }), rooms.map(room => ((0, jsx_runtime_1.jsx)("th", { style: { border: 'none', padding: 12, whiteSpace: 'nowrap', textAlign: 'left', fontWeight: 'bold', fontSize: 14 }, children: room }, room)))] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: times.map((time, rowIdx) => ((0, jsx_runtime_1.jsxs)("tr", { style: { borderBottom: '1px solid #dee2e6' }, children: [(0, jsx_runtime_1.jsx)("td", { style: { ...timeColStyle, padding: 12, fontSize: 13, fontFamily: 'monospace', background: '#f8f9fa', textAlign: 'left' }, children: time }), rooms.map(room => {
                                if (skipCell[room][time])
                                    return null;
                                const booking = bookings[room]?.[time];
                                if (booking && typeof booking === 'object' && 'span' in booking && booking.span > 1) {
                                    for (let i = 1; i < booking.span; i++) {
                                        const nextTime = times[rowIdx + i];
                                        if (nextTime)
                                            skipCell[room][nextTime] = true;
                                    }
                                    return ((0, jsx_runtime_1.jsx)("td", { rowSpan: booking.span, style: { border: '1px solid #ccc', padding: 12, background: '#bcd', verticalAlign: 'middle', fontWeight: 'bold', fontSize: 13, textAlign: 'center' }, children: booking.label }, room));
                                }
                                if (typeof booking === 'string') {
                                    return ((0, jsx_runtime_1.jsx)("td", { style: { border: '1px solid #ccc', padding: 12, background: '#bcd', fontWeight: 'bold', fontSize: 13, textAlign: 'center' }, children: booking }, room));
                                }
                                return ((0, jsx_runtime_1.jsx)("td", { style: { border: '1px solid #ccc', padding: 12, background: '#fff', fontSize: 13, textAlign: 'center' } }, room));
                            })] }, time))) })] }) }));
};
exports.default = TimeslotTable;
//# sourceMappingURL=TimeslotTable.js.map