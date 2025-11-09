import { Controller, Get, Post, Delete, Param, Body, Query } from '@nestjs/common';
import { TimeslotService } from './timeslot.service';
import { Timeslot } from './timeslot.entity';

@Controller('timeslots')
export class TimeslotController {
  constructor(private readonly timeslotService: TimeslotService) {}

  /**
   * Get all timeslots for a given room (and optionally by date)
   * Example: GET /timeslots?roomId=1&date=2025-11-09
   */
  @Get()
  async getTimeslots(
    @Query('roomId') roomId: number,
    @Query('date') date?: string
  ): Promise<Timeslot[]> {
    if (!roomId) {
      throw new Error('roomId is required');
    }

    if (date) {
      return this.timeslotService.getTimeslotsByRoomAndDate(roomId, date);
    }

    return this.timeslotService.getTimeslotsByRoom(roomId);
  }

  /**
   * Create a new timeslot for a room
   * Example: POST /timeslots
   * Body: { "roomId": 1, "startTime": "2025-11-09T09:00:00Z", "endTime": "2025-11-09T10:00:00Z" }
   */
  @Post()
  async createTimeslot(
    @Body() body: { roomId: number; startTime: Date; endTime: Date }
  ): Promise<Timeslot> {
    const { roomId, startTime, endTime } = body;
    if (!roomId || !startTime || !endTime) {
      throw new Error('Missing required fields: roomId, startTime, endTime');
    }

    return this.timeslotService.createTimeslot(roomId, new Date(startTime), new Date(endTime));
  }

  /**
   * Delete a timeslot by ID
   * Example: DELETE /timeslots/5
   */
  @Delete(':id')
  async deleteTimeslot(@Param('id') id: number): Promise<{ message: string }> {
    await this.timeslotService.deleteTimeslot(id);
    return { message: `Timeslot ${id} deleted successfully` };
  }
}
