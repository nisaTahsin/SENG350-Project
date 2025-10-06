import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RequestWithUser } from '../auth/request-with-user.interface';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // staff can create bookings only for themselves
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('staff')
  @Post()
  async createBooking(
    @Req() req: RequestWithUser,
    @Body()
    body: {
      roomId: number;
      timeslotId: number;
      title?: string;
      description?: string;
    },
  ) {
    return this.bookingService.createBooking(req.user!.id, body);
  }

  // Test endpoint without authentication for development
  @Post('test')
  async createTestBooking(
    @Body()
    body: {
      roomId: number;
      timeslotId: number;
      title?: string;
      description?: string;
    },
  ) {
    // For now, just return a success message without actually creating a booking
    return {
      message: 'Booking test successful!',
      data: {
        roomId: body.roomId,
        title: body.title,
        description: body.description,
        status: 'test_booking'
      }
    };
  }

  // staff can cancel their own bookings; registrar/admin can cancel any
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async cancelBooking(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.bookingService.cancelBooking(Number(id), req.user!.id, req.user!.role);
  }

  // staff can view their own bookings
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyBookings(@Req() req: RequestWithUser) {
    return this.bookingService.getMyBookings(req.user!.id);
  }

  // registrar can view all bookings
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('registrar')
  @Get()
  getAllBookings() {
    return this.bookingService.getAllBookings();
  }

  // registrar can reassign room if occupancy < 85%
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('registrar')
  @Patch(':id/room')
  modifyBookingRoom(
    @Param('id') id: string,
    @Body()
    body: { newRoomId: number; actualStudents: number; capacity: number },
  ) {
    return this.bookingService.updateBookingRoom(
      Number(id),
      body.newRoomId,
      body.actualStudents,
      body.capacity,
    );
  }
}
