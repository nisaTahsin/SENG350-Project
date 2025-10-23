import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';

@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  /**
   * Create a maintenance window for a room
   */
  @Post()
  async createMaintenanceWindow(
    @Body() body: {
      roomId: number;
      startTime: string;
      endTime: string;
      reason: string;
      createdBy?: number;
    }
  ) {
    return this.maintenanceService.createWindow(body);
  }

  /**
   * Get all maintenance windows
   */
  @Get()
  async getMaintenanceWindows(
    @Query('roomId') roomId?: string,
    @Query('upcoming') upcoming?: string
  ) {
    const filters = {
      roomId: roomId ? Number(roomId) : undefined,
      upcomingOnly: upcoming === 'true',
    };
    return this.maintenanceService.findAll(filters);
  }

  /**
   * Get maintenance windows for a specific room
   */
  @Get('room/:roomId')
  async getByRoom(@Param('roomId') roomId: string) {
    return this.maintenanceService.findByRoom(Number(roomId));
  }

  /**
   * Get upcoming maintenance windows
   */
  @Get('upcoming')
  async getUpcoming() {
    return this.maintenanceService.findUpcoming();
  }

  /**
   * Delete a maintenance window
   */
  @Delete(':id')
  async deleteWindow(@Param('id') id: string) {
    return this.maintenanceService.deleteWindow(Number(id));
  }

  /**
   * Check if room is under maintenance at a specific time
   */
  @Post('check')
  async checkMaintenance(
    @Body() body: {
      roomId: number;
      startTime: string;
      endTime: string;
    }
  ) {
    return this.maintenanceService.checkConflict(
      body.roomId,
      body.startTime,
      body.endTime
    );
  }
}