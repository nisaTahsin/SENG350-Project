"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestJwtAuthGuard = exports.TestRolesGuard = exports.ROLES_KEY = void 0;
exports.getRolesDecoratorToken = getRolesDecoratorToken;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
exports.ROLES_KEY = 'roles';
// Read roles from @Roles decorator
let TestRolesGuard = class TestRolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(ctx) {
        const required = this.reflector.getAllAndOverride(exports.ROLES_KEY, [
            ctx.getHandler(),
            ctx.getClass(),
        ]);
        if (!required || required.length === 0)
            return true;
        const req = ctx.switchToHttp().getRequest();
        const role = req.headers['x-role']?.toLowerCase() || '';
        return required.map(r => r.toLowerCase()).includes(role);
    }
};
exports.TestRolesGuard = TestRolesGuard;
exports.TestRolesGuard = TestRolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], TestRolesGuard);
// Always "auth" and attach a fake user
let TestJwtAuthGuard = class TestJwtAuthGuard {
    canActivate(ctx) {
        const req = ctx.switchToHttp().getRequest();
        req.user = { id: 123, email: 'test@user.com', name: 'Test User' };
        return true;
    }
};
exports.TestJwtAuthGuard = TestJwtAuthGuard;
exports.TestJwtAuthGuard = TestJwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], TestJwtAuthGuard);
// Helper to create an override token for @Roles decorator if needed.
// If your project uses a custom metadata key from a custom decorator,
// adjust ROLES_KEY accordingly.
function getRolesDecoratorToken() {
    return exports.ROLES_KEY;
}
//# sourceMappingURL=test-guards.js.map