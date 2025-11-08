import { BookingService } from './booking.service';
import { RequestWithUser } from '../auth/request-with-user.interface';
export declare class BookingController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    createBooking(req: RequestWithUser, body: {
        roomId: number;
        timeslotId: number;
    }): Promise<import("./booking.service").Booking>;
    cancelBooking(req: RequestWithUser, id: string): import("./booking.service").Booking | undefined;
    getMyBookings(req: RequestWithUser): import("./booking.service").Booking[];
    getAllBookings(): import("./booking.service").Booking[];
    modifyBookingRoom(id: string, body: {
        newRoomId: number;
        actualStudents: number;
        capacity: number;
    }): import("./booking.service").Booking;
}
//# sourceMappingURL=booking.controller.d.ts.map