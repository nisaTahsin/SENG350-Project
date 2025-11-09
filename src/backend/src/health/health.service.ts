import { Injectable } from '@nestjs/common';
import { AppDataSource } from '../data-source';

@Injectable()
export class HealthService {
  async dbStartTime(): Promise<{ db_start: string | null }> {
    try {
      const res = await AppDataSource.query(`SELECT pg_postmaster_start_time() AS db_start;`);
      return { db_start: res[0]?.db_start ?? null };
    } catch (err) {
      return { db_start: null };
    }
  }

  /**
   * Count failed booking attempts recorded in audit_logs.
   * Returns { count, last_failed_at } where last_failed_at is ISO timestamp or null.
   */
  async failedBookingsCount(): Promise<{ count: number; last_failed_at: string | null }> {
    try {
      // make sure datasource is initialized
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }
      const res = await AppDataSource.query(`
        SELECT COUNT(*)::int AS cnt, MAX(created_at) AS last_at
        FROM audit_logs
        WHERE action = $1
      `, ['BOOKING_CREATION_FAILED']);

      const count = res[0]?.cnt ?? 0;
      const lastAt = res[0]?.last_at ? new Date(res[0].last_at).toISOString() : null;
      return { count, last_failed_at: lastAt };
    } catch (err) {
      return { count: 0, last_failed_at: null };
    }
  }
}