"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("vitest/config");
exports.default = (0, config_1.defineConfig)({
    test: {
        environment: 'node',
        include: ['tests/**/*.spec.ts'],
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/frontend/**',
            '**/group_2_proj/group_2_proj/**',
        ],
        globals: true,
    },
});
//# sourceMappingURL=vitest.config.js.map