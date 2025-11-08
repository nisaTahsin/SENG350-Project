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
exports.getNumericUserId = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const mcpClient_1 = require("../lib/mcpClient");
const AuthContext_1 = require("../AuthContext"); // you uploaded this
// if you added the helper:
const getNumericUserId = (id) => {
    const n = typeof id === 'number' ? id : parseInt(String(id).replace(/\D/g, ''), 10);
    return Number.isFinite(n) ? n : 1;
};
exports.getNumericUserId = getNumericUserId;
const AdminAIBooking = () => {
    const { user } = (0, AuthContext_1.useAuth)?.() ?? { user: undefined };
    const token = import.meta.env.VITE_MCP_TOKEN;
    const [timeslotId, setTimeslotId] = (0, react_1.useState)(42);
    const [candidateRoomIds, setCandidateRoomIds] = (0, react_1.useState)('101,102,201');
    const [available, setAvailable] = (0, react_1.useState)(null);
    const [busy, setBusy] = (0, react_1.useState)(false);
    const [err, setErr] = (0, react_1.useState)(null);
    const [confirm, setConfirm] = (0, react_1.useState)(null);
    const search = async () => {
        setErr(null);
        setBusy(true);
        setAvailable(null);
        setConfirm(null);
        try {
            const ids = candidateRoomIds.split(',').map(s => Number(s.trim())).filter(Boolean);
            const out = await (0, mcpClient_1.mcpInvoke)('searchRooms', { timeslotId, candidateRoomIds: ids }, token);
            setAvailable(out);
        }
        catch (e) {
            setErr(e.message ?? String(e));
        }
        finally {
            setBusy(false);
        }
    };
    const book = async (roomId) => {
        setErr(null);
        setBusy(true);
        setConfirm(null);
        try {
            const requestedByUserId = user?.id ? (0, exports.getNumericUserId)(user.id) : 1;
            const b = await (0, mcpClient_1.mcpInvoke)('bookRoom', { requestedByUserId, roomId, timeslotId, title: 'AI Agent Hold' }, token);
            setConfirm(b);
        }
        catch (e) {
            setErr(e.message ?? String(e));
        }
        finally {
            setBusy(false);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "generic-page", children: [(0, jsx_runtime_1.jsxs)("header", { className: "page-header", children: [(0, jsx_runtime_1.jsx)("button", { className: "back-button", onClick: () => history.back(), children: "\u2190 Back" }), (0, jsx_runtime_1.jsx)("h1", { children: "AI Agent \u2013 Room Booking" })] }), (0, jsx_runtime_1.jsx)("main", { className: "page-content", children: (0, jsx_runtime_1.jsxs)("div", { className: "page-card", children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12 }, children: [(0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("div", { children: "Timeslot ID" }), (0, jsx_runtime_1.jsx)("input", { type: "number", value: timeslotId, onChange: e => setTimeslotId(Number(e.target.value)) })] }), (0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("div", { children: "Candidate Room IDs" }), (0, jsx_runtime_1.jsx)("input", { value: candidateRoomIds, onChange: e => setCandidateRoomIds(e.target.value), placeholder: "101,102,201" })] }), (0, jsx_runtime_1.jsx)("button", { className: "action-button", onClick: search, disabled: busy, children: busy ? 'Searching…' : 'Find Available' })] }), err && (0, jsx_runtime_1.jsxs)("div", { style: { color: '#c00', marginTop: 10 }, children: ["Error: ", err] }), available && ((0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 16 }, children: [(0, jsx_runtime_1.jsx)("h3", { children: "Available Rooms" }), available.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { children: "No rooms available." })) : ((0, jsx_runtime_1.jsx)("div", { style: { display: 'flex', gap: 8, flexWrap: 'wrap' }, children: available.map(rid => ((0, jsx_runtime_1.jsxs)("button", { className: "action-button", onClick: () => book(rid), children: ["Book Room ", rid] }, rid))) }))] })), confirm && ((0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 16, border: '1px solid #dee2e6', borderRadius: 8, padding: 12 }, children: [(0, jsx_runtime_1.jsx)("div", { style: { fontWeight: 700 }, children: "Booking confirmed" }), (0, jsx_runtime_1.jsx)("pre", { style: { margin: 0 }, children: JSON.stringify(confirm, null, 2) })] }))] }) })] }));
};
exports.default = AdminAIBooking;
//# sourceMappingURL=AdminAIBooking.js.map