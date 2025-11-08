import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Timeslot } from '../timeslot/timeslot.entity';
import { Booking } from '../booking/booking.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: number;

  @Column({ name: 'room_name', length: 100 })
  room_name!: string;

  @Column({ length: 100 })
  building!: string;

  @Column({ type: 'int' })
  capacity!: number;

  @Column({ name: 'room_location', length: 255, nullable: true })
  location?: string;

  @Column({ length: 255, nullable: true })
  url?: string;

  @Column({ name: 'av_equipment', type: 'text', array: true, default: [] })
  avEquipment?: string[];

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'now()' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamptz', default: () => 'now()' })
  updatedAt!: Date;

  @OneToMany(() => Timeslot, (timeslot) => timeslot.room)
  timeslots!: Timeslot[];

  @OneToMany(() => Booking, (booking) => booking.room)
  bookings!: Booking[]; 
}