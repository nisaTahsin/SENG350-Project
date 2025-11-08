"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const GenericPage_1 = __importDefault(require("../GenericPage"));
const AdminSystemConfigurationTable_1 = __importDefault(require("../AdminSystemConfigurationTable"));
const AdminSystemConfig = () => {
    return ((0, jsx_runtime_1.jsx)(GenericPage_1.default, { title: "System Configuration", description: "Configure system-level settings and parameters", userType: "admin", children: (0, jsx_runtime_1.jsx)("div", { style: { marginTop: 32 }, children: (0, jsx_runtime_1.jsx)(AdminSystemConfigurationTable_1.default, {}) }) }));
};
exports.default = AdminSystemConfig;
//# sourceMappingURL=AdminSystemConfig.js.map