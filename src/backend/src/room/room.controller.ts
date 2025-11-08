import { Controller, Get, Param, Post, Patch, Delete, Body, Put, Query } from '@nestjs/common';
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

  // ========== GET ROUTES (specific paths first) ==========
  
  @Get('count')
  async getRoomCount() {
    const count = await this.roomImportService.getRoomCount();
    return { count };
  }

  @Get('bookings/simple')
  async getSimpleBookings() {
    try {
      console.log('Getting simple bookings...');
      const bookings = await this.roomsService.getSimpleBookings();
      console.log('Found simple bookings:', bookings.length);
      return { success: true, count: bookings.length, bookings };
    } catch (error) {
      console.log('Error getting simple bookings:', error);
      return { success: false, message: 'Failed to get simple bookings', error: (error as Error).message };
    }
  }

  @Get()
  findAllRooms() {
    return this.roomsService.findAllRooms();
  }

  // ========== NEW REGISTRAR ENDPOINTS (before :id routes) ==========
  
  @Get(':id/utilization')
  async getRoomUtilization(
    @Param('id') id: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.roomsService.getRoomUtilization(+id, startDate, endDate);
  }

  @Get(':id/timeslots')
  findTimeslots(@Param('id') roomId: string) {
    return this.roomsService.findTimeslotsByRoom(+roomId);
  }

  @Get(':id')
  findRoom(@Param('id') id: string) {
    return this.roomsService.findRoomById(+id);
  }

  @Put(':id')
  async updateRoom(
    @Param('id') id: string,
    @Body() body: {
      capacity?: number;
      isActive?: boolean;
      openHours?: string;
      roomName?: string;
      building?: string;
    }
  ) {
    return this.roomsService.updateRoom(+id, body);
  }

  @Patch(':id/capacity')
  async updateCapacity(
    @Param('id') id: string,
    @Body() body: { capacity: number }
  ) {
    return this.roomsService.updateCapacity(+id, body.capacity);
  }

  @Patch(':id/status')
  async toggleRoomStatus(
    @Param('id') id: string,
    @Body() body: { isActive: boolean }
  ) {
    return this.roomsService.toggleStatus(+id, body.isActive);
  }

  // ========== POST ROUTES ==========

  @Post('import')
  async importRooms() {
    const rooms = await this.roomImportService.importRoomsFromCSV();
    return { message: `Successfully imported ${rooms.length} rooms`, rooms };
  }

  @Post('generate-timeslots')
  async generateTimeslots() {
    const timeslots = await this.roomsService.generateSampleTimeslots();
    return { message: `Generated ${timeslots.length} timeslots`, timeslots };
  }

  @Post('timeslots/generate-for-date')
  async generateTimeslotsForDate(@Body() body: { date: string }) {
    try {
      console.log('Generating timeslots for date:', body.date);
      const timeslots = await this.roomsService.generateTimeslotsForDate(body.date);
      console.log('Generated timeslots:', timeslots.length);
      return { success: true, count: timeslots.length, timeslots };
    } catch (error) {
      console.log('Error generating timeslots for date:', error);
      return { success: false, message: 'Failed to generate timeslots', error: (error as Error).message };
    }
  }

  @Post(':id/timeslots')
  createTimeslot(@Param('id') roomId: string, @Body() dto: CreateTimeslotDto) {
    return this.roomsService.createTimeslot({ ...dto, roomId: +roomId });
  }

  @Post()
async createRoom(
  @Body() body: { room_name: string; building: string; capacity: number }
) {
  try {
    console.log('Creating room:', body);
    const room = await this.roomsService.createRoom({
      room_name: body.room_name,
      building: body.building,
      capacity: Number(body.capacity),
    });
    return { success: true, room };
  } catch (error) {
    console.log('Error creating room:', error);
    return {
      success: false,
      message: 'Failed to create room',
      error: (error as Error).message,
    };
  }
}



  // ========== TIMESLOT MANAGEMENT ==========

  @Patch('timeslots/:id')
  updateTimeslot(@Param('id') id: string, @Body() dto: UpdateTimeslotDto) {
    return this.roomsService.updateTimeslot(+id, dto);
  }

   @Delete('timeslots/:id')
  deleteTimeslot(@Param('id') id: string) {
    return this.roomsService.deleteTimeslot(+id);
  }

  @Delete(':id')
async deleteRoom(@Param('id') id: string) {
  try {
    console.log('Deleting room with ID:', id);
    const result = await this.roomsService.deleteRoom(+id);
    return result; // no duplicate 'success'
  } catch (error) {
    console.error('Error deleting room:', error);
    return {
      success: false,
      message: 'Failed to delete room',
      error: (error as Error).message,
    };
  }
}


}