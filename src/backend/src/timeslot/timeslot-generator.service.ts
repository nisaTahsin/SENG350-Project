import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Timeslot } from './timeslot.entity';
import { Room } from '../room/room.entity';

@Injectable()
export class TimeslotGeneratorService {
  constructor(
    @InjectRepository(Timeslot)
    private readonly timeslotRepository: Repository<Timeslot>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  /**
   * Generate timeslots for all rooms for the next 7 days
   */
  async generateTimeslots(): Promise<Timeslot[]> {
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

  /**
   * Get timeslots for a specific room and date
   */
  async getTimeslotsForRoomAndDate(roomId: number, date: string): Promise<Timeslot[]> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    return await this.timeslotRepository.find({
      where: {
        roomId,
        startTime: {
          $gte: startDate,
          $lte: endDate,
        } as any,
      },
      order: { startTime: 'ASC' },
    });
  }

  /**
   * Get available timeslots for a room and date (not booked)
   */
  async getAvailableTimeslots(roomId: number, date: string): Promise<Timeslot[]> {
    const timeslots = await this.getTimeslotsForRoomAndDate(roomId, date);
    
    // Filter out timeslots that have bookings
    // This would need to join with bookings table in a real implementation
    return timeslots;
  }
}
