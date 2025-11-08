"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
const user_event_1 = __importDefault(require("@testing-library/user-event"));
const RegistrarAccountManagementTable_1 = __importDefault(require("../src/components/RegistrarAccountManagementTable"));
describe("RegistrarAccountManagementTable", () => {
    it("filters users and opens the bookings modal", async () => {
        (0, react_2.render)((0, jsx_runtime_1.jsx)(RegistrarAccountManagementTable_1.default, {}));
        const search = react_2.screen.getByPlaceholderText(/search users/i);
        await user_event_1.default.type(search, "ali");
        const rows = react_2.screen.getAllByRole("row");
        const firstRow = rows[1];
        const viewBtn = (0, react_2.within)(firstRow).getByRole("button", {
            name: /view bookings/i,
        });
        await user_event_1.default.click(viewBtn);
        // Modal heading instead of role="dialog"
        expect(await react_2.screen.findByText(/bookings for/i)).toBeInTheDocument();
    });
});
//# sourceMappingURL=RegistrarAccountManagementTable.test.js.map