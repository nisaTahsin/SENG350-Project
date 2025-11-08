import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Room } from '../room/room.entity';
import { Booking } from '../booking/booking.entity';

@Module({
  imports: [
    // Register the Room and Booking repositories so they can be injected
    TypeOrmModule.forFeature([Room, Booking]),
  ],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
