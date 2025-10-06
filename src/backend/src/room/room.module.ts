import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsService } from './room.service';
import { RoomsController } from './room.controller';
import { RoomImportService } from './room-import.service';
import { Room } from './room.entity';
import { Timeslot } from '../timeslot/timeslot.entity';
import { BookingModule } from '../booking/booking.module';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Timeslot]), BookingModule],
  providers: [RoomsService, RoomImportService],
  controllers: [RoomsController],
  exports: [RoomsService, RoomImportService],
})
export class RoomsModule {}
