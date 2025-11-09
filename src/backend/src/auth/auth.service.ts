import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppDataSource } from '../data-source';
import { AuditService } from '../audit/audit.service';

// Add proper interfaces
interface UserData {
  username: string;
  email: string;
  password: string;
  role: string;
}

interface ValidatedUser {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService,
  ) {}

  async validateUser(username: string, password: string): Promise<ValidatedUser | null> {
    try {
      console.log('🔍 Validating user:', username);
      
      const users = await AppDataSource.query(
        'SELECT id, username, email, role, password_hash FROM users WHERE username = $1 OR email = $1',
        [username]
      );

      const user = users[0];
      console.log('👤 Found user:', user ? { id: user.id, username: user.username, role: user.role } : 'No user found');

      if (user) {
        console.log('🔑 Comparing passwords:', {
          provided: password,
          stored: user.password_hash,
          match: password === user.password_hash
        });

        // Compare plain text passwords directly
        if (password === user.password_hash) {
          console.log('✅ Password match successful');
          // Remove password from result
          const { password_hash: _, ...result } = user;
          return result as ValidatedUser;
        } else {
          console.log('❌ Password mismatch');
        }
      }
      return null;
    } catch (error: unknown) {
      console.error('❌ Error validating user:', error);
      return null;
    }
  }

  async loginWithCredentials(username: string, password: string): Promise<LoginResponse> {
    console.log('🔐 Login attempt for username:', username);
    
    const user = await this.validateUser(username, password);
    if (!user) {
      console.log('❌ Login failed: Invalid credentials');
      
      // Log failed login attempt
      await this.auditService.logAction(
        undefined, // No user ID for failed login
        'LOGIN_FAILED',
        'user',
        undefined,
        { 
          username, 
          reason: 'Invalid credentials',
          timestamp: new Date().toISOString()
        }
      );
      
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is blocked
    const userDetails = await AppDataSource.query(
      'SELECT is_blocked FROM users WHERE id = $1',
      [user.id]
    );

    if (userDetails[0]?.is_blocked) {
      console.log('❌ Login failed: User is blocked');
      
      // Log blocked user login attempt
      await this.auditService.logAction(
        user.id,
        'LOGIN_BLOCKED_ATTEMPT',
        'user',
        user.id,
        { 
          username: user.username,
          reason: 'Account is blocked',
          timestamp: new Date().toISOString()
        }
      );
      
      throw new UnauthorizedException('Account is blocked');
    }

    // Generate JWT token
    const payload = { 
      username: user.username, 
      sub: user.id, 
      role: user.role,
      email: user.email 
    };
    
    const access_token = this.jwtService.sign(payload);
    
    console.log('✅ Login successful for user:', user.username);

    // Log successful login
    await this.auditService.logAction(
      user.id,
      'USER_LOGIN',
      'user',
      user.id,
      { 
        username: user.username,
        role: user.role,
        email: user.email,
        timestamp: new Date().toISOString()
      }
    );

    return {
      access_token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async logout(userId: number, username: string): Promise<{ message: string }> {
    console.log('🔓 Logging out user:', username);
    
    // Log logout action
    await this.auditService.logAction(
      userId,
      'USER_LOGOUT',
      'user',
      userId,
      { 
        username,
        timestamp: new Date().toISOString()
      }
    );

    return { message: 'Logged out successfully' };
  }

  async signup(userData: UserData): Promise<{ success: boolean; message: string; user?: any }> {
    try {
      console.log('📝 Signup attempt for:', userData.username);

      // Check if user already exists
      const existingUsers = await AppDataSource.query(
        'SELECT id FROM users WHERE username = $1 OR email = $2',
        [userData.username, userData.email]
      );

      if (existingUsers.length > 0) {
        return { success: false, message: 'User already exists' };
      }

      // Store plain text password (not recommended for production)
      const result = await AppDataSource.query(
        `INSERT INTO users (username, email, password_hash, role) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, username, email, role`,
        [userData.username, userData.email, userData.password, userData.role]
      );

      const newUser = result[0];
      console.log('✅ User created successfully:', newUser.username);

      // Log user creation
      await this.auditService.logAction(
        newUser.id,
        'USER_CREATED',
        'user',
        newUser.id,
        { 
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          created_by: 'self_registration'
        }
      );

      return { 
        success: true, 
        message: 'User created successfully',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role
        }
      };
    } catch (error: unknown) {
      console.error('❌ Signup error:', error);
      return { success: false, message: 'Failed to create user' };
    }
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      // Get user with current password
      const users = await AppDataSource.query(
        'SELECT password_hash, username FROM users WHERE id = $1',
        [userId]
      );

      const user = users[0];
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password (plain text comparison)
      if (currentPassword !== user.password_hash) {
        // Log failed password change attempt
        await this.auditService.logAction(
          userId,
          'PASSWORD_CHANGE_FAILED',
          'user',
          userId,
          { reason: 'Invalid current password' }
        );
        throw new UnauthorizedException('Current password is incorrect');
      }

      // Update with new plain text password
      await AppDataSource.query(
        'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
        [newPassword, userId]
      );

      // Log successful password change
      await this.auditService.logAction(
        userId,
        'PASSWORD_CHANGED',
        'user',
        userId,
        { username: user.username }
      );

      return { success: true, message: 'Password changed successfully' };
    } catch (error: unknown) {
      console.error('Change password error:', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new Error('Failed to change password');
    }
  }

  async getUserProfile(userId: number): Promise<any> {
    try {
      const users = await AppDataSource.query(
        'SELECT id, username, email, role, is_blocked, created_at FROM users WHERE id = $1',
        [userId]
      );

      return users[0] || null;
    } catch (error: unknown) {
      console.error('Get user profile error:', error);
      return null;
    }
  }

  async updateUserRole(userId: number, newRole: string, adminId: number): Promise<{ success: boolean; message: string }> {
    try {
      const users = await AppDataSource.query(
        'SELECT username, role FROM users WHERE id = $1',
        [userId]
      );

      const user = users[0];
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      const oldRole = user.role;

      await AppDataSource.query(
        'UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2',
        [newRole, userId]
      );

      // Log role change
      await this.auditService.logAction(
        adminId,
        'USER_ROLE_CHANGED',
        'user',
        userId,
        { 
          username: user.username,
          old_role: oldRole,
          new_role: newRole
        }
      );

      return { success: true, message: 'User role updated successfully' };
    } catch (error: unknown) {
      console.error('Update user role error:', error);
      return { success: false, message: 'Failed to update user role' };
    }
  }

  async blockUser(userId: number, adminId: number, reason?: string): Promise<{ success: boolean; message: string }> {
    try {
      const users = await AppDataSource.query(
        'SELECT username FROM users WHERE id = $1',
        [userId]
      );

      const user = users[0];
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      await AppDataSource.query(
        'UPDATE users SET is_blocked = true, updated_at = NOW() WHERE id = $1',
        [userId]
      );

      // Log user blocking
      await this.auditService.logAction(
        adminId,
        reason ? 'USER_BLOCKED_WITH_REASON' : 'USER_BLOCKED',
        'user',
        userId,
        { 
          username: user.username,
          reason: reason || 'No reason provided'
        }
      );

      return { success: true, message: 'User blocked successfully' };
    } catch (error: unknown) {
      console.error('Block user error:', error);
      return { success: false, message: 'Failed to block user' };
    }
  }

  async unblockUser(userId: number, adminId: number): Promise<{ success: boolean; message: string }> {
    try {
      const users = await AppDataSource.query(
        'SELECT username FROM users WHERE id = $1',
        [userId]
      );

      const user = users[0];
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      await AppDataSource.query(
        'UPDATE users SET is_blocked = false, updated_at = NOW() WHERE id = $1',
        [userId]
      );

      // Log user unblocking
      await this.auditService.logAction(
        adminId,
        'USER_UNBLOCKED',
        'user',
        userId,
        { username: user.username }
      );

      return { success: true, message: 'User unblocked successfully' };
    } catch (error: unknown) {
      console.error('Unblock user error:', error);
      return { success: false, message: 'Failed to unblock user' };
    }
  }
}
