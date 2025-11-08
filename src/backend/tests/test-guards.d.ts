import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare const ROLES_KEY = "roles";
export declare class TestRolesGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(ctx: ExecutionContext): boolean;
}
export declare class TestJwtAuthGuard implements CanActivate {
    canActivate(ctx: ExecutionContext): boolean;
}
export declare function getRolesDecoratorToken(): string;
//# sourceMappingURL=test-guards.d.ts.map