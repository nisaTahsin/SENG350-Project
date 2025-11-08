"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const GenericPage_1 = __importDefault(require("../GenericPage"));
const AdminPermissionsTable_1 = __importDefault(require("../AdminPermissionsTable"));
const AdminPermissions = () => {
    return ((0, jsx_runtime_1.jsx)(GenericPage_1.default, { title: "User Roles & Permissions", description: "Manage user roles and system permissions", userType: "admin", children: (0, jsx_runtime_1.jsx)("div", { style: { marginTop: 32 }, children: (0, jsx_runtime_1.jsx)(AdminPermissionsTable_1.default, {}) }) }));
};
exports.default = AdminPermissions;
//# sourceMappingURL=AdminPermissions.js.map