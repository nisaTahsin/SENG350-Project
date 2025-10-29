import { Controller, Get, Query, Param } from '@nestjs/common';
import { AuditService } from './audit.service';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  /**
   * Get audit logs with optional filters
   */
  @Get()
  async getAuditLogs(
    @Query('actorId') actorId?: string,
    @Query('action') action?: string,
    @Query('targetType') targetType?: string,
    @Query('limit') limit?: string
  ) {
    const filters = {
      actorId: actorId ? Number(actorId) : undefined,
      action,
      targetType,
      limit: limit ? Number(limit) : 100,
    };

    return this.auditService.getAuditLogs(filters);
  }

  /**
   * Get audit history for a specific user
   */
  @Get('user/:userId')
  async getUserAuditHistory(@Param('userId') userId: string) {
    return this.auditService.getUserAuditHistory(Number(userId));
  }
}