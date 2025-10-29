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
      const message = error instanceof Error ? error.message : 'Invalid or expired token';
      return { success: false, message };
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

  // ========== CANCELLATION & ROLLBACK ENDPOINTS ==========

  /**
   * Cancel a booking (staff can cancel own bookings)
   */
  @Post(':id/cancel')
  async cancelBookingWithStatus(
    @Param('id') id: string,
    @Req() req: any
  ) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { success: false, message: 'No authorization token provided' };
      }

      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecret') as any;
      const userId = decoded.sub;

      return this.bookingService.cancelBookingWithStatus(Number(id), userId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid token';
      return { success: false, message };
    }
  }

  /**
   * Rollback/undo a cancellation (within 10 minute window)
   */
  @Post(':id/rollback')
  async rollbackCancellation(
    @Param('id') id: string,
    @Req() req: any
  ) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { success: false, message: 'No authorization token provided' };
      }

      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecret') as any;
      const userId = decoded.sub;

      return this.bookingService.rollbackCancellation(Number(id), userId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid token';
      return { success: false, message };
    }
  }

  /**
   * Force release a booking (Registrar only)
   */
  @Post(':id/force-release')
  async forceRelease(
    @Param('id') id: string,
    @Body() body: { reason: string },
    @Req() req: any
  ) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { success: false, message: 'No authorization token provided' };
      }

      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecret') as any;
      const registrarId = decoded.sub;

      // TODO: Add role check here to ensure user is registrar

      return this.bookingService.forceReleaseBooking(Number(id), registrarId, body.reason);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid token';
      return { success: false, message };
    }
  }


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