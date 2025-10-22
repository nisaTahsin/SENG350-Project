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
      console.log('Creating booking with body:', body);
      
      // Extract user ID from JWT token
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('No authorization token provided');
        return { success: false, message: 'No authorization token provided' };
      }

      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecret') as any;
      const userId = decoded.sub;
      
      console.log('User ID from token:', userId);

      const result = await this.bookingService.createBooking(userId, body);
      console.log('Booking created successfully:', result);
      return result;
    } catch (error) {
      console.log('Error creating booking:', error);
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

  // Get bookings for a specific room
  @Get('room/:roomId')
  async getBookingsForRoom(@Param('roomId') roomId: string) {
    try {
      console.log('Getting bookings for room:', roomId);
      const bookings = await this.bookingService.findByRoomId(Number(roomId));
      console.log('Found bookings:', bookings.length);
      return { success: true, bookings };
    } catch (error) {
      console.log('Error getting bookings for room:', error);
      return { success: false, message: 'Failed to get bookings' };
    }
  }

  // Get bookings for a specific room with user details
  @Get('room/:roomId/with-user')
  async getBookingsForRoomWithUser(@Param('roomId') roomId: string) {
    try {
      console.log('Getting bookings for room with user details:', roomId);
      const bookings = await this.bookingService.findByRoomIdWithUser(Number(roomId));
      console.log('Found bookings with user details:', bookings.length);
      return { success: true, bookings };
    } catch (error) {
      console.log('Error getting bookings for room with user details:', error);
      return { success: false, message: 'Failed to get bookings' };
    }
  }

  // Get all bookings
  @Get()
  async getAllBookings() {
    try {
      console.log('Getting all bookings');
      const bookings = await this.bookingService.findAll();
      console.log('Found bookings:', bookings.length);
      return { success: true, bookings };
    } catch (error) {
      console.log('Error getting all bookings:', error);
      return { success: false, message: 'Failed to get bookings' };
    }
  }

  @Get('me')
  getMyBookings() {
    return { message: 'My bookings endpoint', bookings: [] };
  }

  // Simple test endpoint to get raw bookings
  @Get('test-all')
  async getTestBookings() {
    try {
      console.log('Getting test bookings...');
      const bookings = await this.bookingService.findAll();
      console.log('Found test bookings:', bookings.length);
      return { success: true, count: bookings.length, bookings };
    } catch (error) {
      console.log('Error getting test bookings:', error);
      return { success: false, message: 'Failed to get test bookings', error: (error as Error).message };
    }
  }

  @Delete(':id')
  async cancelBooking(@Param('id') id: string) {
    return { message: `Booking ${id} cancelled` };
  }
}
