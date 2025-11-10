import { Controller, Get, Query, Param, BadRequestException } from '@nestjs/common';
import { AuditService } from './audit.service';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  async getAuditLogs(@Query() query: any) {
    try {
      console.log('🔍 Public audit request');
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


  @Get('filters')
  async getFilterOptions() {
    try {
      console.log('🔍 Public filter options request');
      
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

  @Get('user/:userId')
  async getUserAuditHistory(@Param('userId') userId: string) {
    try {
      console.log('🔍 Public user audit history request for userId:', userId);
      
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
}