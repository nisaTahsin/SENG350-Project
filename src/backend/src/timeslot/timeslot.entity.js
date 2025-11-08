"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timeslot = void 0;
const typeorm_1 = require("typeorm");
const room_entity_1 = require("../room/room.entity");
const booking_entity_1 = require("../booking/booking.entity");
@(0, typeorm_1.Entity)('timeslots')
class Timeslot {
    @(0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'bigint' })
    id;
    @(0, typeorm_1.ManyToOne)(() => room_entity_1.Room, (room) => room.timeslots, { onDelete: 'CASCADE' })
    @(0, typeorm_1.JoinColumn)({ name: 'room_id' })
    room;
    @(0, typeorm_1.Column)({ name: 'room_id', type: 'bigint' })
    roomId;
    @(0, typeorm_1.Column)({ type: 'timestamptz' })
    startTime;
    @(0, typeorm_1.Column)({ type: 'timestamptz' })
    endTime;
    @(0, typeorm_1.OneToMany)(() => booking_entity_1.Booking, (booking) => booking.timeslot)
    bookings;
}
exports.Timeslot = Timeslot;
//# sourceMappingURL=timeslot.entity.js.map