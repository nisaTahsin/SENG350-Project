"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const room_service_1 = require("./room.service");
const room_controller_1 = require("./room.controller");
const room_entity_1 = require("./room.entity");
const timeslot_entity_1 = require("../timeslot/timeslot.entity");
@(0, common_1.Module)({
    imports: [typeorm_1.TypeOrmModule.forFeature([room_entity_1.Room, timeslot_entity_1.Timeslot])],
    providers: [room_service_1.RoomsService],
    controllers: [room_controller_1.RoomsController],
    exports: [room_service_1.RoomsService],
})
class RoomsModule {
}
exports.RoomsModule = RoomsModule;
//# sourceMappingURL=room.module.js.map