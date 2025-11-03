import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Room } from '../room/room.entity';
import { Booking } from '../booking/booking.entity';

@Entity('timeslots')
export class Timeslot {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: number;

  @ManyToOne(() => Room, (room) => room.timeslots, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' })
  room!: Room;

  @Column({ type: 'date' })
  date!: Date;

  @Column({ name: 'start_time', type: 'timestamptz' })
  startTime!: Date;

  @Column({ name: 'end_time', type: 'timestamptz' })
  endTime!: Date;

  @Column({ name: 'is_available', type: 'boolean', default: true })
  isAvailable!: boolean;

  @OneToMany(() => Booking, (booking) => booking.timeslot)
  bookings!: Booking[];

  @Column({ name: 'created_by', type: 'bigint', nullable: true })
  createdBy?: number;

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
