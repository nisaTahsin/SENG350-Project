"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
/*@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return !!request.user; // simple auth check
  }
}*/
@(0, common_1.Injectable)()
class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
}
exports.JwtAuthGuard = JwtAuthGuard;
//# sourceMappingURL=auth.guard.js.map