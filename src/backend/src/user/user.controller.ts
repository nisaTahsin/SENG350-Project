import { Controller, Get, Post, Body, Param, Put, Patch, Delete } from '@nestjs/common';
import { UsersService } from './user.service';
import * as jwt from 'jsonwebtoken';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('debug-login')
  async debugLogin() {
    const user = await this.usersService.findByUsername('staff');
    return { 
      message: 'Debug login info', 
      user: user ? { id: user.id, username: user.username, password: user.password } : 'null',
      timestamp: new Date().toISOString()
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(Number(id));
  }

  @Patch(':id/block')
  async block(@Param('id') id: string) {
    return this.usersService.blockUser(Number(id));
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.delete(Number(id));
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    try {
      console.log('Login attempt:', { username: body.username, password: body.password });
      const user = await this.usersService.findByUsername(body.username);
      console.log('User found:', user ? { id: user.id, username: user.username, password: user.password } : 'null');
      
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      // Temporary: use plain text comparison for testing
      const isMatch = body.password === user.password;
      console.log('Password match:', isMatch, 'provided:', body.password, 'stored:', user.password);
      if (!isMatch) {
        return { success: false, message: 'Invalid password' };
      }

      const token = jwt.sign(
        { sub: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'defaultSecret',
        { expiresIn: '1h' }
      );

      return { 
        success: true, 
        access_token: token, 
        user: { id: user.id, username: user.username, role: user.role } 
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: 'Login failed', error: errorMessage };
    }
  }
}
