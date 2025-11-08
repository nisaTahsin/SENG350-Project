export interface Booking {
    id: number;
    userId: number;
    roomId: number;
    timeslotId: number;
    status: 'pending' | 'confirmed' | 'cancelled';
}
export declare class BookingService {
    private bookings;
    private idCounter;
    private mutex;
    createBooking(userId: number, data: Partial<Booking>): Promise<Booking>;
    cancelBooking(id: number, userId: number): Booking | undefined;
    getMyBookings(userId: number): Booking[];
    getAllBookings(): Booking[];
    updateBookingRoom(id: number, newRoomId: number, actualStudents: number, capacity: number): Booking;
}
//# sourceMappingURL=booking.service.d.ts.map