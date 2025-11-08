import { User } from '../user/user.entity';
import { Timeslot } from '../timeslot/timeslot.entity';
import { Room } from '../room/room.entity';
export declare class Booking {
    id: number;
    title: string;
    description?: string;
    user: User;
    userId: number;
    room: Room;
    roomId: number;
    timeslot: Timeslot;
    timeslotId: number;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=booking.entity.d.ts.map