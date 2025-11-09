import { Controller, Get, Query, Param, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AuditService } from './audit.service';

interface AuthenticatedRequest {
  user: {
    userId: number;
    username: string;
    role: string;
    email: string;
  };
}

@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  /**
   * Get audit logs with filters - Admin and Registrar only
   */
  @Get()
  @Roles('admin', 'registrar')
  async getAuditLogs(
    @Query() query: any,
    @Request() req: AuthenticatedRequest
  ) {
    try {
      console.log('🔍 Audit request from user:', req.user);
      console.log('📊 Query parameters:', query);

      const filters = {
        actorId: query.actorId ? parseInt(query.actorId) : undefined,
        action: query.action,
        targetType: query.targetType,
        limit: query.limit ? parseInt(query.limit) : 100,
        page: query.page ? parseInt(query.page) : 1,
        startDate: query.startDate,
        endDate: query.endDate,
        search: query.search,
        userEmail: query.userEmail,
        role: query.role,
        category: query.category,
      };

      console.log('🔍 Processed filters:', filters);

      const result = await this.auditService.getAuditLogs(filters);
      
      // Type guard to check if result has data property
      if (result.success && 'data' in result) {
        console.log('✅ Audit logs result:', {
          success: result.success,
          recordCount: result.data.logs?.length || 0,
          total: result.data.pagination?.total || 0
        });
      } else {
        console.log('❌ Audit logs failed:', {
          success: result.success,
          message: 'message' in result ? result.message : 'Unknown error'
        });
      }

      return result;
    } catch (error) {
      console.error('❌ Error in getAuditLogs:', error);
      throw new BadRequestException('Failed to retrieve audit logs');
    }
  }

  /**
   * Get available filter options
   */
  @Get('filters')
  @Roles('admin', 'registrar')
  async getFilterOptions(@Request() req: AuthenticatedRequest) {
    try {
      console.log('🔍 Filter options request from user:', req.user);
      
      const result = await this.auditService.getFilterOptions();
      
      // Type guard to check if result has data property
      if (result.success && 'data' in result) {
        console.log('✅ Filter options result:', {
          success: result.success,
          actionsCount: result.data.actions?.length || 0,
          usersCount: result.data.users?.length || 0
        });
      } else {
        console.log('❌ Filter options failed:', {
          success: result.success,
          message: 'message' in result ? result.message : 'Unknown error'
        });
      }

      return result;
    } catch (error) {
      console.error('❌ Error in getFilterOptions:', error);
      throw new BadRequestException('Failed to retrieve filter options');
    }
  }

  /**
   * Get audit history for a specific user
   */
  @Get('user/:userId')
  @Roles('admin', 'registrar')
  async getUserAuditHistory(
    @Param('userId') userId: string,
    @Request() req: AuthenticatedRequest
  ) {
    try {
      console.log('🔍 User audit history request for userId:', userId, 'from user:', req.user);
      
      const userIdNum = parseInt(userId);
      if (isNaN(userIdNum)) {
        throw new BadRequestException('Invalid user ID');
      }

      const result = await this.auditService.getUserAuditHistory(userIdNum);
      
      // Type guard to check if result has data property
      if (result.success && 'data' in result) {
        console.log('✅ User audit history result:', {
          success: result.success,
          recordCount: result.data.logs?.length || 0
        });
      } else {
        console.log('❌ User audit history failed:', {
          success: result.success,
          message: 'message' in result ? result.message : 'Unknown error'
        });
      }

      return result;
    } catch (error) {
      console.error('❌ Error in getUserAuditHistory:', error);
      throw new BadRequestException('Failed to retrieve user audit history');
    }
  }

  /**
   * Get current user's own audit history - All authenticated users
   */
  @Get('my-history')
  async getMyAuditHistory(@Request() req: AuthenticatedRequest) {
    try {
      console.log('🔍 My audit history request from user:', req.user);
      
      const result = await this.auditService.getUserAuditHistory(req.user.userId);
      
      // Type guard to check if result has data property
      if (result.success && 'data' in result) {
        console.log('✅ My audit history result:', {
          success: result.success,
          recordCount: result.data.logs?.length || 0
        });
      } else {
        console.log('❌ My audit history failed:', {
          success: result.success,
          message: 'message' in result ? result.message : 'Unknown error'
        });
      }

      return result;
    } catch (error) {
      console.error('❌ Error in getMyAuditHistory:', error);
      throw new BadRequestException('Failed to retrieve your audit history');
    }
  }
}