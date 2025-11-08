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
const systemConfigs = [
    // Booking Policies
    {
        id: 'max-bookings-per-day',
        category: 'Booking Policies',
        setting: 'Max Bookings Per Staff Per Day',
        value: 3,
        description: 'Maximum number of bookings a staff member can make per day'
    },
    {
        id: 'cancellation-cutoff-hours',
        category: 'Booking Policies',
        setting: 'Cancellation Cutoff (Hours)',
        value: 24,
        description: 'Hours before booking start time when cancellation is no longer allowed'
    },
    {
        id: 'booking-horizon-days',
        category: 'Booking Policies',
        setting: 'Booking Horizon (Days)',
        value: 30,
        description: 'How many days in advance staff can make bookings'
    },
    // Time Slot Configuration
    {
        id: 'time-slot-granularity',
        category: 'Time Slot Configuration',
        setting: 'Time Slot Granularity (Minutes)',
        value: 30,
        description: 'Duration of each time slot (30 or 60 minutes)'
    },
    // Default Classroom Times
    {
        id: 'default-open-time',
        category: 'Default Classroom Times',
        setting: 'Default Open Time',
        value: '08:00',
        description: 'Global fallback opening time for all classrooms'
    },
    {
        id: 'default-close-time',
        category: 'Default Classroom Times',
        setting: 'Default Close Time',
        value: '22:00',
        description: 'Global fallback closing time for all classrooms'
    },
];
const AdminSystemConfigurationTable = () => {
    const [modalOpen, setModalOpen] = (0, react_1.useState)(false);
    const [selectedConfigIdx, setSelectedConfigIdx] = (0, react_1.useState)(null);
    const [editValue, setEditValue] = (0, react_1.useState)('');
    const [editType, setEditType] = (0, react_1.useState)('text');
    const openModal = (idx) => {
        setSelectedConfigIdx(idx);
        const config = systemConfigs[idx];
        setEditValue(config.value);
        // Determine input type based on setting
        if (config.setting.includes('Enabled') || config.setting.includes('Calendars')) {
            setEditType('boolean');
        }
        else if (config.setting.includes('Provider')) {
            setEditType('select');
        }
        else if (config.setting.includes('Time')) {
            setEditType('text');
        }
        else {
            setEditType('number');
        }
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
        setSelectedConfigIdx(null);
    };
    const handleSave = () => {
        if (selectedConfigIdx !== null) {
            systemConfigs[selectedConfigIdx].value = editValue;
        }
        closeModal();
    };
    // Group configs by category
    const groupedConfigs = systemConfigs.reduce((acc, config) => {
        if (!acc[config.category]) {
            acc[config.category] = [];
        }
        acc[config.category].push(config);
        return acc;
    }, {});
    const getValueDisplay = (value) => {
        if (typeof value === 'boolean') {
            return value ? 'Enabled' : 'Disabled';
        }
        return value.toString();
    };
    const getSelectOptions = (setting) => {
        if (setting.includes('Provider')) {
            return ['Internal', 'LDAP', 'OAuth', 'SAML'];
        }
        if (setting.includes('Granularity')) {
            return [15, 30, 60];
        }
        return [];
    };
    return ((0, jsx_runtime_1.jsxs)("div", { style: { background: 'white', borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: 24, position: 'relative' }, children: [(0, jsx_runtime_1.jsx)("h2", { children: "System Configuration" }), Object.entries(groupedConfigs).map(([category, configs]) => ((0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: 32 }, children: [(0, jsx_runtime_1.jsx)("h3", { style: {
                            color: '#0a4a7e',
                            borderBottom: '2px solid #0a4a7e',
                            paddingBottom: 8,
                            marginBottom: 16
                        }, children: category }), (0, jsx_runtime_1.jsx)("div", { style: { overflowX: 'auto' }, children: (0, jsx_runtime_1.jsxs)("table", { style: { width: '100%', borderCollapse: 'collapse', marginBottom: 16 }, children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { style: { background: '#f8f9fa' }, children: [(0, jsx_runtime_1.jsx)("th", { style: { padding: 12, textAlign: 'left', border: '1px solid #dee2e6' }, children: "SETTING" }), (0, jsx_runtime_1.jsx)("th", { style: { padding: 12, textAlign: 'left', border: '1px solid #dee2e6' }, children: "CURRENT VALUE" }), (0, jsx_runtime_1.jsx)("th", { style: { padding: 12, textAlign: 'left', border: '1px solid #dee2e6' }, children: "DESCRIPTION" }), (0, jsx_runtime_1.jsx)("th", { style: { padding: 12, textAlign: 'center', border: '1px solid #dee2e6' }, children: "ACTIONS" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: configs.map((config, idx) => {
                                        const originalIdx = systemConfigs.findIndex(c => c.id === config.id);
                                        return ((0, jsx_runtime_1.jsxs)("tr", { style: { borderBottom: '1px solid #dee2e6' }, children: [(0, jsx_runtime_1.jsx)("td", { style: { padding: 12, border: '1px solid #dee2e6', fontWeight: 'bold' }, children: config.setting }), (0, jsx_runtime_1.jsx)("td", { style: { padding: 12, border: '1px solid #dee2e6' }, children: (0, jsx_runtime_1.jsx)("span", { style: {
                                                            background: config.value ? '#d4edda' : '#f8d7da',
                                                            color: config.value ? '#155724' : '#721c24',
                                                            padding: '4px 8px',
                                                            borderRadius: 4,
                                                            fontSize: 12,
                                                            fontWeight: 'bold'
                                                        }, children: getValueDisplay(config.value) }) }), (0, jsx_runtime_1.jsx)("td", { style: { padding: 12, border: '1px solid #dee2e6', color: '#666' }, children: config.description }), (0, jsx_runtime_1.jsx)("td", { style: { padding: 12, border: '1px solid #dee2e6', textAlign: 'center' }, children: (0, jsx_runtime_1.jsx)("button", { style: {
                                                            background: '#2257bf',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: 4,
                                                            padding: '6px 12px',
                                                            cursor: 'pointer',
                                                            fontSize: 12
                                                        }, onClick: () => openModal(originalIdx), children: "Edit" }) })] }, config.id));
                                    }) })] }) })] }, category))), modalOpen && selectedConfigIdx !== null && ((0, jsx_runtime_1.jsx)("div", { style: {
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }, children: (0, jsx_runtime_1.jsxs)("div", { style: { background: 'white', borderRadius: 8, padding: 32, minWidth: 400, boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }, children: [(0, jsx_runtime_1.jsx)("h3", { children: "Edit Configuration" }), (0, jsx_runtime_1.jsx)("p", { style: { color: '#666', marginBottom: 16 }, children: systemConfigs[selectedConfigIdx]?.description }), (0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: 16 }, children: [(0, jsx_runtime_1.jsxs)("label", { style: { fontWeight: 'bold', display: 'block', marginBottom: 8 }, children: [systemConfigs[selectedConfigIdx]?.setting, ":"] }), editType === 'boolean' ? ((0, jsx_runtime_1.jsxs)("label", { style: { display: 'flex', alignItems: 'center' }, children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: editValue, onChange: e => setEditValue(e.target.checked), style: { marginRight: 8 } }), editValue ? 'Enabled' : 'Disabled'] })) : editType === 'select' ? ((0, jsx_runtime_1.jsx)("select", { value: editValue, onChange: e => setEditValue(e.target.value), style: { padding: 8, width: '100%', border: '1px solid #ddd', borderRadius: 4 }, children: getSelectOptions(systemConfigs[selectedConfigIdx]?.setting || '').map(option => ((0, jsx_runtime_1.jsx)("option", { value: option, children: option }, option))) })) : ((0, jsx_runtime_1.jsx)("input", { type: editType, value: editValue, onChange: e => setEditValue(editType === 'number' ? Number(e.target.value) : e.target.value), style: { padding: 8, width: '100%', border: '1px solid #ddd', borderRadius: 4 } }))] }), (0, jsx_runtime_1.jsxs)("div", { style: { textAlign: 'right' }, children: [(0, jsx_runtime_1.jsx)("button", { onClick: closeModal, style: {
                                        marginRight: 8,
                                        background: '#6c757d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 4,
                                        padding: '8px 16px',
                                        cursor: 'pointer'
                                    }, children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleSave, style: {
                                        background: '#2257bf',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 4,
                                        padding: '8px 16px',
                                        cursor: 'pointer'
                                    }, children: "Save Changes" })] })] }) }))] }));
};
exports.default = AdminSystemConfigurationTable;
//# sourceMappingURL=AdminSystemConfigurationTable.js.map