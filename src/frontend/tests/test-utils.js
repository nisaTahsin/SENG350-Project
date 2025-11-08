"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userEvent = void 0;
exports.WithRouter = WithRouter;
exports.WithAuthOnly = WithAuthOnly;
exports.WithAuthAndRouter = WithAuthAndRouter;
exports.renderWithProviders = renderWithProviders;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const react_2 = require("@testing-library/react");
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../src/contexts/AuthContext");
function WithRouter({ children, initialEntries = ['/'], }) {
    return (0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { initialEntries: initialEntries, children: children });
}
function WithAuthOnly({ children }) {
    return (0, jsx_runtime_1.jsx)(AuthContext_1.AuthProvider, { children: children });
}
function WithAuthAndRouter({ children, initialEntries = ['/'], }) {
    return ((0, jsx_runtime_1.jsx)(AuthContext_1.AuthProvider, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { initialEntries: initialEntries, children: children }) }));
}
/** One-shot renderer with Auth + Router */
function renderWithProviders(ui, options) {
    const route = options?.route ?? '/';
    return (0, react_2.render)(ui, {
        wrapper: ({ children }) => ((0, jsx_runtime_1.jsx)(AuthContext_1.AuthProvider, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.MemoryRouter, { initialEntries: [route], children: children }) })),
        ...options,
    });
}
// ALSO export default to survive any default-imports
exports.default = renderWithProviders;
__exportStar(require("@testing-library/react"), exports);
var user_event_1 = require("@testing-library/user-event");
Object.defineProperty(exports, "userEvent", { enumerable: true, get: function () { return __importDefault(user_event_1).default; } });
//# sourceMappingURL=test-utils.js.map