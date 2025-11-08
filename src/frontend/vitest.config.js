"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("vitest/config");
const plugin_react_1 = __importDefault(require("@vitejs/plugin-react"));
const node_url_1 = require("node:url");
const node_path_1 = require("node:path");
const __dirname = (0, node_path_1.dirname)((0, node_url_1.fileURLToPath)(import.meta.url));
exports.default = (0, config_1.defineConfig)({
    root: __dirname, // vitest will use the frontend folder as root
    plugins: [(0, plugin_react_1.default)()],
    test: {
        environment: 'jsdom',
        globals: true, // gives you describe/it/test/expect
        setupFiles: ['./src/setupTests.ts'], // make sure this file exists
        include: ['tests/**/*.test.ts?(x)', 'src/**/*.test.ts?(x)'],
        css: true,
        coverage: { provider: 'v8', reporter: ['text', 'html'] },
    },
});
//# sourceMappingURL=vitest.config.js.map