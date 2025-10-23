import { Injectable } from '@nestjs/common';
import { AppDataSource } from '../data-source';

@Injectable()
export class MaintenanceService {
  /**
   * Create a maintenance window
   */
  async createWindow(data: {
    roomId: number;
    startTime: string;
    endTime: string;
    reason: string;
    createdBy?: number;
  }) {
    try {
      // Check if room exists
      const roomCheck = await AppDataSource.query(
        'SELECT id FROM rooms WHERE id = $1',
        [data.roomId]
      );

      if (roomCheck.length === 0) {
        return { success: false, message: 'Room not found' };
      }

      // Check for overlapping maintenance windows
      const overlapCheck = await AppDataSource.query(
        `SELECT * FROM room_maintenance
         WHERE room_id = $1
         AND tstzrange(start_time, end_time, '[]') && tstzrange($2::timestamptz, $3::timestamptz, '[]')`,
        [data.roomId, data.startTime, data.endTime]
      );

      if (overlapCheck.length > 0) {
        return {
          success: false,
          message: 'Maintenance window overlaps with existing maintenance',
          conflict: overlapCheck[0],
        };
      }

      // Create the maintenance window
      const result = await AppDataSource.query(
        `INSERT INTO room_maintenance (room_id, start_time, end_time, reason, created_by)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [data.roomId, data.startTime, data.endTime, data.reason, data.createdBy || null]
      );

      // Mark affected timeslots as unavailable
      await AppDataSource.query(
        `UPDATE timeslots
         SET is_available = false
         WHERE room_id = $1
         AND tstzrange(start_time, end_time, '[]') && tstzrange($2::timestamptz, $3::timestamptz, '[]')`,
        [data.roomId, data.startTime, data.endTime]
      );

      return {
        success: true,
        message: 'Maintenance window created successfully',
        maintenance: result[0],
      };
    } catch (error) {
      console.error('Error creating maintenance window:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: 'Failed to create maintenance window', error: message };
    }
  }

  /**
   * Get all maintenance windows with optional filters
   */
  async findAll(filters?: { roomId?: number; upcomingOnly?: boolean }) {
    try {
      let query = `
        SELECT m.*, r.room_name, r.building, u.username as created_by_name
        FROM room_maintenance m
        JOIN rooms r ON m.room_id = r.id
        LEFT JOIN users u ON m.created_by = u.id
        WHERE 1=1
      `;
      const params = [];

      if (filters?.roomId) {
        params.push(filters.roomId);
        query += ` AND m.room_id = $${params.length}`;
      }

      if (filters?.upcomingOnly) {
        query += ` AND m.end_time > NOW()`;
      }

      query += ` ORDER BY m.start_time ASC`;

      const maintenance = await AppDataSource.query(query, params);

      return {
        success: true,
        count: maintenance.length,
        maintenance,
      };
    } catch (error) {
      console.error('Error fetching maintenance windows:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: 'Failed to fetch maintenance windows', error: message };
    }
  }

  /**
   * Get maintenance windows for a specific room
   */
  async findByRoom(roomId: number) {
    try {
      const maintenance = await AppDataSource.query(
        `SELECT m.*, u.username as created_by_name
         FROM room_maintenance m
         LEFT JOIN users u ON m.created_by = u.id
         WHERE m.room_id = $1
         ORDER BY m.start_time ASC`,
        [roomId]
      );

      return {
        success: true,
        count: maintenance.length,
        maintenance,
      };
    } catch (error) {
      console.error('Error fetching maintenance for room:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: 'Failed to fetch maintenance windows', error: message };
    }
  }

  /**
   * Get upcoming maintenance windows (future only)
   */
  async findUpcoming() {
    try {
      const maintenance = await AppDataSource.query(
        `SELECT m.*, r.room_name, r.building, u.username as created_by_name
         FROM room_maintenance m
         JOIN rooms r ON m.room_id = r.id
         LEFT JOIN users u ON m.created_by = u.id
         WHERE m.end_time > NOW()
         ORDER BY m.start_time ASC`
      );

      return {
        success: true,
        count: maintenance.length,
        maintenance,
      };
    } catch (error) {
      console.error('Error fetching upcoming maintenance:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: 'Failed to fetch upcoming maintenance', error: message };
    }
  }

  /**
   * Delete a maintenance window
   */
  async deleteWindow(id: number) {
    try {
      // Get the maintenance window details before deleting
      const maintenanceResult = await AppDataSource.query(
        'SELECT * FROM room_maintenance WHERE id = $1',
        [id]
      );

      if (maintenanceResult.length === 0) {
        return { success: false, message: 'Maintenance window not found' };
      }

      const maintenance = maintenanceResult[0];

      // Delete the maintenance window
      await AppDataSource.query(
        'DELETE FROM room_maintenance WHERE id = $1',
        [id]
      );

      // Re-enable affected timeslots if no other maintenance overlaps
      await AppDataSource.query(
        `UPDATE timeslots t
         SET is_available = true
         WHERE t.room_id = $1
         AND tstzrange(t.start_time, t.end_time, '[]') && tstzrange($2::timestamptz, $3::timestamptz, '[]')
         AND NOT EXISTS (
           SELECT 1 FROM room_maintenance m
           WHERE m.room_id = t.room_id
           AND m.id != $4
           AND tstzrange(m.start_time, m.end_time, '[]') && tstzrange(t.start_time, t.end_time, '[]')
         )`,
        [maintenance.room_id, maintenance.start_time, maintenance.end_time, id]
      );

      return {
        success: true,
        message: 'Maintenance window deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting maintenance window:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: 'Failed to delete maintenance window', error: message };
    }
  }

  /**
   * Check if a time period conflicts with maintenance
   */
  async checkConflict(roomId: number, startTime: string, endTime: string) {
    try {
      const conflicts = await AppDataSource.query(
        `SELECT * FROM room_maintenance
         WHERE room_id = $1
         AND tstzrange(start_time, end_time, '[]') && tstzrange($2::timestamptz, $3::timestamptz, '[]')`,
        [roomId, startTime, endTime]
      );

      return {
        success: true,
        hasConflict: conflicts.length > 0,
        conflicts,
      };
    } catch (error) {
      console.error('Error checking maintenance conflict:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: 'Failed to check maintenance conflict', error: message };
    }
  }
}