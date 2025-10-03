import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { Timeslot } from '../timeslot/timeslot.entity';
import { CreateTimeslotDto, UpdateTimeslotDto } from '../timeslot/dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Timeslot)
    private readonly timeslotRepository: Repository<Timeslot>,
  ) {}

  // Rooms (mostly static)
  findAllRooms(): Promise<Room[]> {
    return this.roomRepository.find({ relations: ['timeslots'] });
  }

  findRoomById(id: number): Promise<Room | null> {
    return this.roomRepository.findOne({ where: { id }, relations: ['timeslots'] });
  }

  // Timeslots (dynamic)
  async createTimeslot(dto: CreateTimeslotDto): Promise<Timeslot> {
    const timeslot = this.timeslotRepository.create(dto);
    return await this.timeslotRepository.save(timeslot);
  }

  async updateTimeslot(id: number, dto: UpdateTimeslotDto): Promise<Timeslot> {
    await this.timeslotRepository.update(id, dto);
    return this.timeslotRepository.findOne({ where: { id } });
}


  async deleteTimeslot(id: number): Promise<void> {
    await this.timeslotRepository.delete(id);
  }

  async findTimeslotsByRoom(roomId: number): Promise<Timeslot[]> {
    return this.timeslotRepository.find({ where: { roomId } });
  }

  async findAvailableRooms(start: Date, end: Date) {
  return this.roomRepository
    .createQueryBuilder('room')
    .leftJoinAndSelect('room.timeslots', 'timeslot')
    .leftJoin('timeslot.bookings', 'booking')
    .where('timeslot.startTime >= :start', { start })
    .andWhere('timeslot.endTime <= :end', { end })
    .andWhere('booking.id IS NULL') // means no booking yet
    .getMany();
}

}
