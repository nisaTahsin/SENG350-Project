import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './user/user.module';
import { BookingModule } from './booking/booking.module';
import { RoomsModule } from './room/room.module';
import { AppDataSource } from './data-source';
import { MaintenanceModule } from './maintenance/maintenance.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    UsersModule,
    BookingModule,
    RoomsModule,
    MaintenanceModule,
  ],
})
export class AppModule {}
