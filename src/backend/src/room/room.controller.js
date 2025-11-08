"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsController = void 0;
const common_1 = require("@nestjs/common");
const room_service_1 = require("./room.service");
const dto_1 = require("../timeslot/dto");
@(0, common_1.Controller)('rooms')
class RoomsController {
    roomsService;
    constructor(roomsService) {
        this.roomsService = roomsService;
    }
    // Rooms
    @(0, common_1.Get)()
    findAllRooms() {
        return this.roomsService.findAllRooms();
    }
    @(0, common_1.Get)(':id')
    findRoom(
    @(0, common_1.Param)('id')
    id) {
        return this.roomsService.findRoomById(+id);
    }
    // Timeslots
    @(0, common_1.Post)(':id/timeslots')
    createTimeslot(
    @(0, common_1.Param)('id')
    roomId, 
    @(0, common_1.Body)()
    dto) {
        return this.roomsService.createTimeslot({ ...dto, roomId: +roomId });
    }
    @(0, common_1.Patch)('timeslots/:id')
    updateTimeslot(
    @(0, common_1.Param)('id')
    id, 
    @(0, common_1.Body)()
    dto) {
        return this.roomsService.updateTimeslot(+id, dto);
    }
    @(0, common_1.Delete)('timeslots/:id')
    deleteTimeslot(
    @(0, common_1.Param)('id')
    id) {
        return this.roomsService.deleteTimeslot(+id);
    }
    @(0, common_1.Get)(':id/timeslots')
    findTimeslots(
    @(0, common_1.Param)('id')
    roomId) {
        return this.roomsService.findTimeslotsByRoom(+roomId);
    }
}
exports.RoomsController = RoomsController;
//# sourceMappingURL=room.controller.js.map