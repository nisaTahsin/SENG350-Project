import { Controller, Post, Delete, Get, Param, Body, Req, UseGuards, Patch } from '@nestjs/common';
import { BookingService } from './booking.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RequestWithUser } from '../auth/request-with-user.interface';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // only staff can create bookings for a specific room/timeslot
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('staff')
  @Post()
  async createBooking(@Req() req: RequestWithUser, @Body() body: { roomId: number; timeslotId: number }) {
    // body must include { roomId: number, timeslotId: number }
    // returns booking on success; throws ConflictException on failure
    return await this.bookingService.createBooking(req.user!.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  cancelBooking(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.bookingService.cancelBooking(Number(id), req.user!.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyBookings(@Req() req: RequestWithUser) {
    return this.bookingService.getMyBookings(req.user!.id);
  }

  // new: registrars can view all bookings
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('registrar')
  @Get()
  getAllBookings() {
    return this.bookingService.getAllBookings();
  }

  // new: registrars can modify the classroom (roomId) of a booking if actualStudents < 85% of capacity
  // cannot modify the timeslot/date here
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('registrar')
  @Patch(':id/room')
  modifyBookingRoom(@Param('id') id: string, @Body() body: { newRoomId: number; actualStudents: number; capacity: number }) {
    const bookingId = Number(id);
    return this.bookingService.updateBookingRoom(bookingId, body.newRoomId, body.actualStudents, body.capacity);
  }
}
