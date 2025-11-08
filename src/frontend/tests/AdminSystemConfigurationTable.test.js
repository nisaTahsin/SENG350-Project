"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
const user_event_1 = __importDefault(require("@testing-library/user-event"));
const AdminSystemConfigurationTable_1 = __importDefault(require("../src/components/AdminSystemConfigurationTable"));
describe("AdminSystemConfigurationTable", () => {
    it("renders and allows editing a setting", async () => {
        (0, react_2.render)((0, jsx_runtime_1.jsx)(AdminSystemConfigurationTable_1.default, {}));
        // handle multiple matches
        const cells = react_2.screen.getAllByText(/default open time/i);
        const row = cells[0].closest("tr");
        expect(row).toBeInTheDocument();
        await user_event_1.default.click((0, react_2.within)(row).getByRole("button", { name: /edit/i }));
        // confirm modal heading
        expect(await react_2.screen.findByText(/edit configuration/i)).toBeInTheDocument();
    });
});
//# sourceMappingURL=AdminSystemConfigurationTable.test.js.map