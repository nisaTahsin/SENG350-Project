"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
const user_event_1 = __importDefault(require("@testing-library/user-event"));
const AdminPermissionsTable_1 = __importDefault(require("../src/components/AdminPermissionsTable"));
describe("AdminPermissionsTable", () => {
    it("edits a user's role", async () => {
        (0, react_2.render)((0, jsx_runtime_1.jsx)(AdminPermissionsTable_1.default, {}));
        const row = react_2.screen.getAllByRole("row")[1];
        await user_event_1.default.click((0, react_2.within)(row).getByRole("button", { name: /change permissions/i }));
        // select dropdown by generic combobox role (no name)
        const select = await react_2.screen.findByRole("combobox");
        await user_event_1.default.selectOptions(select, "Admin");
        await user_event_1.default.click(react_2.screen.getByRole("button", { name: /save/i }));
        expect((0, react_2.within)(row).getByText(/admin/i)).toBeInTheDocument();
    });
});
//# sourceMappingURL=AdminPermissionsTable.test.js.map