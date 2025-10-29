import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../user/user.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService,
  ) {}

  async signup(userData: { username: string; email: string; password: string; role: string }) {
    try {
      const existing = await this.usersService.findByUsername(userData.username);
      if (existing) {
        // Log failed signup attempt
        await this.auditService.logAction(
          undefined,
          'USER_REGISTRATION_FAILED',
          'user',
          undefined,
          { username: userData.username, reason: 'Username already exists' }
        );
        throw new ConflictException('Username already exists');
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.usersService.create({
        ...userData,
        password: hashedPassword,
        role: userData.role as 'staff' | 'registrar' | 'admin',
      });

      // Log successful registration (already logged in user service, but we can add here too)
      await this.auditService.logAction(
        user.id,
        'USER_REGISTERED',
        'user',
        user.id,
        { username: user.username, email: user.email, role: user.role }
      );

      return { message: 'User created', userId: user.id };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error; // Re-throw ConflictException as is
      }
      
      // Log unexpected registration failure
      await this.auditService.logAction(
        undefined,
        'USER_REGISTRATION_ERROR',
        'user',
        undefined,
        { username: userData.username, error: error instanceof Error ? error.message : 'Unknown error' }
      );
      throw error;
    }
  }

  async login(username: string, password: string) {
    try {
      const user = await this.usersService.findByUsername(username);
      
      if (!user) {
        // Log failed login attempt - user not found
        await this.auditService.logAction(
          undefined,
          'LOGIN_FAILED',
          'user',
          undefined,
          { username, reason: 'User not found' }
        );
        throw new UnauthorizedException('Invalid credentials');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        // Log failed login attempt - wrong password
        await this.auditService.logAction(
          user.id,
          'LOGIN_FAILED',
          'user',
          user.id,
          { username, reason: 'Invalid password' }
        );
        throw new UnauthorizedException('Invalid credentials');
      }

      // Check if user is blocked
      if (user.isBlocked) {
        await this.auditService.logAction(
          user.id,
          'LOGIN_BLOCKED',
          'user',
          user.id,
          { username, reason: 'User account is blocked' }
        );
        throw new UnauthorizedException('Account is blocked');
      }

      // Log successful login
      await this.auditService.logAction(
        user.id,
        'LOGIN_SUCCESS',
        'user',
        user.id,
        { username, role: user.role }
      );

      const payload = { sub: user.id, username: user.username, role: user.role };
      return { access_token: this.jwtService.sign(payload) };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error; // Re-throw UnauthorizedException as is
      }
      
      // Log unexpected login error
      await this.auditService.logAction(
        undefined,
        'LOGIN_ERROR',
        'user',
        undefined,
        { username, error: error instanceof Error ? error.message : 'Unknown error' }
      );
      throw error;
    }
  }

  async logout(userId: number, username: string) {
    // Log logout
    await this.auditService.logAction(
      userId,
      'LOGOUT',
      'user',
      userId,
      { username }
    );
    
    return { message: 'Logged out successfully' };
  }
}
