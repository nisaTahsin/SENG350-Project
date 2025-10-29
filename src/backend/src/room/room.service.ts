import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { Timeslot } from '../timeslot/timeslot.entity';
import { BookingService } from '../booking/booking.service';
import { AppDataSource } from '../data-source';
import { AuditService } from '../audit/audit.service';

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
    private readonly bookingService: BookingService,
    private readonly auditService: AuditService,
  ) {}

  // ========== EXISTING METHODS ==========

  findAllRooms(): Promise<Room[]> {
    return this.roomRepository.find();
  }

  findRoomById(id: number): Promise<Room | null> {
    return this.roomRepository.findOne({ where: { id } });
  }

  async createTimeslot(dto: { roomId: number; startTime: string | Date; endTime: string | Date; }): Promise<Timeslot> {
    const room = await this.roomRepository.findOne({ where: { id: dto.roomId } });
    if (!room) throw new NotFoundException('Room not found');

    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('startTime and endTime must be valid dates');
    }

    const ONE_HOUR_MS = 60 * 60 * 1000;
    if (end.getTime() - start.getTime() !== ONE_HOUR_MS) {
      throw new BadRequestException('Timeslot must be exactly 1 hour long');
    }

    const anyRoom = room as any;
    if (anyRoom.openStartTime && anyRoom.openEndTime) {
      const openStart = new Date(anyRoom.openStartTime);
      const openEnd = new Date(anyRoom.openEndTime);
      if (start < openStart || end > openEnd) {
        throw new BadRequestException('Timeslot outside room open hours');
      }
    }

    const existingForRoom = await this.timeslotRepository.find({ where: { roomId: dto.roomId } });
    const overlaps = existingForRoom.some(ts => {
      const s = new Date(ts.startTime).getTime();
      const e = new Date(ts.endTime).getTime();
      return s < end.getTime() && e > start.getTime();
    });
    if (overlaps) {
      throw new ConflictException('Overlapping timeslot exists for this room');
    }

    const ts = this.timeslotRepository.create({
      roomId: dto.roomId,
      startTime: start,
      endTime: end,
    });
    
    const savedTimeslot = await this.timeslotRepository.save(ts);
    
    // Log timeslot creation
    await this.auditService.logAction(
      undefined,
      'TIMESLOT_CREATED',
      'timeslot',
      savedTimeslot.id,
      { roomId: dto.roomId, startTime: start, endTime: end }
    );
    
    return savedTimeslot;
  }

  async updateTimeslot(id: number, dto: any): Promise<Timeslot> {
    const existingTimeslot = await this.timeslotRepository.findOne({ where: { id } });
    if (!existingTimeslot) throw new NotFoundException('Timeslot not found');
    
    await this.timeslotRepository.update(id, dto);
    const updated = await this.timeslotRepository.findOne({ where: { id } });
    
    // Log timeslot update
    await this.auditService.logAction(
      undefined,
      'TIMESLOT_UPDATED',
      'timeslot',
      id,
      { originalData: existingTimeslot, updates: dto }
    );
    
    return updated!;
  }

  async deleteTimeslot(id: number): Promise<void> {
    const existingTimeslot = await this.timeslotRepository.findOne({ where: { id } });
    if (!existingTimeslot) throw new NotFoundException('Timeslot not found');
    
    await this.timeslotRepository.delete(id);
    
    // Log timeslot deletion
    await this.auditService.logAction(
      undefined,
      'TIMESLOT_DELETED',
      'timeslot',
      id,
      { roomId: existingTimeslot.roomId, startTime: existingTimeslot.startTime, endTime: existingTimeslot.endTime }
    );
  }

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
    return this.roomRepository.find();
  }

  async generateSampleTimeslots(): Promise<Timeslot[]> {
    const rooms = await this.roomRepository.find();
    const timeslots: Timeslot[] = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + day);

      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        continue;
      }

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

    return await this.timeslotRepository.save(timeslots);
  }

  async getAllBookings() {
    return this.roomRepository.query(`
      SELECT 
        b.id,
        b.user_id,
        b.room_id,
        b.timeslot_id,
        b.status,
        b.notes,
        b.created_at,
        r.room_name,
        r.building,
        t.start_time,
        t.end_time
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN timeslots t ON b.timeslot_id = t.id
      ORDER BY b.created_at DESC
    `);
  }

  async getSimpleBookings() {
    return this.roomRepository.query(`
      SELECT 
        b.id,
        b.user_id,
        b.room_id,
        b.timeslot_id,
        b.status,
        r.room_name,
        t.start_time
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN timeslots t ON b.timeslot_id = t.id
      ORDER BY b.created_at DESC
    `);
  }

  async generateTimeslotsForDate(date: string) {
    const existingTimeslots = await this.timeslotRepository.query(`
      SELECT COUNT(*) as count FROM timeslots WHERE DATE(start_time) = $1
    `, [date]);

    if (existingTimeslots[0].count > 0) {
      console.log(`Timeslots already exist for ${date}, skipping generation`);
      return [];
    }

    const rooms = await this.roomRepository.find({ where: { isActive: true } });
    
    const timeSlots = [
      '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00',
      '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'
    ];

    const timeslots = [];

    for (const room of rooms) {
      for (const timeSlot of timeSlots) {
        const startTime = new Date(`${date}T${timeSlot}:00.000Z`);
        const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);

        const timeslot = this.timeslotRepository.create({
          roomId: room.id,
          startTime,
          endTime,
        });

        timeslots.push(timeslot);
      }
    }

    return await this.timeslotRepository.save(timeslots);
  }

  // ========== NEW REGISTRAR MAINTENANCE METHODS ==========

  /**
   * Update room details (capacity, status, name, building)
   */
  async updateRoom(
    roomId: number,
    updates: {
      capacity?: number;
      isActive?: boolean;
      openHours?: string;
      roomName?: string;
      building?: string;
    }
  ) {
    try {
      const setClauses = [];
      const params = [];
      let paramIndex = 1;

      if (updates.capacity !== undefined) {
        setClauses.push(`capacity = $${paramIndex++}`);
        params.push(updates.capacity);
      }

      if (updates.isActive !== undefined) {
        setClauses.push(`is_active = $${paramIndex++}`);
        params.push(updates.isActive);
      }

      if (updates.roomName !== undefined) {
        setClauses.push(`room_name = $${paramIndex++}`);
        params.push(updates.roomName);
      }

      if (updates.building !== undefined) {
        setClauses.push(`building = $${paramIndex++}`);
        params.push(updates.building);
      }

      setClauses.push(`updated_at = NOW()`);
      params.push(roomId);

      const query = `
        UPDATE rooms 
        SET ${setClauses.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await AppDataSource.query(query, params);

      if (result.length === 0) {
        return { success: false, message: 'Room not found' };
      }

      // Log room update
      await this.auditService.logAction(
        undefined,
        'ROOM_UPDATED',
        'room',
        roomId,
        { updates }
      );

      return { success: true, message: 'Room updated successfully', room: result[0] };
    } catch (error) {
      console.error('Error updating room:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: 'Failed to update room', error: message };
    }
  }

  /**
   * Update room capacity specifically
   */
  async updateCapacity(roomId: number, capacity: number) {
    try {
      if (capacity < 1) {
        return { success: false, message: 'Capacity must be at least 1' };
      }

      const result = await AppDataSource.query(
        `UPDATE rooms 
         SET capacity = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [capacity, roomId]
      );

      if (result.length === 0) {
        return { success: false, message: 'Room not found' };
      }

      // Log capacity update
      await this.auditService.logAction(
        undefined,
        'ROOM_CAPACITY_UPDATED',
        'room',
        roomId,
        { newCapacity: capacity, previousCapacity: result[0].capacity }
      );

      return { 
        success: true, 
        message: `Room capacity updated to ${capacity}`, 
        room: result[0] 
      };
    } catch (error) {
      console.error('Error updating capacity:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: 'Failed to update capacity', error: message };
    }
  }

  /**
   * Toggle room active status (for maintenance/deactivation)
   */
  async toggleStatus(roomId: number, isActive: boolean) {
    try {
      const result = await AppDataSource.query(
        `UPDATE rooms 
         SET is_active = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [isActive, roomId]
      );

      if (result.length === 0) {
        return { success: false, message: 'Room not found' };
      }

      // Log status toggle
      await this.auditService.logAction(
        undefined,
        'ROOM_STATUS_TOGGLED',
        'room',
        roomId,
        { newStatus: isActive, previousStatus: !isActive }
      );

      const status = isActive ? 'activated' : 'deactivated';
      return { 
        success: true, 
        message: `Room ${status} successfully`, 
        room: result[0] 
      };
    } catch (error) {
      console.error('Error toggling room status:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: 'Failed to update room status', error: message };
    }
  }

  /**
   * Get room utilization statistics for a date range
   */
  async getRoomUtilization(roomId: number, startDate?: string, endDate?: string) {
    try {
      const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const end = endDate || new Date().toISOString();

      const roomResult = await AppDataSource.query(
        'SELECT * FROM rooms WHERE id = $1',
        [roomId]
      );

      if (roomResult.length === 0) {
        return { success: false, message: 'Room not found' };
      }

      const room = roomResult[0];

      const totalSlotsResult = await AppDataSource.query(
        `SELECT COUNT(*) as total
         FROM timeslots
         WHERE room_id = $1
         AND start_time >= $2
         AND end_time <= $3`,
        [roomId, start, end]
      );

      const bookedSlotsResult = await AppDataSource.query(
        `SELECT COUNT(*) as booked
         FROM bookings b
         JOIN timeslots t ON b.timeslot_id = t.id
         WHERE b.room_id = $1
         AND b.status = 'confirmed'
         AND t.start_time >= $2
         AND t.end_time <= $3`,
        [roomId, start, end]
      );

      const totalSlots = parseInt(totalSlotsResult[0].total);
      const bookedSlots = parseInt(bookedSlotsResult[0].booked);
      const utilizationRate = totalSlots > 0 ? (bookedSlots / totalSlots) * 100 : 0;

      return {
        success: true,
        room: {
          id: room.id,
          name: room.room_name,
          building: room.building,
          capacity: room.capacity,
        },
        period: {
          startDate: start,
          endDate: end,
        },
        stats: {
          totalSlots,
          bookedSlots,
          availableSlots: totalSlots - bookedSlots,
          utilizationRate: parseFloat(utilizationRate.toFixed(2)),
        },
      };
    } catch (error) {
      console.error('Error getting room utilization:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: 'Failed to get utilization stats', error: message };
    }
  }
}