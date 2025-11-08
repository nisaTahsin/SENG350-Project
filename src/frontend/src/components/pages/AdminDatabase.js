"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const GenericPage_1 = __importDefault(require("../GenericPage"));
const AdminDatabase = () => {
    return ((0, jsx_runtime_1.jsx)(GenericPage_1.default, { title: "Database Management", description: "Oversee database operations and maintenance", userType: "admin" }));
};
exports.default = AdminDatabase;
//# sourceMappingURL=AdminDatabase.js.map