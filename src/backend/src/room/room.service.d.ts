import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { Timeslot } from '../timeslot/timeslot.entity';
import { CreateTimeslotDto, UpdateTimeslotDto } from '../timeslot/dto';
export declare class RoomsService {
    private readonly roomRepository;
    private readonly timeslotRepository;
    constructor(roomRepository: Repository<Room>, timeslotRepository: Repository<Timeslot>);
    findAllRooms(): Promise<Room[]>;
    findRoomById(id: number): Promise<Room | null>;
    createTimeslot(dto: CreateTimeslotDto): Promise<Timeslot>;
    updateTimeslot(id: number, dto: UpdateTimeslotDto): Promise<Timeslot>;
    deleteTimeslot(id: number): Promise<void>;
    findTimeslotsByRoom(roomId: number): Promise<Timeslot[]>;
    findAvailableRooms(start: Date, end: Date): Promise<Room[]>;
}
//# sourceMappingURL=room.service.d.ts.map