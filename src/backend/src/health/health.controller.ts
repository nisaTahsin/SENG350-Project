import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('db')
  async db() {
    return this.healthService.dbStartTime();
  }

  /**
   * GET /health/failed-bookings
   * Returns the number of failed booking attempts recorded in audit_logs and last failure timestamp.
   */
  @Get('failed-bookings')
  async failedBookings() {
    return this.healthService.failedBookingsCount();
  }
}