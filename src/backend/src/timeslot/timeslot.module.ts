import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Timeslot } from './timeslot.entity';
import { Room } from '../room/room.entity';
import { Booking } from '../booking/booking.entity';
import { TimeslotService } from './timeslot.service';
import { TimeslotController } from './timeslot.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Timeslot, Room, Booking])],
  controllers: [TimeslotController],
  providers: [TimeslotService],
})
export class TimeslotModule {}
