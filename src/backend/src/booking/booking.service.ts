import { Injectable } from '@nestjs/common';

export interface Booking {
  id: number;
  userId: number;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

@Injectable()
export class BookingService {
  private bookings: Booking[] = [];
  private idCounter = 1;

  createBooking(userId: number, data: Partial<Booking>) {
    const booking: Booking = {
      id: this.idCounter++,
      userId,
      date: data.date || new Date().toISOString(),
      status: data.status || 'pending',
    };
    this.bookings.push(booking);
    return booking;
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
}
