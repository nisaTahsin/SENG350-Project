"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
// src/__tests__/AdminAuditRecordsTable.test.tsx
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
const user_event_1 = __importDefault(require("@testing-library/user-event"));
const AdminAuditRecordsTable_1 = __importDefault(require("../src/components/AdminAuditRecordsTable"));
it('filters rows by search text', async () => {
    (0, react_2.render)((0, jsx_runtime_1.jsx)(AdminAuditRecordsTable_1.default, {}));
    const before = react_2.screen.getAllByRole('row').length;
    await user_event_1.default.type(react_2.screen.getByPlaceholderText(/search/i), 'delete');
    const after = react_2.screen.getAllByRole('row').length;
    expect(after).toBeLessThan(before);
});
//# sourceMappingURL=AdminAuditRecordsTable.test.js.map