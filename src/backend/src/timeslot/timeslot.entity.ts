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

  @Column({ name: 'room_id', type: 'bigint' })
  roomId!: number;

  @Column({ name: 'start_time', type: 'timestamptz' })
  startTime!: Date;

  @Column({ name: 'end_time', type: 'timestamptz' })
  endTime!: Date;

  @OneToMany(() => Booking, (booking) => booking.timeslot)
  bookings!: Booking[];
}
