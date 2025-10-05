import { DataSource } from 'typeorm';
import { User } from './user/user.entity';
import { Booking } from './booking/booking.entity';
import { Room } from './room/room.entity';
import { Timeslot } from './timeslot/timeslot.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Booking, Room, Timeslot],
  synchronize: false, // set true for dev only
});
