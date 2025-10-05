import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';

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
  ) {}

  /**
   * Create booking with conflict protection.
   */
  async createBooking(userId: number, data: Partial<Booking>): Promise<Booking> {
    if (typeof data.roomId !== 'number' || typeof data.timeslotId !== 'number') {
      throw new ConflictException('roomId and timeslotId are required (numbers)');
    }

    const key = `${data.roomId}:${data.timeslotId}`;

    return this.mutex.runExclusive(key, async () => {
      const booking = this.bookingsRepository.create({
        userId,
        roomId: data.roomId!,
        timeslotId: data.timeslotId!,
        status: 'pending',
        title: data.title,
        description: data.description,
      });

      try {
        return await this.bookingsRepository.save(booking);
      } catch (err: any) {
        // Postgres unique violation
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
      throw new ForbiddenException('You cannot cancel another user’s booking');
    }

    if (userRole === 'registrar' || userRole === 'admin') {
      await this.bookingsRepository.delete(id);
      return;
    }

    if (userRole === 'staff' && booking.userId === userId) {
      await this.bookingsRepository.delete(id);
      return;
    }

    throw new ForbiddenException('You do not have permission to cancel this booking');
  }

  /**
   * List bookings for the current user
   */
  async getMyBookings(userId: number): Promise<Booking[]> {
    return this.bookingsRepository.find({ where: { userId } });
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
      where: { roomId, timeslotId, status: 'pending' }, // or 'confirmed'
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
      where: { roomId: newRoomId, timeslotId: booking.timeslotId, status: 'pending' },
    });
    if (conflict) {
      throw new ConflictException('Target room is already booked for this timeslot');
    }

    booking.roomId = newRoomId;
    return this.bookingsRepository.save(booking);
  }
}
