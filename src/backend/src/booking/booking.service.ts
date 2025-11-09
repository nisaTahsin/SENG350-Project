import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { Timeslot } from '../timeslot/timeslot.entity';
import { AppDataSource } from '../data-source';
import { AuditService } from '../audit/audit.service';

/**
 * simple keyed mutex to serialize operations per room+timeslot
 * (still useful to prevent duplicate inserts before DB unique constraint fires)
 */
class KeyedMutex {
  private locks = new Map<string, Promise<void>>();

  async runExclusive<T>(key: string, fn: () => Promise<T> | T): Promise<T> {
    const previous = this.locks.get(key) ?? Promise.resolve();
    let release!: () => void;
    const current = previous.then(() => new Promise<void>(res => (release = res)));
    this.locks.set(key, current);

    try {
      await previous;
      return await fn();
    } finally {
      release();
      if (this.locks.get(key) === current) {
        this.locks.delete(key);
      }
    }
  }
}

@Injectable()
export class BookingService {
  private mutex = new KeyedMutex();

  constructor(
    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,
    @InjectRepository(Timeslot)
    private readonly timeslotRepository: Repository<Timeslot>,
    private readonly auditService: AuditService,
  ) {}

  /**
   * Create booking with conflict protection.
   */
  async createBooking(userId: number, data: Partial<Booking>): Promise<Booking> {
    if (typeof data.roomId !== 'number' || typeof data.timeslotId !== 'number') {
      throw new ConflictException('roomId and timeslotId are required (numbers)');
    }

    // Enforce booking window: not in the past and not more than 7 days in advance
    const ts = await this.timeslotRepository.findOne({ where: { id: data.timeslotId } });
    if (!ts) {
      throw new NotFoundException('Timeslot not found');
    }
    const now = new Date();
    const start = new Date(ts.startTime);
    const end = new Date(ts.endTime);
    if (end.getTime() <= now.getTime()) {
      throw new ForbiddenException('Cannot book a past timeslot');
    }
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    if (start.getTime() - now.getTime() > sevenDaysMs) {
      throw new ForbiddenException('Bookings more than 7 days in advance are not allowed');
    }

    const key = `${data.roomId}:${data.timeslotId}`;

    return this.mutex.runExclusive(key, async () => {
      const booking = this.bookingsRepository.create({
        userId,
        roomId: data.roomId!,
        timeslotId: data.timeslotId!,
        status: 'confirmed',
        notes: data.notes,
      });

      try {
        const savedBooking = await this.bookingsRepository.save(booking);
        
        // Log successful booking creation
        await this.auditService.logAction(
          userId,
          'BOOKING_CREATED',
          'booking',
          savedBooking.id,
          { roomId: savedBooking.roomId, timeslotId: savedBooking.timeslotId, status: savedBooking.status }
        );
        
        return savedBooking;
      } catch (err: any) {
        // Log failed booking creation
        await this.auditService.logAction(
          userId,
          'BOOKING_CREATION_FAILED',
          'booking',
          undefined,
          { roomId: data.roomId, timeslotId: data.timeslotId, error: err.message }
        );
        
        if (err.code === '23505') {
          throw new ConflictException('Timeslot already booked for this room');
        }
        throw err;
      }
    });
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(id: number, userId: number, userRole: string): Promise<void> {
    const booking = await this.bookingsRepository.findOne({ where: { id } });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (userRole === 'staff' && booking.userId !== userId) {
      throw new ForbiddenException('You cannot cancel another user booking');
    }

    if (userRole === 'registrar' || userRole === 'admin') {
      await this.bookingsRepository.delete(id);
      
      // Log booking cancellation by registrar/admin
      await this.auditService.logAction(
        userId,
        'BOOKING_CANCELLED_BY_ADMIN',
        'booking',
        id,
        { originalUserId: booking.userId, cancelledBy: userId, userRole }
      );
      return;
    }

    if (userRole === 'staff' && booking.userId === userId) {
      await this.bookingsRepository.delete(id);
      
      // Log booking cancellation by owner
      await this.auditService.logAction(
        userId,
        'BOOKING_CANCELLED',
        'booking',
        id,
        { roomId: booking.roomId, timeslotId: booking.timeslotId }
      );
      return;
    }

    throw new ForbiddenException('You do not have permission to cancel this booking');
  }

  // ========== CANCELLATION & ROLLBACK METHODS ==========

  /**
   * Cancel a booking (soft delete with status change)
   */
  async cancelBookingWithStatus(bookingId: number, userId: number) {
    try {
      const bookingResult = await AppDataSource.query(
        'SELECT * FROM bookings WHERE id = $1',
        [bookingId]
      );

      if (bookingResult.length === 0) {
        return { success: false, message: 'Booking not found' };
      }

      const booking = bookingResult[0];

      if (booking.user_id !== userId) {
        return { success: false, message: 'Unauthorized: This booking does not belong to you' };
      }

      if (booking.status === 'cancelled') {
        return { success: false, message: 'Booking is already cancelled' };
      }

      await AppDataSource.query(
        `UPDATE bookings 
         SET status = 'cancelled', cancelled_at = NOW()
         WHERE id = $1`,
        [bookingId]
      );

      // Log booking cancellation with status
      await this.auditService.logAction(
        userId,
        'BOOKING_CANCELLED_WITH_STATUS',
        'booking',
        bookingId,
        { previousStatus: booking.status, roomId: booking.room_id, timeslotId: booking.timeslot_id }
      );

      return {
        success: true,
        message: 'Booking cancelled successfully',
        bookingId,
        canRollback: true,
        rollbackWindowMinutes: 10,
      };
    } catch (error) {
      console.error('Error cancelling booking:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: 'Failed to cancel booking', error: message };
    }
  }

  /**
   * Rollback/undo a cancellation (within 10 minute window)
   */
  async rollbackCancellation(bookingId: number, userId: number) {
    try {
      const bookingResult = await AppDataSource.query(
        'SELECT * FROM bookings WHERE id = $1',
        [bookingId]
      );

      if (bookingResult.length === 0) {
        return { success: false, message: 'Booking not found' };
      }

      const booking = bookingResult[0];

      if (booking.user_id !== userId) {
        return { success: false, message: 'Unauthorized: This booking does not belong to you' };
      }

      if (booking.status !== 'cancelled') {
        return { success: false, message: 'Booking is not cancelled' };
      }

      // Check if within rollback window (10 minutes)
      const cancelledAt = new Date(booking.cancelled_at);
      const now = new Date();
      const minutesSinceCancellation = (now.getTime() - cancelledAt.getTime()) / 1000 / 60;

      if (minutesSinceCancellation > 10) {
        return {
          success: false,
          message: 'Rollback window expired (10 minutes)',
          minutesSinceCancellation: Math.round(minutesSinceCancellation),
        };
      }

      // Check if timeslot is still available
      const conflictCheck = await AppDataSource.query(
        `SELECT id FROM bookings 
         WHERE timeslot_id = $1 
         AND status = 'confirmed' 
         AND id != $2`,
        [booking.timeslot_id, bookingId]
      );

      if (conflictCheck.length > 0) {
        return {
          success: false,
          message: 'Cannot rollback: Time slot has been booked by someone else',
        };
      }

      // Rollback the cancellation
      await AppDataSource.query(
        `UPDATE bookings 
         SET status = 'confirmed', cancelled_at = NULL
         WHERE id = $1`,
        [bookingId]
      );

      // Log booking rollback
      await this.auditService.logAction(
        userId,
        'BOOKING_ROLLBACK',
        'booking',
        bookingId,
        { roomId: booking.room_id, timeslotId: booking.timeslot_id, minutesSinceCancellation: Math.round(minutesSinceCancellation) }
      );

      return {
        success: true,
        message: 'Booking restored successfully',
        bookingId,
      };
    } catch (error) {
      console.error('Error rolling back cancellation:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: 'Failed to rollback cancellation', error: message };
    }
  }

  /**
   * Force release a booking (Registrar only)
   */
  async forceReleaseBooking(bookingId: number, registrarId: number, reason: string) {
    try {
      const bookingResult = await AppDataSource.query(
        'SELECT * FROM bookings WHERE id = $1',
        [bookingId]
      );

      if (bookingResult.length === 0) {
        return { success: false, message: 'Booking not found' };
      }

      const booking = bookingResult[0];

      await AppDataSource.query(
        `UPDATE bookings 
         SET status = 'cancelled', cancelled_at = NOW()
         WHERE id = $1`,
        [bookingId]
      );

      // Log force release by registrar
      await this.auditService.logAction(
        registrarId,
        'BOOKING_FORCE_RELEASED',
        'booking',
        bookingId,
        { reason, originalUserId: booking.user_id, roomId: booking.room_id, timeslotId: booking.timeslot_id }
      );

      return {
        success: true,
        message: 'Booking force released by registrar',
        bookingId,
        reason,
        releasedBy: registrarId,
        originalUserId: booking.user_id,
      };
    } catch (error) {
      console.error('Error force releasing booking:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: 'Failed to force release booking', error: message };
    }
  }


  /**
   * List bookings for the current user
   */
  async getMyBookings(userId: number): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { userId },
      relations: ['timeslot', 'room'],
      order: { timeslot: { startTime: 'ASC' } as any },
    });
  }

  /**
   * For registrars only (controller enforces role)
   */
  async getAllBookings(): Promise<Booking[]> {
    return this.bookingsRepository.find();
  }

  /**
   * Check active booking for a room+timeslot
   */
  async getActiveBookingForTimeslot(roomId: number, timeslotId: number): Promise<Booking | null> {
    return this.bookingsRepository.findOne({
      where: { roomId, timeslotId, status: 'confirmed' },
    });
  }

  /**
   * Registrar may update booking's room if occupancy < 85%
   */
  async updateBookingRoom(
    id: number,
    newRoomId: number,
    actualStudents: number,
    capacity: number,
  ): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({ where: { id } });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (typeof newRoomId !== 'number' || isNaN(newRoomId)) {
      throw new ConflictException('newRoomId must be a number');
    }
    if (typeof actualStudents !== 'number' || typeof capacity !== 'number' || capacity <= 0) {
      throw new ConflictException('actualStudents and capacity must be valid numbers');
    }

    if (actualStudents >= 0.85 * capacity) {
      throw new ForbiddenException('Cannot change room when occupancy is >= 85% of capacity');
    }

    const conflict = await this.bookingsRepository.findOne({
      where: { roomId: newRoomId, timeslotId: booking.timeslotId, status: 'confirmed' },
    });
    if (conflict) {
      throw new ConflictException('Target room is already booked for this timeslot');
    }

    booking.roomId = newRoomId;
    const updatedBooking = await this.bookingsRepository.save(booking);
    
    // Log booking room update
    await this.auditService.logAction(
      undefined, // No specific actor provided in this method
      'BOOKING_ROOM_UPDATED',
      'booking',
      id,
      { 
        previousRoomId: booking.roomId, 
        newRoomId, 
        actualStudents, 
        capacity, 
        occupancyRate: actualStudents / capacity 
      }
    );
    
    return updatedBooking;
  }

  /**
   * Find all bookings for a specific room
   */
  async findByRoomId(roomId: number): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { roomId },
      relations: ['timeslot', 'user'],
    });
  }

  /**
   * Find all bookings
   */
  async findAll(): Promise<Booking[]> {
    return this.bookingsRepository.find({
      relations: ['timeslot', 'user'],
    });
  }

  /**
   * Find bookings for a specific room with user details
   */
  async findByRoomIdWithUser(roomId: number): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { roomId },
      relations: ['timeslot', 'user'],
    });
  }
}