import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Timeslot } from '../timeslot/timeslot.entity';


@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: number;

  @Column({ length: 100 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'timestamptz' })
  startTime!: Date;

  @Column({ type: 'timestamptz' })
  endTime!: Date;

  @Column({ length: 50 })
  userId!: string; // or number depending on your users.id type

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @ManyToOne(() => Timeslot, (timeslot) => timeslot.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'timeslot_id' })
  timeslot!: Timeslot;

  @Column({ name: 'timeslot_id', type: 'bigint' })
  timeslotId!: number;
}

