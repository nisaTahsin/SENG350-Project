import { Controller, Post, Body, Get, UseGuards, Request, Put, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { AuditService } from '../audit/audit.service';

// Add proper interface for authenticated request
interface AuthenticatedRequest {
  user: {
    userId: number;
    username: string;
    role: string;
    email: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly auditService: AuditService
  ) {}

  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    try {
      console.log('🔐 Login request received for:', loginDto.username);
      
      const result = await this.authService.loginWithCredentials(
        loginDto.username,
        loginDto.password
      );
      
      console.log('✅ Login successful for:', loginDto.username);
      
      return {
        success: true,
        access_token: result.access_token,
        user: result.user,
        message: 'Login successful'
      };
    } catch (error) {
      console.error('❌ Login failed for:', loginDto.username, error);
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed'
      };
    }
  }

  @Post('signup')
  async signup(@Body() signupDto: any) {
    try {
      console.log('📝 Signup request received for:', signupDto.username);
      
      const result = await this.authService.signup(signupDto);
      
      console.log('✅ Signup result:', result.success ? 'Success' : 'Failed');
      
      return result;
    } catch (error) {
      console.error('❌ Signup error:', error);
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Signup failed'
      };
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: AuthenticatedRequest) {
    try {
      console.log('👤 Profile request from user:', req.user.userId);
      
      const profile = await this.authService.getUserProfile(req.user.userId);
      
      if (!profile) {
        return {
          success: false,
          message: 'User profile not found'
        };
      }
      
      console.log('✅ Profile retrieved for user:', profile.username);
      
      return {
        success: true,
        user: {
          id: profile.id,
          username: profile.username,
          email: profile.email,
          role: profile.role,
          isBlocked: profile.is_blocked,
          createdAt: profile.created_at
        }
      };
    } catch (error) {
      console.error('❌ Profile retrieval error:', error);
      
      return {
        success: false,
        message: 'Failed to get profile'
      };
    }
  }

  // Add the missing test endpoint that frontend is calling
  @Get('test')
  async testConnection() {
    console.log('🔍 Backend health check requested');
    
    try {
      // Simple health check - just return success
      return {
        success: true,
        message: 'Backend server is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };
    } catch (error) {
      console.error('❌ Health check failed:', error);
      
      return {
        success: false,
        message: 'Backend server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Request() req: AuthenticatedRequest,
    @Body() changePasswordDto: { currentPassword: string; newPassword: string }
  ) {
    try {
      console.log('🔒 Password change request from user:', req.user.userId);
      
      const result = await this.authService.changePassword(
        req.user.userId,
        changePasswordDto.currentPassword,
        changePasswordDto.newPassword
      );
      
      console.log('✅ Password change result:', result.success ? 'Success' : 'Failed');
      
      return result;
    } catch (error) {
      console.error('❌ Password change error:', error);
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to change password'
      };
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req: AuthenticatedRequest) {
    try {
      console.log('🔓 Logout request from user:', req.user.userId);
      
      const result = await this.authService.logout(req.user.userId, req.user.username);
      
      console.log('✅ Logout successful for user:', req.user.username);
      
      return {
        success: true,
        message: result.message
      };
    } catch (error) {
      console.error('❌ Logout error:', error);
      
      return {
        success: false,
        message: 'Logout failed'
      };
    }
  }

  // Admin only endpoints
  @Put('user/:userId/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateUserRole(
    @Param('userId') userId: string,
    @Body() updateRoleDto: { newRole: string },
    @Request() req: AuthenticatedRequest
  ) {
    try {
      console.log('👑 Role update request from admin:', req.user.userId, 'for user:', userId);
      
      const result = await this.authService.updateUserRole(
        parseInt(userId),
        updateRoleDto.newRole,
        req.user.userId
      );
      
      console.log('✅ Role update result:', result.success ? 'Success' : 'Failed');
      
      return result;
    } catch (error) {
      console.error('❌ Role update error:', error);
      
      return {
        success: false,
        message: 'Failed to update user role'
      };
    }
  }

  @Put('user/:userId/block')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'registrar')
  async blockUser(
    @Param('userId') userId: string,
    @Body() blockDto: { reason?: string },
    @Request() req: AuthenticatedRequest
  ) {
    try {
      console.log('🚫 Block user request from:', req.user.role, req.user.userId, 'for user:', userId);
      
      const result = await this.authService.blockUser(
        parseInt(userId),
        req.user.userId,
        blockDto.reason
      );
      
      console.log('✅ Block user result:', result.success ? 'Success' : 'Failed');
      
      return result;
    } catch (error) {
      console.error('❌ Block user error:', error);
      
      return {
        success: false,
        message: 'Failed to block user'
      };
    }
  }

  @Put('user/:userId/unblock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'registrar')
  async unblockUser(
    @Param('userId') userId: string,
    @Request() req: AuthenticatedRequest
  ) {
    try {
      console.log('✅ Unblock user request from:', req.user.role, req.user.userId, 'for user:', userId);
      
      const result = await this.authService.unblockUser(
        parseInt(userId),
        req.user.userId
      );
      
      console.log('✅ Unblock user result:', result.success ? 'Success' : 'Failed');
      
      return result;
    } catch (error) {
      console.error('❌ Unblock user error:', error);
      
      return {
        success: false,
        message: 'Failed to unblock user'
      };
    }
  }
}
