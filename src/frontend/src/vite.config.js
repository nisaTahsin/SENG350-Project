"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
cat > vite.config.ts << 'EOF';
const vite_1 = require("vite");
const plugin_react_1 = __importDefault(require("@vitejs/plugin-react"));
exports.default = (0, vite_1.defineConfig)({
    plugins: [(0, plugin_react_1.default)()],
    test: {
        environment: 'jsdom',
        setupFiles: ['./src/setupTests.ts'],
        include: ['**/*.test.{ts,tsx}'],
        css: true,
        globals: true
    },
});
EOF;
//# sourceMappingURL=vite.config.js.map