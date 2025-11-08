import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
<<<<<<< HEAD
import { Booking } from './booking.entity';
import { AuditModule } from '../audit/audit.module';

=======
import { McpController } from '../mcp/mcp.controller';
>>>>>>> 5895a18 (Updated project files(w MCP))
@Module({
  imports: [TypeOrmModule.forFeature([Booking]), AuditModule],
  providers: [BookingService],
  controllers: [BookingController, McpController],
  exports: [BookingService],
})
export class BookingModule {}
