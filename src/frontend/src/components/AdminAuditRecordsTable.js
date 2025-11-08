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
const auditRecords = [
    // Sign-ins
    {
        id: '1',
        timestamp: '2024-01-15 09:30:15',
        user: 'john.smith@example.com',
        userRole: 'Staff',
        action: 'Sign-in',
        details: 'Successful login from office network',
        category: 'Authentication'
    },
    {
        id: '2',
        timestamp: '2024-01-15 08:45:22',
        user: 'jane.doe@example.com',
        userRole: 'Registrar',
        action: 'Sign-in',
        details: 'Successful login from office network',
        category: 'Authentication'
    },
    {
        id: '3',
        timestamp: '2024-01-15 14:20:33',
        user: 'admin@example.com',
        userRole: 'Admin',
        action: 'Sign-in',
        details: 'Successful login from office network',
        category: 'Authentication'
    },
    // Bookings/Cancellations
    {
        id: '4',
        timestamp: '2024-01-15 10:15:45',
        user: 'john.smith@example.com',
        userRole: 'Staff',
        action: 'Booking Created',
        details: 'Booked Room A101 for 2024-01-16 14:00-16:00',
        category: 'Booking Management'
    },
    {
        id: '5',
        timestamp: '2024-01-15 11:30:12',
        user: 'alice.brown@example.com',
        userRole: 'Staff',
        action: 'Booking Cancelled',
        details: 'Cancelled booking for Room B205 on 2024-01-17 10:00-12:00',
        category: 'Booking Management'
    },
    {
        id: '6',
        timestamp: '2024-01-15 13:45:28',
        user: 'bob.johnson@example.com',
        userRole: 'Staff',
        action: 'Booking Created',
        details: 'Booked Room C301 for 2024-01-18 09:00-11:00',
        category: 'Booking Management'
    },
    // Role/Permission Changes
    {
        id: '7',
        timestamp: '2024-01-15 09:15:30',
        user: 'admin@example.com',
        userRole: 'Admin',
        action: 'Role Changed',
        details: 'Changed user mike.wilson@example.com from Staff to Registrar',
        category: 'User Management'
    },
    {
        id: '8',
        timestamp: '2024-01-15 10:30:45',
        user: 'admin@example.com',
        userRole: 'Admin',
        action: 'Account Disabled',
        details: 'Disabled account for user sarah.davis@example.com',
        category: 'User Management'
    },
    {
        id: '9',
        timestamp: '2024-01-15 11:45:12',
        user: 'admin@example.com',
        userRole: 'Admin',
        action: 'Account Enabled',
        details: 'Enabled account for user tom.wilson@example.com',
        category: 'User Management'
    },
    // Escalations
    {
        id: '10',
        timestamp: '2024-01-15 12:00:15',
        user: 'jane.doe@example.com',
        userRole: 'Registrar',
        action: 'Account Blocked',
        details: 'Blocked account for user problematic.user@example.com due to policy violations',
        category: 'Escalations'
    },
    {
        id: '11',
        timestamp: '2024-01-15 14:15:30',
        user: 'jane.doe@example.com',
        userRole: 'Registrar',
        action: 'Account Released',
        details: 'Released booking for user john.smith@example.com after review',
        category: 'Escalations'
    },
    // System Configuration Edits
    {
        id: '12',
        timestamp: '2024-01-15 08:30:45',
        user: 'admin@example.com',
        userRole: 'Admin',
        action: 'Config Changed',
        details: 'Changed max bookings per day from 2 to 3',
        category: 'System Configuration'
    },
    {
        id: '13',
        timestamp: '2024-01-15 15:20:18',
        user: 'admin@example.com',
        userRole: 'Admin',
        action: 'Config Changed',
        details: 'Changed time slot granularity from 60 to 30 minutes',
        category: 'System Configuration'
    },
    {
        id: '14',
        timestamp: '2024-01-15 16:45:22',
        user: 'admin@example.com',
        userRole: 'Admin',
        action: 'Config Changed',
        details: 'Changed default classroom open time from 07:00 to 08:00',
        category: 'System Configuration'
    }
];
const AdminAuditRecordsTable = () => {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [selectedUser, setSelectedUser] = (0, react_1.useState)('');
    const [selectedRole, setSelectedRole] = (0, react_1.useState)('');
    const [selectedAction, setSelectedAction] = (0, react_1.useState)('');
    const [selectedCategory, setSelectedCategory] = (0, react_1.useState)('');
    const [startDate, setStartDate] = (0, react_1.useState)('');
    const [endDate, setEndDate] = (0, react_1.useState)('');
    // Get unique values for filters
    const uniqueUsers = Array.from(new Set(auditRecords.map(record => record.user)));
    const uniqueRoles = Array.from(new Set(auditRecords.map(record => record.userRole)));
    const uniqueActions = Array.from(new Set(auditRecords.map(record => record.action)));
    const uniqueCategories = Array.from(new Set(auditRecords.map(record => record.category)));
    // Filter records based on all criteria
    const filteredRecords = auditRecords.filter(record => {
        const matchesSearch = record.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.details.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesUser = !selectedUser || record.user === selectedUser;
        const matchesRole = !selectedRole || record.userRole === selectedRole;
        const matchesAction = !selectedAction || record.action === selectedAction;
        const matchesCategory = !selectedCategory || record.category === selectedCategory;
        const recordDate = new Date(record.timestamp);
        const matchesStartDate = !startDate || recordDate >= new Date(startDate);
        const matchesEndDate = !endDate || recordDate <= new Date(endDate + ' 23:59:59');
        return matchesSearch && matchesUser && matchesRole && matchesAction && matchesCategory && matchesStartDate && matchesEndDate;
    });
    const getCategoryColor = (category) => {
        switch (category) {
            case 'Authentication': return '#007bff';
            case 'Booking Management': return '#28a745';
            case 'User Management': return '#ffc107';
            case 'Escalations': return '#dc3545';
            case 'System Configuration': return '#6f42c1';
            default: return '#6c757d';
        }
    };
    const clearFilters = () => {
        setSearchTerm('');
        setSelectedUser('');
        setSelectedRole('');
        setSelectedAction('');
        setSelectedCategory('');
        setStartDate('');
        setEndDate('');
    };
    return ((0, jsx_runtime_1.jsxs)("div", { style: { background: 'white', borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: 24, position: 'relative' }, children: [(0, jsx_runtime_1.jsx)("h2", { children: "Audit Records" }), (0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: 24, padding: 16, background: '#f8f9fa', borderRadius: 8, border: '1px solid #dee2e6' }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }, children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { style: { display: 'block', fontWeight: 'bold', marginBottom: 4, fontSize: 12 }, children: "Search" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search records...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), style: {
                                            width: '100%',
                                            padding: '6px 8px',
                                            border: '1px solid #ddd',
                                            borderRadius: 4,
                                            fontSize: 12
                                        } })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { style: { display: 'block', fontWeight: 'bold', marginBottom: 4, fontSize: 12 }, children: "User" }), (0, jsx_runtime_1.jsxs)("select", { value: selectedUser, onChange: (e) => setSelectedUser(e.target.value), style: {
                                            width: '100%',
                                            padding: '6px 8px',
                                            border: '1px solid #ddd',
                                            borderRadius: 4,
                                            fontSize: 12
                                        }, children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "All Users" }), uniqueUsers.map(user => ((0, jsx_runtime_1.jsx)("option", { value: user, children: user }, user)))] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { style: { display: 'block', fontWeight: 'bold', marginBottom: 4, fontSize: 12 }, children: "Role" }), (0, jsx_runtime_1.jsxs)("select", { value: selectedRole, onChange: (e) => setSelectedRole(e.target.value), style: {
                                            width: '100%',
                                            padding: '6px 8px',
                                            border: '1px solid #ddd',
                                            borderRadius: 4,
                                            fontSize: 12
                                        }, children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "All Roles" }), uniqueRoles.map(role => ((0, jsx_runtime_1.jsx)("option", { value: role, children: role }, role)))] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { style: { display: 'block', fontWeight: 'bold', marginBottom: 4, fontSize: 12 }, children: "Action" }), (0, jsx_runtime_1.jsxs)("select", { value: selectedAction, onChange: (e) => setSelectedAction(e.target.value), style: {
                                            width: '100%',
                                            padding: '6px 8px',
                                            border: '1px solid #ddd',
                                            borderRadius: 4,
                                            fontSize: 12
                                        }, children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "All Actions" }), uniqueActions.map(action => ((0, jsx_runtime_1.jsx)("option", { value: action, children: action }, action)))] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { style: { display: 'block', fontWeight: 'bold', marginBottom: 4, fontSize: 12 }, children: "Category" }), (0, jsx_runtime_1.jsxs)("select", { value: selectedCategory, onChange: (e) => setSelectedCategory(e.target.value), style: {
                                            width: '100%',
                                            padding: '6px 8px',
                                            border: '1px solid #ddd',
                                            borderRadius: 4,
                                            fontSize: 12
                                        }, children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "All Categories" }), uniqueCategories.map(category => ((0, jsx_runtime_1.jsx)("option", { value: category, children: category }, category)))] })] })] }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 16, alignItems: 'end' }, children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { style: { display: 'block', fontWeight: 'bold', marginBottom: 4, fontSize: 12 }, children: "Start Date" }), (0, jsx_runtime_1.jsx)("input", { type: "date", value: startDate, onChange: (e) => setStartDate(e.target.value), style: {
                                            width: '100%',
                                            padding: '6px 8px',
                                            border: '1px solid #ddd',
                                            borderRadius: 4,
                                            fontSize: 12
                                        } })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { style: { display: 'block', fontWeight: 'bold', marginBottom: 4, fontSize: 12 }, children: "End Date" }), (0, jsx_runtime_1.jsx)("input", { type: "date", value: endDate, onChange: (e) => setEndDate(e.target.value), style: {
                                            width: '100%',
                                            padding: '6px 8px',
                                            border: '1px solid #ddd',
                                            borderRadius: 4,
                                            fontSize: 12
                                        } })] }), (0, jsx_runtime_1.jsx)("button", { onClick: clearFilters, style: {
                                    background: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 4,
                                    padding: '6px 12px',
                                    cursor: 'pointer',
                                    fontSize: 12
                                }, children: "Clear Filters" })] })] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: 16, color: '#666', fontSize: 14 }, children: ["Showing ", filteredRecords.length, " of ", auditRecords.length, " records"] }), (0, jsx_runtime_1.jsx)("div", { style: { overflowX: 'auto' }, children: (0, jsx_runtime_1.jsxs)("table", { style: { width: '100%', borderCollapse: 'collapse' }, children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { style: { background: '#0a4a7e', color: 'white' }, children: [(0, jsx_runtime_1.jsx)("th", { style: { padding: 12, textAlign: 'left' }, children: "TIMESTAMP" }), (0, jsx_runtime_1.jsx)("th", { style: { padding: 12, textAlign: 'left' }, children: "USER" }), (0, jsx_runtime_1.jsx)("th", { style: { padding: 12, textAlign: 'left' }, children: "ROLE" }), (0, jsx_runtime_1.jsx)("th", { style: { padding: 12, textAlign: 'left' }, children: "ACTION" }), (0, jsx_runtime_1.jsx)("th", { style: { padding: 12, textAlign: 'left' }, children: "DETAILS" }), (0, jsx_runtime_1.jsx)("th", { style: { padding: 12, textAlign: 'left', minWidth: 150 }, children: "CATEGORY" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: filteredRecords.length > 0 ? (filteredRecords.map((record) => ((0, jsx_runtime_1.jsxs)("tr", { style: { borderBottom: '1px solid #dee2e6' }, children: [(0, jsx_runtime_1.jsx)("td", { style: { padding: 12, fontSize: 12, fontFamily: 'monospace' }, children: record.timestamp }), (0, jsx_runtime_1.jsx)("td", { style: { padding: 12, fontWeight: 'bold' }, children: record.user }), (0, jsx_runtime_1.jsx)("td", { style: { padding: 12 }, children: (0, jsx_runtime_1.jsx)("span", { style: {
                                                background: record.userRole === 'Admin' ? '#000000ff' :
                                                    record.userRole === 'Registrar' ? '#6f6f6fff' : '#a3a3a3ff',
                                                color: 'white',
                                                padding: '2px 6px',
                                                borderRadius: 12,
                                                fontSize: 10,
                                                fontWeight: 'bold'
                                            }, children: record.userRole }) }), (0, jsx_runtime_1.jsx)("td", { style: { padding: 12 }, children: (0, jsx_runtime_1.jsx)("span", { style: { display: 'flex', alignItems: 'center', gap: 4 }, children: record.action }) }), (0, jsx_runtime_1.jsx)("td", { style: { padding: 12, maxWidth: 300, wordWrap: 'break-word' }, children: record.details }), (0, jsx_runtime_1.jsx)("td", { style: { padding: 12, minWidth: 150, whiteSpace: 'nowrap' }, children: (0, jsx_runtime_1.jsx)("span", { style: {
                                                background: getCategoryColor(record.category),
                                                color: 'white',
                                                padding: '4px 12px',
                                                borderRadius: 12,
                                                fontSize: 11,
                                                fontWeight: 'bold',
                                                display: 'inline-block'
                                            }, children: record.category }) })] }, record.id)))) : ((0, jsx_runtime_1.jsx)("tr", { children: (0, jsx_runtime_1.jsx)("td", { colSpan: 6, style: { padding: 32, textAlign: 'center', color: '#666' }, children: "No audit records found matching your criteria." }) })) })] }) })] }));
};
exports.default = AdminAuditRecordsTable;
//# sourceMappingURL=AdminAuditRecordsTable.js.map