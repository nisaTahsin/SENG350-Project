"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const common_1 = require("@nestjs/common");
const booking_service_1 = require("./booking.service");
const auth_guard_1 = require("../auth/auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const request_with_user_interface_1 = require("../auth/request-with-user.interface");
@(0, common_1.Controller)('booking')
class BookingController {
    bookingService;
    constructor(bookingService) {
        this.bookingService = bookingService;
    }
    // only staff can create bookings for a specific room/timeslot
    @(0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard)
    @(0, roles_decorator_1.Roles)('staff')
    @(0, common_1.Post)()
    async createBooking(
    @(0, common_1.Req)()
    req, 
    @(0, common_1.Body)()
    body) {
        // body must include { roomId: number, timeslotId: number }
        // returns booking on success; throws ConflictException on failure
        return await this.bookingService.createBooking(req.user.id, body);
    }
    @(0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard)
    @(0, common_1.Delete)(':id')
    cancelBooking(
    @(0, common_1.Req)()
    req, 
    @(0, common_1.Param)('id')
    id) {
        return this.bookingService.cancelBooking(Number(id), req.user.id);
    }
    @(0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard)
    @(0, common_1.Get)('me')
    getMyBookings(
    @(0, common_1.Req)()
    req) {
        return this.bookingService.getMyBookings(req.user.id);
    }
    // new: registrars can view all bookings
    @(0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard)
    @(0, roles_decorator_1.Roles)('registrar')
    @(0, common_1.Get)()
    getAllBookings() {
        return this.bookingService.getAllBookings();
    }
    // new: registrars can modify the classroom (roomId) of a booking if actualStudents < 85% of capacity
    // cannot modify the timeslot/date here
    @(0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard)
    @(0, roles_decorator_1.Roles)('registrar')
    @(0, common_1.Patch)(':id/room')
    modifyBookingRoom(
    @(0, common_1.Param)('id')
    id, 
    @(0, common_1.Body)()
    body) {
        const bookingId = Number(id);
        return this.bookingService.updateBookingRoom(bookingId, body.newRoomId, body.actualStudents, body.capacity);
    }
}
exports.BookingController = BookingController;
//# sourceMappingURL=booking.controller.js.map