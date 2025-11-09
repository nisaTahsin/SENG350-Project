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

  // ===== ROOM METHODS =====

  async createRoom(data: { room_name: string; building: string; capacity: number }) {
    const room_name = data.room_name?.trim();
    const building = data.building?.trim();
    const capacity = data.capacity;

    if (!room_name || !building || !capacity) {
      throw new BadRequestException('Missing required room fields');
    }

    const existing = await this.roomRepository
      .createQueryBuilder('room')
      .where('LOWER(room.room_name) = LOWER(:room_name)', { room_name })
      .andWhere('LOWER(room.building) = LOWER(:building)', { building })
      .getOne();

    if (existing) {
      throw new ConflictException('Room with the same name already exists in this building');
    }

    const room = this.roomRepository.create({
      room_name,
      building,
      capacity,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedRoom = await this.roomRepository.save(room);

    await this.auditService.logAction(
      undefined,
      'ROOM_CREATED',
      'room',
      savedRoom.id,
      { room_name: savedRoom.room_name, building: savedRoom.building, capacity: savedRoom.capacity }
    );

    return savedRoom;
  }

  findAllRooms(): Promise<Room[]> {
    return this.roomRepository.find();
  }

  findRoomById(id: number): Promise<Room | null> {
    return this.roomRepository.findOne({ where: { id } });
  }

  async updateRoom(
    roomId: number,
    updates: {
      capacity?: number;
      isActive?: boolean;
      room_name?: string;  // changed from name
      building?: string;
    }
  ) {
    try {
      const setClauses: string[] = [];
      const params: any[] = [];
      let paramIndex = 1;

      if (updates.capacity !== undefined) {
        setClauses.push(`capacity = $${paramIndex++}`);
        params.push(updates.capacity);
      }

      if (updates.isActive !== undefined) {
        setClauses.push(`is_active = $${paramIndex++}`);
        params.push(updates.isActive);
      }

      if (updates.room_name !== undefined) {
        setClauses.push(`room_name = $${paramIndex++}`);
        params.push(updates.room_name);
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

  async updateCapacity(roomId: number, capacity: number) {
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

    await this.auditService.logAction(
      undefined,
      'ROOM_CAPACITY_UPDATED',
      'room',
      roomId,
      { newCapacity: capacity, previousCapacity: result[0].capacity }
    );

    return { success: true, message: `Room capacity updated to ${capacity}`, room: result[0] };
  }

  async deleteRoom(roomId: number) {
    const room = await this.roomRepository.findOne({ where: { id: roomId }, relations: ['timeslots'] });
    if (!room) throw new NotFoundException('Room not found');

    if (room.timeslots?.length) {
      await this.timeslotRepository
        .createQueryBuilder()
        .delete()
        .from(Timeslot)
        .where('room_id = :roomId', { roomId })
        .execute();
    }

    await this.roomRepository.delete(roomId);

    await this.auditService.logAction(
      undefined,
      'ROOM_DELETED',
      'room',
      roomId,
      { room_name: room.room_name, building: room.building, capacity: room.capacity }
    );

    return { success: true, message: 'Room deleted successfully' };
  }

  async toggleStatus(roomId: number, isActive: boolean) {
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

    await this.auditService.logAction(
      undefined,
      'ROOM_STATUS_TOGGLED',
      'room',
      roomId,
      { newStatus: isActive, previousStatus: !isActive }
    );

    const status = isActive ? 'activated' : 'deactivated';
    return { success: true, message: `Room ${status} successfully`, room: result[0] };
  }

  // ===== TIMESLOT METHODS =====

  async createTimeslot(dto: { roomId: number; startTime: string | Date; endTime: string | Date; }): Promise<Timeslot> {
    const room = await this.roomRepository.findOne({ where: { id: dto.roomId } });
    if (!room) throw new NotFoundException('Room not found');

    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('startTime and endTime must be valid dates');
    }

    const THIRTY_MIN_MS = 30 * 60 * 1000;
    if (end.getTime() - start.getTime() !== THIRTY_MIN_MS) {
      throw new BadRequestException('Timeslot must be exactly 30 minutes long');
    }

    const existingForRoom = await this.timeslotRepository.find({ where: { room: { id: dto.roomId } } });
    const overlaps = existingForRoom.some((ts: Timeslot) => {
      const s = new Date(ts.startTime).getTime();
      const e = new Date(ts.endTime).getTime();
      return s < end.getTime() && e > start.getTime();
    });
    if (overlaps) {
      throw new ConflictException('Overlapping timeslot exists for this room');
    }

    const ts = this.timeslotRepository.create({ room, startTime: start, endTime: end });
    const savedTimeslot = await this.timeslotRepository.save(ts);

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

    await this.auditService.logAction(
      undefined,
      'TIMESLOT_DELETED',
      'timeslot',
      id,
      { roomId: existingTimeslot.room.id, startTime: existingTimeslot.startTime, endTime: existingTimeslot.endTime }
    );
  }

  async findTimeslotsByRoom(roomId: number): Promise<TimeslotWithAvailability[]> {
    // Ensure we have a rolling window of timeslots for the next 7 days
    await this.ensureTimeslotsForNext7Days();

    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Room not found');

    const timeslots: Timeslot[] = await this.timeslotRepository.find({
      where: { room: { id: roomId } },
      order: { startTime: 'ASC' },
      relations: ['room'],
    });

    return await Promise.all(
      timeslots.map(async (ts) => {
        const activeBooking = await this.bookingService.getActiveBookingForTimeslot(roomId, Number(ts.id));
        return {
          ...ts,
          isBooked: !!activeBooking,
          bookedByUserId: activeBooking ? activeBooking.userId : null,
        };
      })
    );
  }

  /**
   * Filter timeslots for a specific date (YYYY-MM-DD)
   */
  async findTimeslotsByRoomAndDate(roomId: number, date: string): Promise<TimeslotWithAvailability[]> {
    await this.ensureTimeslotsForNext7Days();

    // Prefer DB-side filtering to avoid timezone mismatches
    const qb = this.timeslotRepository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.room', 'room')
      .where('t.room_id = :roomId', { roomId })
      .andWhere('DATE(t.start_time) = :date', { date })
      .orderBy('t.start_time', 'ASC');

    const filtered: Timeslot[] = await qb.getMany();

    return Promise.all(
      filtered.map(async (ts) => {
        const activeBooking = await this.bookingService.getActiveBookingForTimeslot(roomId, Number(ts.id));
        return {
          ...ts,
          isBooked: !!activeBooking,
          bookedByUserId: activeBooking ? activeBooking.userId : null,
        };
      })
    );
  }

  async generateSampleTimeslots(): Promise<Timeslot[]> {
    const rooms = await this.roomRepository.find();
    const timeslots: Timeslot[] = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + day);

      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) continue;

      for (let hour = 8; hour < 18; hour++) {
        const startTime = new Date(currentDate);
        startTime.setHours(hour, 0, 0, 0);

        const endTime = new Date(currentDate);
        endTime.setHours(hour + 1, 0, 0, 0);

        for (const room of rooms) {
          const timeslot = this.timeslotRepository.create({
            room,
            startTime,
            endTime,
          });
          timeslots.push(timeslot);
        }
      }
    }

    return await this.timeslotRepository.save(timeslots);
  }

  /**
   * Ensure timeslots exist for each of the next 7 days (rolling window).
   * For any day with zero entries, generate 30-minute slots across all active rooms.
   */
  async ensureTimeslotsForNext7Days(): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() + d);
      const dateStr = date.toISOString().slice(0, 10); // YYYY-MM-DD
      // Always attempt to backfill to the desired schedule for this date.
      // This ensures we fix previously partially-generated days (e.g., only :30 entries).
      await this.generateTimeslotsForDate(dateStr);
    }
  }

  async generateTimeslotsForDate(date: string): Promise<Timeslot[]> {
    const rooms = await this.roomRepository.find({ where: { isActive: true } });

    // Desired 30-min schedule: both :00 and :30 starts within operating window
    const desiredStarts = [
      '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00',
      '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'
    ];

    const created: Timeslot[] = [];

    for (const room of rooms) {
      // Get existing starts for this room/date
      const existingForRoom: { start_time: Date }[] = await this.timeslotRepository
        .createQueryBuilder('t')
        .select(['t.start_time AS start_time'])
        .where('t.room_id = :roomId', { roomId: room.id })
        .andWhere('DATE(t.start_time) = :date', { date })
        .getRawMany();

      const existingKeys = new Set(
        existingForRoom.map((row) => {
          const d = new Date(row.start_time);
          const hh = String(d.getHours()).padStart(2, '0');
          const mm = String(d.getMinutes()).padStart(2, '0');
          return `${hh}:${mm}`;
        })
      );

      const toCreate: Timeslot[] = [];
      for (const t of desiredStarts) {
        if (existingKeys.has(t)) continue; // already present
        // Create times in LOCAL time (no 'Z') so they align with the UI's local schedule
        const startTime = new Date(`${date}T${t}:00`);
        const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
        const dateOnly = new Date(`${date}T00:00:00`);
        const timeslot = this.timeslotRepository.create({ room, startTime, endTime, date: dateOnly });
        toCreate.push(timeslot);
      }

      if (toCreate.length > 0) {
        const saved = await this.timeslotRepository.save(toCreate);
        created.push(...saved);
      }
    }

    // Returns only newly created entries (no-ops if complete)
    return created;
  }

  // ========== BOOKING QUERIES ==========

  async getAllBookings() {
    return this.roomRepository.query(`
      SELECT 
        b.id, b.user_id, b.room_id, b.timeslot_id, b.status, b.notes, b.created_at,
        r.room_name, r.building, t.start_time, t.end_time
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN timeslots t ON b.timeslot_id = t.id
      ORDER BY b.created_at DESC
    `);
  }

  async getSimpleBookings() {
    return this.roomRepository.query(`
      SELECT 
        b.id, b.user_id, b.room_id, b.timeslot_id, b.status,
        r.room_name, t.start_time
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN timeslots t ON b.timeslot_id = t.id
      ORDER BY b.created_at DESC
    `);
  }

  // ========== ROOM UTILIZATION ==========

  async getRoomUtilization(roomId: number, startDate?: string, endDate?: string) {
    const start = startDate || new Date(Date.now() - 30*24*60*60*1000).toISOString();
    const end = endDate || new Date().toISOString();

    const roomResult = await AppDataSource.query('SELECT * FROM rooms WHERE id = $1', [roomId]);
    if (roomResult.length === 0) return { success: false, message: 'Room not found' };
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
        room_name: room.room_name,
        building: room.building,
        capacity: room.capacity,
      },
      period: { startDate: start, endDate: end },
      stats: {
        totalSlots,
        bookedSlots,
        availableSlots: totalSlots - bookedSlots,
        utilizationRate: parseFloat(utilizationRate.toFixed(2)),
      },
    };
  }
}
