import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { Timeslot } from '../timeslot/timeslot.entity';
import { BookingService } from '../booking/booking.service';

export type TimeslotWithAvailability = Timeslot & {
  isBooked: boolean;
  bookedByUserId: number | null;
};

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Timeslot)
    private readonly timeslotRepository: Repository<Timeslot>,
    private readonly bookingService: BookingService, // injected from BookingModule
  ) {}

  // Rooms (mostly static)
  findAllRooms(): Promise<Room[]> {
    return this.roomRepository.find();
  }

  findRoomById(id: number): Promise<Room | null> {
    return this.roomRepository.findOne({ where: { id } });
  }

  // Timeslots (dynamic)
  async createTimeslot(dto: { roomId: number; startTime: string | Date; endTime: string | Date; }): Promise<Timeslot> {
    // validate room exists
    const room = await this.roomRepository.findOne({ where: { id: dto.roomId } });
    if (!room) throw new NotFoundException('Room not found');

    // normalize times
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('startTime and endTime must be valid dates');
    }

    // enforce 1 hour length (timeslots are 1h)
    const ONE_HOUR_MS = 60 * 60 * 1000;
    if (end.getTime() - start.getTime() !== ONE_HOUR_MS) {
      throw new BadRequestException('Timeslot must be exactly 1 hour long');
    }

    // optional: if Room has open hours fields (e.g. room.openStartTime / room.openEndTime),
    // ensure the timeslot falls within them. Skip if fields are not present.
    const anyRoom = room as any;
    if (anyRoom.openStartTime && anyRoom.openEndTime) {
      const openStart = new Date(anyRoom.openStartTime);
      const openEnd = new Date(anyRoom.openEndTime);
      if (start < openStart || end > openEnd) {
        throw new BadRequestException('Timeslot outside room open hours');
      }
    }

    // ensure no overlapping timeslot exists for this room
    const existingForRoom = await this.timeslotRepository.find({ where: { roomId: dto.roomId } });
    const overlaps = existingForRoom.some(ts => {
      const s = new Date(ts.startTime).getTime();
      const e = new Date(ts.endTime).getTime();
      return s < end.getTime() && e > start.getTime(); // overlap test
    });
    if (overlaps) {
      throw new ConflictException('Overlapping timeslot exists for this room');
    }

    const ts = this.timeslotRepository.create({
      roomId: dto.roomId,
      startTime: start,
      endTime: end,
    });
    return this.timeslotRepository.save(ts);
  }

  async updateTimeslot(id: number, dto: any): Promise<Timeslot> {
    // ...existing implementation...
    await this.timeslotRepository.update(id, dto);
    const updated = await this.timeslotRepository.findOne({ where: { id } });
    if (!updated) throw new NotFoundException('Timeslot not found');
    return updated;
  }

  async deleteTimeslot(id: number): Promise<void> {
    await this.timeslotRepository.delete(id);
  }

  // returns timeslots for a room with availability metadata
  async findTimeslotsByRoom(roomId: number): Promise<TimeslotWithAvailability[]> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Room not found');

    const timeslots: Timeslot[] = await this.timeslotRepository.find({
      where: { roomId },
      order: { startTime: 'ASC' },
    });

    const timeslotsWithAvailability = await Promise.all(
      timeslots.map(async (ts) => {
        const activeBooking = await this.bookingService.getActiveBookingForTimeslot(roomId, Number(ts.id));
        return {
          ...ts,
          isBooked: !!activeBooking,
          bookedByUserId: activeBooking ? activeBooking.userId : null,
        };
      })
    );

    return timeslotsWithAvailability;
  }

  async findAvailableRooms(start: Date, end: Date) {
    // ...existing implementation if any...
    return this.roomRepository.find();
  }

  /**
   * Generate sample timeslots for all rooms for the next 7 days
   */
  async generateSampleTimeslots(): Promise<Timeslot[]> {
    const rooms = await this.roomRepository.find();
    const timeslots: Timeslot[] = [];

    // Generate timeslots for the next 7 days
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + day);

      // Skip weekends (Saturday = 6, Sunday = 0)
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        continue;
      }

      // Generate timeslots from 8:00 AM to 6:00 PM (10 hours)
      for (let hour = 8; hour < 18; hour++) {
        const startTime = new Date(currentDate);
        startTime.setHours(hour, 0, 0, 0);

        const endTime = new Date(currentDate);
        endTime.setHours(hour + 1, 0, 0, 0);

        for (const room of rooms) {
          const timeslot = this.timeslotRepository.create({
            roomId: room.id,
            startTime,
            endTime,
          });

          timeslots.push(timeslot);
        }
      }
    }

    // Save all timeslots
    return await this.timeslotRepository.save(timeslots);
  }
}
