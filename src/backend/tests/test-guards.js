"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestJwtAuthGuard = exports.TestRolesGuard = exports.ROLES_KEY = void 0;
exports.getRolesDecoratorToken = getRolesDecoratorToken;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
exports.ROLES_KEY = 'roles';
// Read roles from @Roles decorator
@(0, common_1.Injectable)()
class TestRolesGuard {
    reflector;
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
}
exports.TestRolesGuard = TestRolesGuard;
// Always "auth" and attach a fake user
@(0, common_1.Injectable)()
class TestJwtAuthGuard {
    canActivate(ctx) {
        const req = ctx.switchToHttp().getRequest();
        req.user = { id: 123, email: 'test@user.com', name: 'Test User' };
        return true;
    }
}
exports.TestJwtAuthGuard = TestJwtAuthGuard;
// Helper to create an override token for @Roles decorator if needed.
// If your project uses a custom metadata key from a custom decorator,
// adjust ROLES_KEY accordingly.
function getRolesDecoratorToken() {
    return exports.ROLES_KEY;
}
//# sourceMappingURL=test-guards.js.map