import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  Patch,
  Req,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import * as jwt from 'jsonwebtoken';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // Create booking with user authentication
  @Post()
  async createBooking(
    @Body()
    body: {
      roomId: number;
      timeslotId: number;
      notes?: string;
    },
    @Req() req: any,
  ) {
    try {
      // Extract user ID from JWT token
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { success: false, message: 'No authorization token provided' };
      }

      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecret') as any;
      const userId = decoded.sub;

      return this.bookingService.createBooking(userId, body);
    } catch (error) {
      return { success: false, message: 'Invalid or expired token' };
    }
  }

  // Test endpoint without authentication for development
  @Post('test')
  async createTestBooking(
    @Body()
    body: {
      roomId: number;
      timeslotId: number;
      notes?: string;
    },
  ) {
    // For now, just return a success message without actually creating a booking
    return {
      message: 'Booking test successful!',
      data: {
        roomId: body.roomId,
        timeslotId: body.timeslotId,
        notes: body.notes,
        status: 'test_booking'
      }
    };
  }

  // Simple endpoints without authentication for now
  @Get()
  getAllBookings() {
    return { message: 'All bookings endpoint', bookings: [] };
  }

  @Get('me')
  getMyBookings() {
    return { message: 'My bookings endpoint', bookings: [] };
  }

  @Delete(':id')
  async cancelBooking(@Param('id') id: string) {
    return { message: `Booking ${id} cancelled` };
  }
}
