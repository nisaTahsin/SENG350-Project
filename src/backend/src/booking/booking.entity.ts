import { Entity, Unique, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Timeslot } from '../timeslot/timeslot.entity';
import { Room } from '../room/room.entity';

@Entity('bookings')
@Unique(['roomId', 'timeslotId'])
export class Booking {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: number;

  @Column({ name: 'notes', type: 'varchar', length: 500, nullable: true })
  notes?: string;

  // number of students for the class occupying the room (entered by staff when booking)
  @Column({ name: 'actual_students', type: 'int', nullable: true })
  actualStudents?: number;

  // link to user who made the booking
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'user_id', type: 'bigint' })
  userId!: number;

  // explicit room relation + room_id column
  @ManyToOne(() => Room, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' })
  room!: Room;

  @Column({ name: 'room_id', type: 'bigint' })
  roomId!: number;

  @Column({ type: 'varchar', length: 20 })
  status!: 'pending' | 'confirmed' | 'cancelled';

  // timeslot (1h slot) pointer — canonical for room+hour
  @ManyToOne(() => Timeslot, (timeslot: Timeslot) => timeslot.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'timeslot_id' })
  timeslot!: Timeslot;

  @Column({ name: 'timeslot_id', type: 'bigint' })
  timeslotId!: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}

