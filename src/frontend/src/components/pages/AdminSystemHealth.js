"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const GenericPage_1 = __importDefault(require("../GenericPage"));
const AdminSystemHealthTable_1 = __importDefault(require("../AdminSystemHealthTable"));
const AdminSystemHealth = () => {
    return ((0, jsx_runtime_1.jsx)(GenericPage_1.default, { title: "System Health", description: "Monitor system performance and health metrics", userType: "admin", children: (0, jsx_runtime_1.jsx)("div", { style: { marginTop: 32 }, children: (0, jsx_runtime_1.jsx)(AdminSystemHealthTable_1.default, {}) }) }));
};
exports.default = AdminSystemHealth;
//# sourceMappingURL=AdminSystemHealth.js.map