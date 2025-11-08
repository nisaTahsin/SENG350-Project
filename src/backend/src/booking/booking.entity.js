"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../user/user.entity");
const timeslot_entity_1 = require("../timeslot/timeslot.entity");
const room_entity_1 = require("../room/room.entity");
@(0, typeorm_1.Entity)('bookings')
class Booking {
    @(0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'bigint' })
    id;
    @(0, typeorm_1.Column)({ length: 100 })
    title;
    @(0, typeorm_1.Column)({ type: 'text', nullable: true })
    description;
    // link to user who made the booking
    @(0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' })
    @(0, typeorm_1.JoinColumn)({ name: 'user_id' })
    user;
    @(0, typeorm_1.Column)({ name: 'user_id', type: 'bigint' })
    userId;
    // explicit room relation + room_id column
    @(0, typeorm_1.ManyToOne)(() => room_entity_1.Room, { onDelete: 'CASCADE' })
    @(0, typeorm_1.JoinColumn)({ name: 'room_id' })
    room;
    @(0, typeorm_1.Column)({ name: 'room_id', type: 'bigint' })
    roomId;
    // timeslot (1h slot) pointer — canonical for room+hour
    @(0, typeorm_1.ManyToOne)(() => timeslot_entity_1.Timeslot, (timeslot) => timeslot.bookings, { onDelete: 'CASCADE' })
    @(0, typeorm_1.JoinColumn)({ name: 'timeslot_id' })
    timeslot;
    @(0, typeorm_1.Column)({ name: 'timeslot_id', type: 'bigint' })
    timeslotId;
    @(0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' })
    createdAt;
    @(0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamptz' })
    updatedAt;
}
exports.Booking = Booking;
//# sourceMappingURL=booking.entity.js.map