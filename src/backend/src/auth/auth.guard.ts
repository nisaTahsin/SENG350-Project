import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/*@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return !!request.user; // simple auth check
  }
}*/
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
