import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Timeslot } from '../timeslot/timeslot.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: number;

  @Column({ unique: true, length: 50 })
  name!: string;

  @Column({ type: 'int', default: 1 })
  capacity!: number;

  @OneToMany(() => Timeslot, (timeslot) => timeslot.room)
  timeslots!: Timeslot[];
}
