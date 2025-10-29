import { Injectable } from '@nestjs/common';
import { AppDataSource } from '../data-source';

@Injectable()
export class AnalyticsService {
  async getDailyBookings(days: number = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const result = await AppDataSource.query(
        `SELECT 
          DATE(b.created_at) as date,
          COUNT(*) as count
         FROM bookings b
         WHERE b.created_at >= $1
         AND b.status = 'confirmed'
         GROUP BY DATE(b.created_at)
         ORDER BY date ASC`,
        [startDate.toISOString()]
      );

      return {
        success: true,
        period: {
          days,
          startDate: startDate.toISOString(),
          endDate: new Date().toISOString(),
        },
        data: result.map((row: any) => ({
          date: row.date,
          count: parseInt(row.count),
        })),
      };
    } catch (error) {
      console.error('Error getting daily bookings:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: 'Failed to get daily bookings', error: message };
    }
  }

  async getPopularRooms(limit: number = 10) {
    try {
      const result = await AppDataSource.query(
        `SELECT 
          r.id,
          r.room_name,
          r.building,
          r.capacity,
          COUNT(b.id) as booking_count
         FROM rooms r
         LEFT JOIN bookings b ON r.id = b.room_id AND b.status = 'confirmed'
         GROUP BY r.id, r.room_name, r.building, r.capacity
         ORDER BY booking_count DESC
         LIMIT $1`,
        [limit]
      );

      return {
        success: true,
        count: result.length,
        rooms: result.map((row: any) => ({
          id: row.id,
          name: row.room_name,
          building: row.building,
          capacity: row.capacity,
          bookingCount: parseInt(row.booking_count),
        })),
      };
    } catch (error) {
      console.error('Error getting popular rooms:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: 'Failed to get popular rooms', error: message };
    }
  }

  async getUtilizationRate(startDate?: string, endDate?: string) {
    try {
      const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const end = endDate || new Date().toISOString();

      const totalSlotsResult = await AppDataSource.query(
        `SELECT COUNT(*) as total
         FROM timeslots
         WHERE start_time >= $1
         AND end_time <= $2`,
        [start, end]
      );

      const bookedSlotsResult = await AppDataSource.query(
        `SELECT COUNT(*) as booked
         FROM bookings b
         JOIN timeslots t ON b.timeslot_id = t.id
         WHERE b.status = 'confirmed'
         AND t.start_time >= $1
         AND t.end_time <= $2`,
        [start, end]
      );

      const totalSlots = parseInt(totalSlotsResult[0].total);
      const bookedSlots = parseInt(bookedSlotsResult[0].booked);
      const utilizationRate = totalSlots > 0 ? (bookedSlots / totalSlots) * 100 : 0;

      return {
        success: true,
        period: {
          startDate: start,
          endDate: end,
        },
        stats: {
          totalSlots,
          bookedSlots,
          availableSlots: totalSlots - bookedSlots,
          utilizationRate: parseFloat(utilizationRate.toFixed(2)),
        },
      };
    } catch (error) {
      console.error('Error getting utilization rate:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: 'Failed to get utilization rate', error: message };
    }
  }

  async getBookingStatsByStatus() {
    try {
      const result = await AppDataSource.query(
        `SELECT 
          status,
          COUNT(*) as count
         FROM bookings
         GROUP BY status
         ORDER BY count DESC`
      );

      const totalBookings = result.reduce((sum: number, row: any) => sum + parseInt(row.count), 0);

      return {
        success: true,
        total: totalBookings,
        byStatus: result.map((row: any) => ({
          status: row.status,
          count: parseInt(row.count),
          percentage: totalBookings > 0 
            ? parseFloat(((parseInt(row.count) / totalBookings) * 100).toFixed(2))
            : 0,
        })),
      };
    } catch (error) {
      console.error('Error getting booking stats by status:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: 'Failed to get booking stats', error: message };
    }
  }

  async getPeakHours() {
    try {
      const result = await AppDataSource.query(
        `SELECT 
          EXTRACT(HOUR FROM t.start_time) as hour,
          COUNT(b.id) as booking_count
         FROM timeslots t
         LEFT JOIN bookings b ON t.id = b.timeslot_id AND b.status = 'confirmed'
         WHERE b.id IS NOT NULL
         GROUP BY EXTRACT(HOUR FROM t.start_time)
         ORDER BY booking_count DESC
         LIMIT 10`
      );

      return {
        success: true,
        peakHours: result.map((row: any) => ({
          hour: parseInt(row.hour),
          timeLabel: `${row.hour}:00 - ${parseInt(row.hour) + 1}:00`,
          bookingCount: parseInt(row.booking_count),
        })),
      };
    } catch (error) {
      console.error('Error getting peak hours:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: 'Failed to get peak hours', error: message };
    }
  }

  async getStatsByBuilding() {
    try {
      const result = await AppDataSource.query(
        `SELECT 
          r.building,
          COUNT(DISTINCT r.id) as room_count,
          COUNT(b.id) as booking_count,
          COALESCE(AVG(r.capacity), 0) as avg_capacity
         FROM rooms r
         LEFT JOIN bookings b ON r.id = b.room_id AND b.status = 'confirmed'
         GROUP BY r.building
         ORDER BY booking_count DESC`
      );

      return {
        success: true,
        count: result.length,
        buildings: result.map((row: any) => ({
          building: row.building,
          roomCount: parseInt(row.room_count),
          bookingCount: parseInt(row.booking_count),
          averageCapacity: parseFloat(parseFloat(row.avg_capacity).toFixed(0)),
        })),
      };
    } catch (error) {
      console.error('Error getting stats by building:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: 'Failed to get building stats', error: message };
    }
  }

  async getDashboardData() {
    try {
      const [
        dailyBookings,
        popularRooms,
        utilizationRate,
        bookingStats,
        peakHours,
        buildingStats,
      ] = await Promise.all([
        this.getDailyBookings(7),
        this.getPopularRooms(5),
        this.getUtilizationRate(),
        this.getBookingStatsByStatus(),
        this.getPeakHours(),
        this.getStatsByBuilding(),
      ]);

      return {
        success: true,
        timestamp: new Date().toISOString(),
        dashboard: {
          dailyBookings,
          popularRooms,
          utilizationRate,
          bookingStats,
          peakHours,
          buildingStats,
        },
      };
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: 'Failed to get dashboard data', error: message };
    }
  }
}