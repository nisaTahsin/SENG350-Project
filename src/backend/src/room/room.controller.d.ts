import { RoomsService } from './room.service';
import { CreateTimeslotDto, UpdateTimeslotDto } from '../timeslot/dto';
export declare class RoomsController {
    private readonly roomsService;
    constructor(roomsService: RoomsService);
    findAllRooms(): Promise<import("./room.entity").Room[]>;
    findRoom(id: string): Promise<import("./room.entity").Room | null>;
    createTimeslot(roomId: string, dto: CreateTimeslotDto): Promise<import("../timeslot/timeslot.entity").Timeslot>;
    updateTimeslot(id: string, dto: UpdateTimeslotDto): Promise<import("../timeslot/timeslot.entity").Timeslot>;
    deleteTimeslot(id: string): Promise<void>;
    findTimeslots(roomId: string): Promise<import("../timeslot/timeslot.entity").Timeslot[]>;
}
//# sourceMappingURL=room.controller.d.ts.map