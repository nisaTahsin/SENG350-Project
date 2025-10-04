import { Controller, Post, Delete, Get, Param, Body, Req, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { AuthGuard } from '../auth/auth.guard';
import { RequestWithUser } from '../auth/request-with-user.interface';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(AuthGuard)
  @Post()
  createBooking(@Req() req: RequestWithUser, @Body() body: any) {
    return this.bookingService.createBooking(req.user!.id, body);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  cancelBooking(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.bookingService.cancelBooking(Number(id), req.user!.id);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getMyBookings(@Req() req: RequestWithUser) {
    return this.bookingService.getMyBookings(req.user!.id);
  }
}
