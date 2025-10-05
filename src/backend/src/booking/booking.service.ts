import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';

/** simple keyed mutex to serialize operations per room+timeslot */
class KeyedMutex {
  private locks = new Map<string, Promise<void>>();

  async runExclusive<T>(key: string, fn: () => Promise<T> | T): Promise<T> {
    const previous = this.locks.get(key) ?? Promise.resolve();
    let release!: () => void;
    const current = previous.then(() => new Promise<void>(res => (release = res)));
    this.locks.set(key, current);

    try {
      // wait for previous to finish, then run callback
      await previous;
      return await fn();
    } finally {
      // allow next in line to proceed
      release();
      // remove lock entry if no one else replaced it
      if (this.locks.get(key) === current) {
        this.locks.delete(key);
      }
    }
  }
}

export interface Booking {
  id: number;
  userId: number;
  roomId: number;
  timeslotId: number;  // timeslot identifier (1h slot)
  status: 'pending' | 'confirmed' | 'cancelled';
}

@Injectable()
export class BookingService {
  private bookings: Booking[] = [];
  private idCounter = 1;
  private mutex = new KeyedMutex();

  // make createBooking atomic per room+timeslot to ensure only one booking per room/timeslot
  async createBooking(userId: number, data: Partial<Booking>) {
    if (typeof data.roomId !== 'number' || typeof data.timeslotId !== 'number') {
      throw new ConflictException('roomId and timeslotId are required');
    }

    const key = `${data.roomId}:${data.timeslotId}`;

    return await this.mutex.runExclusive(key, async () => {
      // re-check conflict inside the lock
      const conflict = this.bookings.find(
        b => b.roomId === data.roomId && b.timeslotId === data.timeslotId && b.status !== 'cancelled',
      );
      if (conflict) {
        // another request already created a booking for this room+timeslot
        throw new ConflictException('Timeslot already booked for this room');
      }

      const booking: Booking = {
        id: this.idCounter++,
        userId,
        roomId: data.roomId!,      
        timeslotId: data.timeslotId!,
        status: data.status || 'pending',
      };
      this.bookings.push(booking);
      return booking;
    });
  }

  cancelBooking(id: number, userId: number) {
    const booking = this.bookings.find(b => b.id === id && b.userId === userId);
    if (booking) {
      booking.status = 'cancelled';
    }
    return booking;
  }

  getMyBookings(userId: number) {
    return this.bookings.filter(b => b.userId === userId);
  }

  // new: return all bookings (for registrars)
  getAllBookings() {
    return this.bookings;
  }

  // new: registrars may change room of a booking (not date) if occupancy < 85%
  updateBookingRoom(id: number, newRoomId: number, actualStudents: number, capacity: number) {
    const booking = this.bookings.find(b => b.id === id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (typeof newRoomId !== 'number' || isNaN(newRoomId)) {
      throw new ConflictException('newRoomId must be a number');
    }
    if (typeof actualStudents !== 'number' || typeof capacity !== 'number' || capacity <= 0) {
      throw new ConflictException('actualStudents and capacity must be valid numbers');
    }

    // check occupancy threshold: actual < 85% of capacity
    if (actualStudents >= 0.85 * capacity) {
      throw new ForbiddenException('Cannot change room when occupancy is >= 85% of capacity');
    }

    // do not allow changing the timeslot here (we only change roomId)
    if (newRoomId === booking.roomId) {
      return booking; // no-op
    }

    // ensure target room/timeslot isn't already booked
    const key = `${newRoomId}:${booking.timeslotId}`;
    const conflict = this.bookings.find(
      b => b.roomId === newRoomId && b.timeslotId === booking.timeslotId && b.status !== 'cancelled',
    );
    if (conflict) {
      throw new ConflictException('Target room is already booked for this timeslot');
    }

    booking.roomId = newRoomId;
    return booking;
  }
}
