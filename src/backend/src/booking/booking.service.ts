import {
  Injectable,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,
  ) {}

  // 📌 Create booking with conflict check
  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const existing = await this.bookingsRepository.findOne({
      where: { timeslotId: createBookingDto.timeslotId },
    });

    if (existing) {
      throw new ConflictException('This timeslot is already booked.');
    }

    const booking = this.bookingsRepository.create(createBookingDto);
    return this.bookingsRepository.save(booking);
  }

  // 📌 Find all bookings (Admin/Registrar only)
  async findAll(): Promise<Booking[]> {
    return this.bookingsRepository.find({ relations: ['timeslot', 'user'] });
  }

  // 📌 Find one booking
  async findById(id: number): Promise<Booking | null> {
    return this.bookingsRepository.findOne({
      where: { id },
      relations: ['timeslot', 'user'],
    });
  }

  // 📌 Find bookings by user (Staff only)
  async findByUser(userId: number): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { userId },
      relations: ['timeslot'],
    });
  }

  // 📌 Update booking
  async update(id: number, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    await this.bookingsRepository.update(id, updateBookingDto);
    const updated = await this.findById(id);
    if (!updated) throw new NotFoundException('Booking not found');
    return updated;
  }

  // 📌 Cancel booking
  async cancel(id: number, userId: number, userRole: string): Promise<void> {
    const booking = await this.findById(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // 🔒 Staff can only cancel their own bookings
    if (userRole === 'staff' && Number(booking.userId) !== userId) {
      throw new ForbiddenException('You cannot cancel another user’s booking');
    }

    await this.bookingsRepository.delete(id);
  }
}
