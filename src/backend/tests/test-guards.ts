import { CanActivate, ExecutionContext, Injectable, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const ROLES_KEY = 'roles';

// Read roles from @Roles decorator
@Injectable()
export class TestRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const req = ctx.switchToHttp().getRequest();
    const role = (req.headers['x-role'] as string)?.toLowerCase() || '';
    return required.map(r => r.toLowerCase()).includes(role);
  }
}

// Always "auth" and attach a fake user
@Injectable()
export class TestJwtAuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    req.user = { id: 123, email: 'test@user.com', name: 'Test User' };
    return true;
  }
}

// Helper to create an override token for @Roles decorator if needed.
// If your project uses a custom metadata key from a custom decorator,
// adjust ROLES_KEY accordingly.
export function getRolesDecoratorToken(): string {
  return ROLES_KEY;
}
