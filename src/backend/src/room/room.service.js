"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const room_entity_1 = require("./room.entity");
const timeslot_entity_1 = require("../timeslot/timeslot.entity");
const dto_1 = require("../timeslot/dto");
@(0, common_1.Injectable)()
class RoomsService {
    roomRepository;
    timeslotRepository;
    constructor(
    @(0, typeorm_1.InjectRepository)(room_entity_1.Room)
    roomRepository, 
    @(0, typeorm_1.InjectRepository)(timeslot_entity_1.Timeslot)
    timeslotRepository) {
        this.roomRepository = roomRepository;
        this.timeslotRepository = timeslotRepository;
    }
    // Rooms (mostly static)
    findAllRooms() {
        return this.roomRepository.find({ relations: ['timeslots'] });
    }
    findRoomById(id) {
        return this.roomRepository.findOne({ where: { id }, relations: ['timeslots'] });
    }
    // Timeslots (dynamic)
    async createTimeslot(dto) {
        const timeslot = this.timeslotRepository.create(dto);
        return await this.timeslotRepository.save(timeslot);
    }
    async updateTimeslot(id, dto) {
        await this.timeslotRepository.update(id, dto);
        return this.timeslotRepository.findOne({ where: { id } });
    }
    async deleteTimeslot(id) {
        await this.timeslotRepository.delete(id);
    }
    async findTimeslotsByRoom(roomId) {
        return this.timeslotRepository.find({ where: { roomId } });
    }
    async findAvailableRooms(start, end) {
        return this.roomRepository
            .createQueryBuilder('room')
            .leftJoinAndSelect('room.timeslots', 'timeslot')
            .leftJoin('timeslot.bookings', 'booking')
            .where('timeslot.startTime >= :start', { start })
            .andWhere('timeslot.endTime <= :end', { end })
            .andWhere('booking.id IS NULL') // means no booking yet
            .getMany();
    }
}
exports.RoomsService = RoomsService;
//# sourceMappingURL=room.service.js.map