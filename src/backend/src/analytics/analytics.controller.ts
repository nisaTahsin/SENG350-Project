import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * Get daily bookings count for the last N days
   * Returns data suitable for charts (date, count pairs)
   */
  @Get('daily-bookings')
  async getDailyBookings(@Query('days') days: string = '30') {
    return this.analyticsService.getDailyBookings(Number(days));
  }

  /**
   * Get top N most popular rooms by booking count
   */
  @Get('popular-rooms')
  async getPopularRooms(@Query('limit') limit: string = '10') {
    return this.analyticsService.getPopularRooms(Number(limit));
  }

  /**
   * Get overall system utilization rate
   * Percentage of available time slots that are booked
   */
  @Get('utilization-rate')
  async getUtilizationRate(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.analyticsService.getUtilizationRate(startDate, endDate);
  }

  /**
   * Get booking statistics by status
   */
  @Get('booking-stats')
  async getBookingStats() {
    return this.analyticsService.getBookingStatsByStatus();
  }

  /**
   * Get peak usage hours (most popular booking times)
   */
  @Get('peak-hours')
  async getPeakHours() {
    return this.analyticsService.getPeakHours();
  }

  /**
   * Get building-wise statistics
   */
  @Get('by-building')
  async getStatsByBuilding() {
    return this.analyticsService.getStatsByBuilding();
  }

  /**
   * Get comprehensive dashboard data
   * Returns all key metrics in one call
   */
  @Get('dashboard')
  async getDashboard() {
    return this.analyticsService.getDashboardData();
  }
}