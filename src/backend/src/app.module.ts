import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './user/user.module';
import { BookingModule } from './booking/booking.module';
import { RoomsModule } from './room/room.module';
import { AppDataSource } from './data-source';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    UsersModule,
    BookingModule,
    RoomsModule,
    MaintenanceModule,
    AnalyticsModule,
    AuditModule,
  ],
})
export class AppModule {}
