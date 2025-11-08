import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

/**
 * Controller exposing analytics endpoints used by Registrar/Admin frontends.
 * - /analytics/dashboard
 * - /analytics/popular-rooms
 * - /analytics/booking-stats
 * - /analytics/schedule-integrity  <-- used by your Schedule Integrity UI
 */
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('daily-bookings')
  async getDailyBookings(@Query('days') days: string = '30') {
    return this.analyticsService.getDailyBookings(Number(days));
  }

  @Get('popular-rooms')
  async getPopularRooms(@Query('limit') limit: string = '10') {
    return this.analyticsService.getPopularRooms(Number(limit));
  }

  @Get('utilization-rate')
  async getUtilizationRate(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.analyticsService.getUtilizationRate(startDate, endDate);
  }

  @Get('booking-stats')
  async getBookingStats() {
    return this.analyticsService.getBookingStatsByStatus();
  }

  @Get('peak-hours')
  async getPeakHours() {
    return this.analyticsService.getPeakHours();
  }

  @Get('by-building')
  async getStatsByBuilding() {
    return this.analyticsService.getStatsByBuilding();
  }

  @Get('dashboard')
  async getDashboard() {
    return this.analyticsService.getDashboardData();
  }

  /**
   * Schedule integrity endpoint
   * Returns per-room metrics useful to detect under/over utilization and conflicts.
   *
   * Example response:
   * {
   *   success: true,
   *   rooms: [
   *     { roomName: 'ELL 160', capacity: 48, totalBookings: 5, confirmedBookings: 4, avgFill: 62.5, hasConflict: false }
   *   ]
   * }
   */
  @Get('schedule-integrity')
  async getScheduleIntegrity() {
    return this.analyticsService.getScheduleIntegrity();
  }
}
