import { Injectable } from '@nestjs/common';
import { AppDataSource } from '../data-source';

// Add interface for database audit log result
interface AuditLogRaw {
  id: number;
  actor_id?: number;
  action: string;
  target_type?: string;
  target_id?: number;
  metadata?: any;
  created_at: Date;
  actor_username?: string;
  actor_email?: string;
  actor_role?: string;
  target_name?: string;
}

// Update interface to match frontend expectations
interface FormattedAuditLog {
  id: string;  // Changed to string to match frontend
  timestamp: string;  // Changed to string to match frontend
  user: string;
  userRole: string;
  action: string;
  details: string;
  category: string;
  targetType?: string;
  targetId?: number;
}

// Add proper return types
interface AuditLogsSuccessResponse {
  success: true;
  data: {
    logs: FormattedAuditLog[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

interface AuditLogsErrorResponse {
  success: false;
  message: string;
  error: string;
}

type AuditLogsResponse = AuditLogsSuccessResponse | AuditLogsErrorResponse;

interface FilterOptionsSuccessResponse {
  success: true;
  data: {
    actions: string[];
    targetTypes: string[];
    users: Array<{ id: number; username: string; email: string; role: string }>;
    categories: string[];
  };
}

interface FilterOptionsErrorResponse {
  success: false;
  message: string;
  error: string;
}

type FilterOptionsResponse = FilterOptionsSuccessResponse | FilterOptionsErrorResponse;

interface UserAuditHistorySuccessResponse {
  success: true;
  data: {
    userId: number;
    logs: FormattedAuditLog[];
  };
}

interface UserAuditHistoryErrorResponse {
  success: false;
  message: string;
  error: string;
}

type UserAuditHistoryResponse = UserAuditHistorySuccessResponse | UserAuditHistoryErrorResponse;

@Injectable()
export class AuditService {
  /**
   * Log an action to the audit trail with better error handling
   */
  async logAction(
    actorId: number | undefined,
    action: string,
    targetType: string,
    targetId: number | undefined,
    metadata?: any
  ) {
    try {
      // Ensure AppDataSource is initialized
      if (!AppDataSource.isInitialized) {
        console.log('⚠️ AppDataSource not initialized, attempting to initialize...');
        await AppDataSource.initialize();
      }

      console.log(`🔍 Attempting to log audit action:`, {
        actorId,
        action,
        targetType,
        targetId,
        metadata
      });

      const result = await AppDataSource.query(
        `INSERT INTO audit_logs (actor_id, action, target_type, target_id, metadata, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         RETURNING id, created_at`,
        [
          actorId || null,
          action,
          targetType || null,
          targetId || null,
          JSON.stringify(metadata || {})
        ]
      );
      
      console.log(`✅ Audit logged successfully:`, {
        auditId: result[0]?.id,
        action,
        actorId,
        targetType,
        targetId,
        timestamp: result[0]?.created_at
      });

      return result[0];
    } catch (error) {
      console.error('❌ Error logging audit action:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        actorId,
        action,
        targetType,
        targetId,
        metadata
      });
      // Don't throw - audit logging should not break the main operation
      return null;
    }
  }

  /**
   * Get audit logs with enhanced filtering - Fixed to match frontend expectations
   */
  async getAuditLogs(filters?: { 
    actorId?: number; 
    action?: string;
    targetType?: string;
    limit?: number;
    page?: number;
    startDate?: string;
    endDate?: string;
    search?: string;
    userEmail?: string;
    role?: string;
    category?: string;
  }): Promise<AuditLogsResponse> {
    try {
        console.log('🔍 getAuditLogs called with filters:', filters);
        
        // Ensure database connection
        if (!AppDataSource.isInitialized) {
          await AppDataSource.initialize();
        }
        
        const offset = ((filters?.page || 1) - 1) * (filters?.limit || 100);
        
        let query = `
            SELECT a.*, 
                   u.username as actor_username,
                   u.email as actor_email,
                   u.role as actor_role,
                   CASE 
                     WHEN a.target_type = 'user' THEN (SELECT username FROM users WHERE id = a.target_id)
                     WHEN a.target_type = 'room' THEN (SELECT room_name FROM rooms WHERE id = a.target_id)
                     WHEN a.target_type = 'booking' THEN CONCAT('Booking #', a.target_id)
                     ELSE CONCAT(a.target_type, ' #', a.target_id)
                   END as target_name
            FROM audit_logs a
            LEFT JOIN users u ON a.actor_id = u.id
            WHERE 1=1
        `;
        const params: any[] = [];
        let paramIndex = 1;

      // Filter by actor ID
      if (filters?.actorId) {
        params.push(filters.actorId);
        query += ` AND a.actor_id = $${paramIndex++}`;
      }

      // Filter by user email (frontend compatibility)
      if (filters?.userEmail) {
        params.push(filters.userEmail);
        query += ` AND u.email = $${paramIndex++}`;
      }

      // Filter by role
      if (filters?.role) {
        params.push(filters.role.toLowerCase());
        query += ` AND LOWER(u.role) = $${paramIndex++}`;
      }

      // Filter by action
      if (filters?.action) {
        const backendAction = this.mapFrontendActionToBackend(filters.action);
        params.push(backendAction);
        query += ` AND a.action = $${paramIndex++}`;
      }

      // Filter by target type
      if (filters?.targetType) {
        params.push(filters.targetType);
        query += ` AND a.target_type = $${paramIndex++}`;
      }

      // Filter by date range
      if (filters?.startDate) {
        params.push(filters.startDate + ' 00:00:00');
        query += ` AND a.created_at >= $${paramIndex++}`;
      }

      if (filters?.endDate) {
        params.push(filters.endDate + ' 23:59:59');
        query += ` AND a.created_at <= $${paramIndex++}`;
      }

      // Search functionality
      if (filters?.search) {
        const searchTerm = `%${filters.search.toLowerCase()}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        query += ` AND (
          LOWER(u.username) LIKE $${paramIndex++} OR 
          LOWER(u.email) LIKE $${paramIndex++} OR
          LOWER(a.action) LIKE $${paramIndex++} OR
          LOWER(a.metadata::text) LIKE $${paramIndex++}
        )`;
      }

      console.log('🔍 Final SQL query:', query);
      console.log('🔍 Query parameters:', params);

      // Get total count for pagination
      const countQuery = query.replace(/SELECT.*FROM/, 'SELECT COUNT(*) as total FROM');
      const countResult = await AppDataSource.query(countQuery, params);
      const totalCount = parseInt(countResult[0].total);

      console.log('📊 Total audit records found:', totalCount);

      // Add ordering and pagination
      query += ` ORDER BY a.created_at DESC`;
      params.push(filters?.limit || 100);
      query += ` LIMIT $${paramIndex++}`;
      params.push(offset);
      query += ` OFFSET $${paramIndex++}`;

      const logs: AuditLogRaw[] = await AppDataSource.query(query, params);
      
      console.log('📊 Raw logs retrieved:', logs.length);

      // Format logs to match frontend expectations exactly
      let formattedLogs: FormattedAuditLog[] = logs.map((log: AuditLogRaw) => {
        const formatted = {
          id: log.id.toString(), // Convert to string for frontend
          timestamp: log.created_at.toISOString(), // Use ISO string format
          user: log.actor_email || log.actor_username || 'System',
          userRole: this.formatRole(log.actor_role),
          action: this.mapBackendActionToFrontend(log.action),
          details: this.formatDetails(log.action, log.metadata, log.target_name),
          category: this.getActionCategory(log.action),
          targetType: log.target_type,
          targetId: log.target_id,
        };
        
        console.log('📝 Formatted log sample:', formatted);
        return formatted;
      });

      // Apply category filter post-query if specified
      if (filters?.category) {
        const originalCount = formattedLogs.length;
        formattedLogs = formattedLogs.filter(log => log.category === filters.category);
        console.log(`🔍 Category filter applied: ${originalCount} -> ${formattedLogs.length}`);
      }

      const result: AuditLogsSuccessResponse = {
        success: true,
        data: {
          logs: formattedLogs,
          pagination: {
            total: totalCount,
            page: filters?.page || 1,
            limit: filters?.limit || 100,
            totalPages: Math.ceil(totalCount / (filters?.limit || 100))
          }
        }
      };

      console.log('✅ Final result:', {
        success: result.success,
        logsCount: result.data.logs.length,
        pagination: result.data.pagination
      });

      return result;
    } catch (error) {
        console.error('❌ Error in getAuditLogs:', error);
        return { 
            success: false, 
            message: 'Failed to get audit logs', 
            error: error instanceof Error ? error.message : 'Unknown error' 
        };
    }
  }

  /**
   * Get available filter options
   */
  async getFilterOptions(): Promise<FilterOptionsResponse> {
    try {
      console.log('🔍 Getting filter options...');
      
      // Ensure database connection
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }

      const [actions, targetTypes, users] = await Promise.all([
        AppDataSource.query(`
          SELECT DISTINCT action 
          FROM audit_logs 
          WHERE created_at >= NOW() - INTERVAL '30 days'
          ORDER BY action
        `),
        AppDataSource.query(`
          SELECT DISTINCT target_type 
          FROM audit_logs 
          WHERE created_at >= NOW() - INTERVAL '30 days'
          AND target_type IS NOT NULL
          ORDER BY target_type
        `),
        AppDataSource.query(`
          SELECT DISTINCT u.id, u.username, u.email, u.role
          FROM audit_logs a
          LEFT JOIN users u ON a.actor_id = u.id
          WHERE a.created_at >= NOW() - INTERVAL '30 days'
          AND u.email IS NOT NULL
          ORDER BY u.email
        `)
      ]);

      console.log('📊 Filter options found:', {
        actions: actions.length,
        targetTypes: targetTypes.length,
        users: users.length
      });

      const result: FilterOptionsSuccessResponse = {
        success: true,
        data: {
          actions: actions.map((a: { action: string }) => this.mapBackendActionToFrontend(a.action)),
          targetTypes: targetTypes.map((t: { target_type: string }) => t.target_type).filter(Boolean),
          users: users.map((u: { id: number; username: string; email: string; role: string }) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            role: u.role
          })),
          categories: [
            'Authentication',
            'User Management', 
            'Booking Management',
            'Room Management',
            'Maintenance',
            'System Configuration',
            'Escalations'
          ]
        }
      };

      return result;
    } catch (error) {
      console.error('❌ Error getting filter options:', error);
      return { 
        success: false, 
        message: 'Failed to get filter options',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get audit logs for a specific user (enhanced)
   */
  async getUserAuditHistory(userId: number): Promise<UserAuditHistoryResponse> {
    try {
      // Ensure database connection
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }

      const logs: AuditLogRaw[] = await AppDataSource.query(
        `SELECT a.*, 
                u.username as actor_username,
                u.email as actor_email,
                u.role as actor_role,
                CASE 
                  WHEN a.target_type = 'user' THEN (SELECT username FROM users WHERE id = a.target_id)
                  WHEN a.target_type = 'room' THEN (SELECT room_name FROM rooms WHERE id = a.target_id)
                  WHEN a.target_type = 'booking' THEN CONCAT('Booking #', a.target_id)
                  ELSE CONCAT(a.target_type, ' #', a.target_id)
                END as target_name
         FROM audit_logs a
         LEFT JOIN users u ON a.actor_id = u.id
         WHERE (a.target_type = 'user' AND a.target_id = $1) OR a.actor_id = $1
         ORDER BY a.created_at DESC
         LIMIT 100`,
        [userId]
      );

      const result: UserAuditHistorySuccessResponse = {
        success: true,
        data: {
          userId,
          logs: logs.map((log: AuditLogRaw) => ({
            id: log.id.toString(),
            timestamp: log.created_at.toISOString(),
            user: log.actor_email || log.actor_username || 'System',
            userRole: this.formatRole(log.actor_role),
            action: this.mapBackendActionToFrontend(log.action),
            details: this.formatDetails(log.action, log.metadata, log.target_name),
            category: this.getActionCategory(log.action),
            targetType: log.target_type,
            targetId: log.target_id,
          }))
        }
      };

      return result;
    } catch (error) {
      console.error('❌ Error getting user audit history:', error);
      return { 
        success: false, 
        message: 'Failed to get user audit history',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Map frontend action names to backend action names
   */
  private mapFrontendActionToBackend(frontendAction: string): string {
    const actionMap: Record<string, string> = {
      'Sign-in': 'USER_LOGIN',
      'Sign-out': 'USER_LOGOUT',
      'Login Failed': 'LOGIN_FAILED',
      'Booking Created': 'BOOKING_CREATED',
      'Booking Cancelled': 'BOOKING_CANCELLED',
      'Booking Updated': 'BOOKING_UPDATED',
      'Role Changed': 'USER_ROLE_CHANGED',
      'Account Disabled': 'USER_BLOCKED',
      'Account Enabled': 'USER_UNBLOCKED',
      'Account Blocked': 'USER_BLOCKED_WITH_REASON',
      'Account Released': 'USER_UNBLOCKED',
      'Config Changed': 'SYSTEM_CONFIG_CHANGED',
      'User Created': 'USER_CREATED',
      'User Updated': 'USER_UPDATED',
      'User Deleted': 'USER_DELETED',
      'Room Created': 'ROOM_CREATED',
      'Room Updated': 'ROOM_UPDATED',
      'Room Deleted': 'ROOM_DELETED',
    };

    return actionMap[frontendAction] || frontendAction;
  }

  /**
   * Map backend action names to frontend action names
   */
  private mapBackendActionToFrontend(backendAction: string): string {
    const actionMap: Record<string, string> = {
      'USER_LOGIN': 'Sign-in',
      'USER_LOGOUT': 'Sign-out',
      'LOGIN_FAILED': 'Login Failed',
      'LOGIN_BLOCKED_ATTEMPT': 'Login Blocked',
      'BOOKING_CREATED': 'Booking Created',
      'BOOKING_CANCELLED': 'Booking Cancelled',
      'BOOKING_UPDATED': 'Booking Updated',
      'USER_ROLE_CHANGED': 'Role Changed',
      'USER_BLOCKED': 'Account Disabled',
      'USER_UNBLOCKED': 'Account Enabled',
      'USER_BLOCKED_WITH_REASON': 'Account Blocked',
      'SYSTEM_CONFIG_CHANGED': 'Config Changed',
      'USER_CREATED': 'User Created',
      'USER_UPDATED': 'User Updated',
      'USER_DELETED': 'User Deleted',
      'ROOM_CREATED': 'Room Created',
      'ROOM_UPDATED': 'Room Updated',
      'ROOM_DELETED': 'Room Deleted',
      'MAINTENANCE_CREATED': 'Maintenance Created',
      'MAINTENANCE_DELETED': 'Maintenance Deleted',
      'PASSWORD_CHANGED': 'Password Changed',
      'PASSWORD_CHANGE_FAILED': 'Password Change Failed',
    };

    return actionMap[backendAction] || backendAction.replace(/_/g, ' ').toLowerCase();
  }

  private formatRole(role: string | undefined): string {
    if (!role) return 'System';
    return role.charAt(0).toUpperCase() + role.slice(1);
  }

  private getActionCategory(action: string): string {
    if (action.includes('LOGIN') || action.includes('LOGOUT') || action.includes('PASSWORD')) {
      return 'Authentication';
    }
    if (action.includes('USER_') && !action.includes('LOGIN') && !action.includes('LOGOUT')) {
      return 'User Management';
    }
    if (action.includes('BOOKING_')) {
      return 'Booking Management';
    }
    if (action.includes('ROOM_')) {
      return 'Room Management';
    }
    if (action.includes('MAINTENANCE_')) {
      return 'Maintenance';
    }
    if (action.includes('BLOCKED') || action.includes('ESCALAT')) {
      return 'Escalations';
    }
    if (action.includes('CONFIG') || action.includes('SYSTEM')) {
      return 'System Configuration';
    }
    return 'Other';
  }

  private getActionDescription(action: string): string {
    const descriptions: Record<string, string> = {
      'USER_LOGIN': 'User logged in',
      'USER_LOGOUT': 'User logged out',
      'LOGIN_FAILED': 'Login attempt failed',
      'LOGIN_BLOCKED_ATTEMPT': 'Blocked user login attempt',
      'USER_CREATED': 'User account created',
      'USER_UPDATED': 'User profile updated',
      'USER_DELETED': 'User account deleted',
      'USER_BLOCKED': 'User account blocked',
      'USER_BLOCKED_WITH_REASON': 'User account blocked with reason',
      'USER_UNBLOCKED': 'User account unblocked',
      'USER_ROLE_CHANGED': 'User role changed',
      'PASSWORD_CHANGED': 'Password changed successfully',
      'PASSWORD_CHANGE_FAILED': 'Password change failed',
      'BOOKING_CREATED': 'Booking created',
      'BOOKING_CANCELLED': 'Booking cancelled',
      'BOOKING_UPDATED': 'Booking updated',
      'ROOM_CREATED': 'Room created',
      'ROOM_UPDATED': 'Room updated',
      'ROOM_DELETED': 'Room deleted',
      'MAINTENANCE_CREATED': 'Maintenance scheduled',
      'MAINTENANCE_DELETED': 'Maintenance cancelled',
      'AUDIT_LOGS_ACCESSED': 'Accessed audit logs',
    };
    
    return descriptions[action] || action.replace(/_/g, ' ').toLowerCase();
  }

  private formatDetails(action: string, metadata: any, targetName: string | undefined): string {
    try {
      const meta = typeof metadata === 'string' ? JSON.parse(metadata) : metadata;
      
      switch (action) {
        case 'USER_LOGIN':
          return `Successful login${meta?.role ? ` as ${meta.role}` : ''}${meta?.timestamp ? ` at ${new Date(meta.timestamp).toLocaleString()}` : ''}`;
        case 'LOGIN_FAILED':
          return `Failed login attempt${meta?.username ? ` for ${meta.username}` : ''}${meta?.reason ? `: ${meta.reason}` : ''}`;
        case 'LOGIN_BLOCKED_ATTEMPT':
          return `Blocked user attempted login${meta?.reason ? `: ${meta.reason}` : ''}`;
        case 'PASSWORD_CHANGED':
          return `Password changed successfully for ${meta?.username || 'user'}`;
        case 'PASSWORD_CHANGE_FAILED':
          return `Password change failed${meta?.reason ? `: ${meta.reason}` : ''}`;
        case 'BOOKING_CREATED':
          return `Booked ${targetName || 'room'}${meta?.timeslot ? ` for ${meta.timeslot}` : ''}`;
        case 'BOOKING_CANCELLED':
          return `Cancelled booking for ${targetName || 'room'}${meta?.reason ? `: ${meta.reason}` : ''}`;
        case 'USER_BLOCKED_WITH_REASON':
          return `Blocked user account${meta?.reason ? `: ${meta.reason}` : ''}`;
        case 'USER_ROLE_CHANGED':
          return `Changed role${meta?.old_role && meta?.new_role ? ` from ${meta.old_role} to ${meta.new_role}` : ''}`;
        case 'ROOM_CREATED':
          return `Created room ${targetName}${meta?.capacity ? ` (capacity: ${meta.capacity})` : ''}`;
        default:
          return this.getActionDescription(action);
      }
    } catch {
      return this.getActionDescription(action);
    }
  }
}