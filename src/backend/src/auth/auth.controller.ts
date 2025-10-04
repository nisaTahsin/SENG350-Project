import { Controller, Get, Post, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('rooms')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuthController {
  @Get()
  @Roles('staff', 'registrar', 'admin')  // all roles can view availability
  findAll() {
    return "Rooms list";
  }

  @Post()
  @Roles('registrar')   // only registrars can add/edit rooms
  createRoom() {
    return "Room created";
  }

  @Delete(':id')
  @Roles('admin')       // only admins can delete at system level
  deleteRoom() {
    return "Room deleted";
  }
}
