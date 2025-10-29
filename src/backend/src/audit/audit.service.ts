import { Injectable } from '@nestjs/common';
import { AppDataSource } from '../data-source';

@Injectable()
export class AuditService {
  /**
   * Log an action to the audit trail
   */
  async logAction(
    actorId: number | undefined,
    action: string,
    targetType: string,
    targetId: number | undefined,
    metadata?: any
  ) {
    try {
      await AppDataSource.query(
        `INSERT INTO audit_logs (actor_id, action, target_type, target_id, metadata)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [actorId, action, targetType, targetId, JSON.stringify(metadata || {})]
      );
      
      console.log(`Audit: ${action} by user ${actorId} on ${targetType} ${targetId}`);
    } catch (error) {
      console.error('Error logging audit action:', error);
      // Don't throw - audit logging should not break the main operation
    }
  }

  /**
   * Get audit logs with filters
   */
  async getAuditLogs(filters?: { 
    actorId?: number; 
    action?: string;
    targetType?: string;
    limit?: number;
  }) {
    try {
      let query = `
        SELECT a.*, u.username as actor_username
        FROM audit_logs a
        LEFT JOIN users u ON a.actor_id = u.id
        WHERE 1=1
      `;
      const params: any[] = [];
      let paramIndex = 1;

      if (filters?.actorId) {
        params.push(filters.actorId);
        query += ` AND a.actor_id = $${paramIndex++}`;
      }

      if (filters?.action) {
        params.push(filters.action);
        query += ` AND a.action = $${paramIndex++}`;
      }

      if (filters?.targetType) {
        params.push(filters.targetType);
        query += ` AND a.target_type = $${paramIndex++}`;
      }

      query += ` ORDER BY a.created_at DESC`;

      if (filters?.limit) {
        params.push(filters.limit);
        query += ` LIMIT $${paramIndex++}`;
      } else {
        query += ` LIMIT 100`;
      }

      const logs = await AppDataSource.query(query, params);

      return {
        success: true,
        count: logs.length,
        logs: logs.map((log: any) => ({
          id: log.id,
          actorId: log.actor_id,
          actorUsername: log.actor_username,
          action: log.action,
          targetType: log.target_type,
          targetId: log.target_id,
          metadata: log.metadata,
          createdAt: log.created_at,
        })),
      };
    } catch (error) {
      console.error('Error getting audit logs:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: 'Failed to get audit logs', error: message };
    }
  }

  /**
   * Get audit logs for a specific user
   */
  async getUserAuditHistory(userId: number) {
    try {
      const logs = await AppDataSource.query(
        `SELECT a.*, u.username as actor_username
         FROM audit_logs a
         LEFT JOIN users u ON a.actor_id = u.id
         WHERE a.target_type = 'user' AND a.target_id = $1
         ORDER BY a.created_at DESC
         LIMIT 50`,
        [userId]
      );

      return {
        success: true,
        userId,
        count: logs.length,
        logs,
      };
    } catch (error) {
      console.error('Error getting user audit history:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: 'Failed to get user audit history', error: message };
    }
  }
}