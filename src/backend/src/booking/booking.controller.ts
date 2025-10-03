import {Controller,Get,Post,Delete,Param,Body,Req,UseGuards,} from '@nestjs/common';
import { BookingsService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Request } from 'express';

// ⚠️ In a real app, replace with JWT AuthGuard + RoleGuard
// For now, assume req.user = { id: number, role: 'staff' | 'registrar' | 'admin' }

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // 📌 Staff: create a booking
  @Post()
  async create(@Body() dto: CreateBookingDto, @Req() req: Request) {
    const user = req.user as any;
    return this.bookingsService.create({
      ...dto,
      userId: user.id,
    });
  }

  // 📌 Staff: see their own bookings
  @Get('me')
  async myBookings(@Req() req: Request) {
    const user = req.user as any;
    return this.bookingsService.findByUser(user.id);
  }

  // 📌 Admin/Registrar: see all bookings
  @Get()
  async findAll(@Req() req: Request) {
    const user = req.user as any;
    if (user.role === 'staff') {
      // staff not allowed to see all bookings
      return this.bookingsService.findByUser(user.id);
    }
    return this.bookingsService.findAll();
  }

  // 📌 Cancel booking
  @Delete(':id')
  async cancel(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;
    return this.bookingsService.cancel(+id, user.id, user.role);
  }
}
