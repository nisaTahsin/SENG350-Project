import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsService } from './room.service';
import { RoomsController } from './room.controller';
import { Room } from './room.entity';
import { Timeslot } from '../timeslot/timeslot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Timeslot])],
  providers: [RoomsService],
  controllers: [RoomsController],
  exports: [RoomsService],
})
export class RoomsModule {}
