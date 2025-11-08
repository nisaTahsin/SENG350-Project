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
const UserBookings_1 = __importDefault(require("./UserBookings"));
const users = [
    {
        Name: 'FirstName LastName',
        phone: '123-456-7890',
        email: 'staff@example.com',
        disabled: false,
    },
    {
        Name: 'John Smith',
        phone: '234-567-8901',
        email: 'john.smith@example.com',
        disabled: false,
    },
    {
        Name: 'Jane Doe',
        phone: '345-678-9012',
        email: 'jane.doe@example.com',
        disabled: false,
    },
    {
        Name: 'Bob Johnson',
        phone: '456-789-0123',
        email: 'bob.johnson@example.com',
        disabled: true,
    },
    {
        Name: 'Alice Brown',
        phone: '567-890-1234',
        email: 'alice.brown@example.com',
        disabled: false,
    },
];
const RegistrarAccountManagementTable = () => {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [selectedUserIdx, setSelectedUserIdx] = (0, react_1.useState)(null);
    const [showBookings, setShowBookings] = (0, react_1.useState)(false);
    const openBookings = (idx) => {
        setSelectedUserIdx(idx);
        setShowBookings(true);
    };
    const closeBookings = () => {
        setShowBookings(false);
        setSelectedUserIdx(null);
    };
    // Filter users based on search term
    const filteredUsers = users.filter(user => user.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm));
    return ((0, jsx_runtime_1.jsxs)("div", { style: { background: 'white', borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: 24, position: 'relative' }, children: [(0, jsx_runtime_1.jsx)("h2", { children: "Users" }), (0, jsx_runtime_1.jsx)("div", { style: { marginBottom: 16 }, children: (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search users by name, email, or phone...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), style: {
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: 4,
                        fontSize: 14
                    } }) }), (0, jsx_runtime_1.jsx)("div", { style: { overflowX: 'auto' }, children: (0, jsx_runtime_1.jsxs)("table", { style: { width: '100%', borderCollapse: 'collapse' }, children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { style: { background: '#0a4a7e', color: 'white' }, children: [(0, jsx_runtime_1.jsx)("th", { style: { padding: 8 }, children: "NAME" }), (0, jsx_runtime_1.jsx)("th", { style: { padding: 8 }, children: "PHONE" }), (0, jsx_runtime_1.jsx)("th", { style: { padding: 8 }, children: "E-MAIL" }), (0, jsx_runtime_1.jsx)("th", { style: { padding: 8 }, children: "DISABLED" }), (0, jsx_runtime_1.jsx)("th", { style: { padding: 8 }, children: "ACTIONS" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: filteredUsers.length > 0 ? (filteredUsers.map((user, idx) => {
                                const originalIdx = users.findIndex(u => u === user);
                                return ((0, jsx_runtime_1.jsxs)("tr", { style: { borderBottom: '1px solid #eee' }, children: [(0, jsx_runtime_1.jsx)("td", { style: { padding: 8 }, children: user.Name }), (0, jsx_runtime_1.jsx)("td", { style: { padding: 8 }, children: user.phone }), (0, jsx_runtime_1.jsx)("td", { style: { padding: 8 }, children: user.email }), (0, jsx_runtime_1.jsx)("td", { style: { padding: 8 }, children: user.disabled ? 'Yes' : 'No' }), (0, jsx_runtime_1.jsxs)("td", { style: { padding: 8 }, children: [(0, jsx_runtime_1.jsx)("button", { style: {
                                                        marginRight: 4,
                                                        background: '#2257bf',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: 4,
                                                        padding: '4px 8px',
                                                        cursor: 'pointer'
                                                    }, onClick: () => openBookings(originalIdx), children: "View Bookings" }), (0, jsx_runtime_1.jsx)("button", { style: {
                                                        marginRight: 4,
                                                        background: '#28a745',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: 4,
                                                        padding: '4px 8px',
                                                        cursor: 'pointer'
                                                    }, children: "Edit Info" })] })] }, originalIdx));
                            })) : ((0, jsx_runtime_1.jsx)("tr", { children: (0, jsx_runtime_1.jsx)("td", { colSpan: 5, style: { padding: 16, textAlign: 'center', color: '#666' }, children: "No users found matching your search." }) })) })] }) }), (0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 12, textAlign: 'right', color: '#666' }, children: ["Showing ", filteredUsers.length, " of ", users.length, " users"] }), showBookings && selectedUserIdx !== null && ((0, jsx_runtime_1.jsx)(UserBookings_1.default, { userName: users[selectedUserIdx].Name, onClose: closeBookings }))] }));
};
exports.default = RegistrarAccountManagementTable;
//# sourceMappingURL=RegistrarAccountManagementTable.js.map