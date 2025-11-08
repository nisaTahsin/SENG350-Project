"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const typeorm_1 = require("typeorm");
const timeslot_entity_1 = require("../timeslot/timeslot.entity");
@(0, typeorm_1.Entity)('rooms')
class Room {
    @(0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'bigint' })
    id;
    @(0, typeorm_1.Column)({ unique: true, length: 50 })
    name;
    @(0, typeorm_1.Column)({ type: 'int', default: 1 })
    capacity;
    @(0, typeorm_1.OneToMany)(() => timeslot_entity_1.Timeslot, (timeslot) => timeslot.room)
    timeslots;
}
exports.Room = Room;
//# sourceMappingURL=room.entity.js.map