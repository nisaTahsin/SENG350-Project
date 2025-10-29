import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { AppDataSource } from '../data-source';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly auditService: AuditService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async create(userData: { username: string; email: string; password: string; role: 'staff' | 'registrar' | 'admin' }): Promise<User> {
    try {
      const user = this.userRepository.create({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: userData.role,
      });
      const savedUser = await this.userRepository.save(user);
      
      // Log user creation
      await this.auditService.logAction(
        savedUser.id,
        'USER_CREATED',
        'user',
        savedUser.id,
        { username: savedUser.username, email: savedUser.email, role: savedUser.role }
      );
      
      return savedUser;
    } catch (error) {
      // Log failed user creation
      await this.auditService.logAction(
        undefined,
        'USER_CREATION_FAILED',
        'user',
        undefined,
        { username: userData.username, error: error instanceof Error ? error.message : 'Unknown error' }
      );
      throw error;
    }
  }

  async blockUser(id: number): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    
    await this.userRepository.update(id, { isBlocked: true });
    const updatedUser = await this.findById(id) as User;
    
    // Log user blocking
    await this.auditService.logAction(
      undefined, // No specific actor for this basic block method
      'USER_BLOCKED',
      'user',
      id,
      { username: user.username, previousState: { isBlocked: user.isBlocked } }
    );
    
    return updatedUser;
  }

  async delete(id: number): Promise<void> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`User ${id} not found`);
    
    // Log user deletion
    await this.auditService.logAction(
      undefined, // No specific actor for this basic delete method
      'USER_DELETED',
      'user',
      id,
      { username: user.username, email: user.email, role: user.role }
    );
  }

  // ========== METHODS FOR REGISTRAR ==========

  /**
   * Block a user account with reason (Registrar escalation)
   */
  async blockUserWithReason(userId: number, blockedBy: number, reason?: string) {
    try {
      const userResult = await AppDataSource.query(
        'SELECT id, username, is_blocked FROM users WHERE id = $1',
        [userId]
      );

      if (userResult.length === 0) {
        return { success: false, message: 'User not found' };
      }

      const user = userResult[0];

      if (user.is_blocked) {
        return { success: false, message: 'User is already blocked' };
      }

      await AppDataSource.query(
        'UPDATE users SET is_blocked = true, updated_at = NOW() WHERE id = $1',
        [userId]
      );

      // Log user blocking with reason
      await this.auditService.logAction(
        blockedBy,
        'USER_BLOCKED_WITH_REASON',
        'user',
        userId,
        { username: user.username, reason, blockedBy }
      );

      return {
        success: true,
        message: `User ${user.username} has been blocked`,
        userId,
        reason,
      };
    } catch (error) {
      console.error('Error blocking user:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: 'Failed to block user', error: message };
    }
  }

  /**
   * Unblock a user account
   */
  async unblockUser(userId: number, unblockedBy: number) {
    try {
      const userResult = await AppDataSource.query(
        'SELECT id, username, is_blocked FROM users WHERE id = $1',
        [userId]
      );

      if (userResult.length === 0) {
        return { success: false, message: 'User not found' };
      }

      const user = userResult[0];

      if (!user.is_blocked) {
        return { success: false, message: 'User is not blocked' };
      }

      await AppDataSource.query(
        'UPDATE users SET is_blocked = false, updated_at = NOW() WHERE id = $1',
        [userId]
      );

      // Log user unblocking
      await this.auditService.logAction(
        unblockedBy,
        'USER_UNBLOCKED',
        'user',
        userId,
        { username: user.username, unblockedBy }
      );

      return {
        success: true,
        message: `User ${user.username} has been unblocked`,
        userId,
      };
    } catch (error) {
      console.error('Error unblocking user:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: 'Failed to unblock user', error: message };
    }
  }

  /**
   * Get user's booking history (for abuse detection)
   */
  async getUserBookings(userId: number) {
    try {
      const bookings = await AppDataSource.query(
        `SELECT 
          b.id,
          b.status,
          b.created_at,
          b.cancelled_at,
          b.notes,
          r.room_name,
          r.building,
          t.start_time,
          t.end_time
         FROM bookings b
         JOIN rooms r ON b.room_id = r.id
         JOIN timeslots t ON b.timeslot_id = t.id
         WHERE b.user_id = $1
         ORDER BY b.created_at DESC
         LIMIT 100`,
        [userId]
      );

      const stats = {
        total: bookings.length,
        confirmed: bookings.filter((b: any) => b.status === 'confirmed').length,
        cancelled: bookings.filter((b: any) => b.status === 'cancelled').length,
      };

      return {
        success: true,
        userId,
        stats,
        bookings,
      };
    } catch (error) {
      console.error('Error getting user bookings:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: 'Failed to get user bookings', error: message };
    }
  }
}