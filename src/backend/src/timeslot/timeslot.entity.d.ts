import { Room } from '../room/room.entity';
import { Booking } from '../booking/booking.entity';
export declare class Timeslot {
    id: number;
    room: Room;
    roomId: number;
    startTime: Date;
    endTime: Date;
    bookings: Booking[];
}
//# sourceMappingURL=timeslot.entity.d.ts.map