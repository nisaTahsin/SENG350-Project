"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const GenericPage_1 = __importDefault(require("../GenericPage"));
const RegistrarAccountManagementTable_1 = __importDefault(require("../RegistrarAccountManagementTable"));
const RegistrarAccountManagement = () => {
    return ((0, jsx_runtime_1.jsx)(GenericPage_1.default, { title: "Account Management", description: "Block abusive accounts or manually release bookings", userType: "registrar", children: (0, jsx_runtime_1.jsx)("div", { style: { marginTop: 32 }, children: (0, jsx_runtime_1.jsx)(RegistrarAccountManagementTable_1.default, {}) }) }));
};
exports.default = RegistrarAccountManagement;
//# sourceMappingURL=RegistrarAccountManagement.js.map