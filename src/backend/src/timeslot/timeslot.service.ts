import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Timeslot } from './timeslot.entity';
import { Booking } from '../booking/booking.entity';
import { Room } from '../room/room.entity';

@Injectable()
export class TimeslotService {
  constructor(
    @InjectRepository(Timeslot)
    private readonly timeslotRepository: Repository<Timeslot>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  /**
   * Get all timeslots for a room
   */
  async getTimeslotsByRoom(roomId: number): Promise<Timeslot[]> {
    return await this.timeslotRepository.find({
      where: { room: { id: roomId } },
      relations: ['room'],
      order: { startTime: 'ASC' },
    });
  }

  /**
   * Get timeslots for a room on a specific date
   */
  async getTimeslotsByRoomAndDate(roomId: number, date: string): Promise<Timeslot[]> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    return await this.timeslotRepository
      .createQueryBuilder('timeslot')
      .leftJoinAndSelect('timeslot.room', 'room')
      .where('room.id = :roomId', { roomId })
      .andWhere('timeslot.startTime BETWEEN :startDate AND :endDate', { startDate, endDate })
      .orderBy('timeslot.startTime', 'ASC')
      .getMany();
  }

  /**
   * Get timeslots with booking information
   */
  async getTimeslotsWithBookings(roomId: number, date?: string): Promise<any[]> {
    let query = this.timeslotRepository
      .createQueryBuilder('timeslot')
      .leftJoinAndSelect('timeslot.bookings', 'booking')
      .leftJoinAndSelect('timeslot.room', 'room')
      .where('room.id = :roomId', { roomId });

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query = query.andWhere('timeslot.startTime BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    const timeslots = await query.orderBy('timeslot.startTime', 'ASC').getMany();

    return timeslots.map(timeslot => ({
      ...timeslot,
      isBooked: timeslot.bookings?.length > 0,
      booking: timeslot.bookings?.[0] ?? null,
    }));
  }

  
 /**
 * Create a new timeslot
 */
async createTimeslot(roomId: number, startTime: Date, endTime: Date): Promise<Timeslot> {
  const room = await this.roomRepository.findOne({ where: { id: roomId } });
  if (!room) throw new Error(`Room with id ${roomId} not found`);

  // Compute "date" from startTime 
  const dateOnly = new Date(startTime);
  dateOnly.setHours(0, 0, 0, 0); // zero out time

  const timeslot = this.timeslotRepository.create({
    room,
    startTime,
    endTime,
    date: dateOnly, 
  });

  return await this.timeslotRepository.save(timeslot);
}


  /**
   * Delete a timeslot
   */
  async deleteTimeslot(id: number): Promise<void> {
    await this.timeslotRepository.delete(id);
  }
}
