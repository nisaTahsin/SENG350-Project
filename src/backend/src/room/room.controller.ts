import { Controller, Get, Param, Post, Patch, Delete, Body } from '@nestjs/common';
import { RoomsService } from './room.service';
import { RoomImportService } from './room-import.service';
import { CreateTimeslotDto } from '../timeslot/dto/create-timeslot.dto';
import { UpdateTimeslotDto } from '../timeslot/dto/update-timeslot.dto';

@Controller('rooms')
export class RoomsController {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly roomImportService: RoomImportService,
  ) {}

  // Rooms
  @Get()
  findAllRooms() {
    return this.roomsService.findAllRooms();
  }

  @Get(':id')
  findRoom(@Param('id') id: string) {
    return this.roomsService.findRoomById(+id);
  }

  // Timeslots
  @Post(':id/timeslots')
  createTimeslot(@Param('id') roomId: string, @Body() dto: CreateTimeslotDto) {
    return this.roomsService.createTimeslot({ ...dto, roomId: +roomId });
  }

  @Patch('timeslots/:id')
  updateTimeslot(@Param('id') id: string, @Body() dto: UpdateTimeslotDto) {
    return this.roomsService.updateTimeslot(+id, dto);
  }

  @Delete('timeslots/:id')
  deleteTimeslot(@Param('id') id: string) {
    return this.roomsService.deleteTimeslot(+id);
  }

  @Get(':id/timeslots')
  findTimeslots(@Param('id') roomId: string) {
    return this.roomsService.findTimeslotsByRoom(+roomId);
  }

  // Import CSV data
  @Post('import')
  async importRooms() {
    const rooms = await this.roomImportService.importRoomsFromCSV();
    return { message: `Successfully imported ${rooms.length} rooms`, rooms };
  }

  @Get('count')
  async getRoomCount() {
    const count = await this.roomImportService.getRoomCount();
    return { count };
  }

  // Generate sample timeslots for all rooms
  @Post('generate-timeslots')
  async generateTimeslots() {
    const timeslots = await this.roomsService.generateSampleTimeslots();
    return { message: `Generated ${timeslots.length} timeslots`, timeslots };
  }

  // Simple endpoint to get bookings using raw SQL
  @Get('bookings/simple')
  async getSimpleBookings() {
    try {
      console.log('Getting simple bookings...');
      const bookings = await this.roomsService.getSimpleBookings();
      console.log('Found simple bookings:', bookings.length);
      return { success: true, count: bookings.length, bookings };
    } catch (error) {
      console.log('Error getting simple bookings:', error);
      return { success: false, message: 'Failed to get simple bookings', error: error.message };
    }
  }

  // Generate timeslots for a specific date
  @Post('timeslots/generate-for-date')
  async generateTimeslotsForDate(@Body() body: { date: string }) {
    try {
      console.log('Generating timeslots for date:', body.date);
      const timeslots = await this.roomsService.generateTimeslotsForDate(body.date);
      console.log('Generated timeslots:', timeslots.length);
      return { success: true, count: timeslots.length, timeslots };
    } catch (error) {
      console.log('Error generating timeslots for date:', error);
      return { success: false, message: 'Failed to generate timeslots', error: error.message };
    }
  }
}
