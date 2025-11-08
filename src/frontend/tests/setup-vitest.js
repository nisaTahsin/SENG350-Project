"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/__tests__/setup-vitest.ts\
require("@testing-library/jest-dom");
const vitest_1 = require("vitest");
const react_1 = require("@testing-library/react");
// JSDOM keeps leaking timers between tests sometimes \'97 clean up DOM after each\
(0, vitest_1.afterEach)(() => (0, react_1.cleanup)());
// Provide basic mocks often used in components\
vitest_1.vi.stubGlobal('matchMedia', vitest_1.vi.fn().mockImplementation((query) => ({
    matches: false, media: query, onchange: null,
    addListener: vitest_1.vi.fn(), removeListener: vitest_1.vi.fn(),
    addEventListener: vitest_1.vi.fn(), removeEventListener: vitest_1.vi.fn(), dispatchEvent: vitest_1.vi.fn()
})));
//# sourceMappingURL=setup-vitest.js.map