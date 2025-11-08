"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
/** simple keyed mutex to serialize operations per room+timeslot */
class KeyedMutex {
    locks = new Map();
    async runExclusive(key, fn) {
        const previous = this.locks.get(key) ?? Promise.resolve();
        let release;
        const current = previous.then(() => new Promise(res => (release = res)));
        this.locks.set(key, current);
        try {
            // wait for previous to finish, then run callback
            await previous;
            return await fn();
        }
        finally {
            // allow next in line to proceed
            release();
            // remove lock entry if no one else replaced it
            if (this.locks.get(key) === current) {
                this.locks.delete(key);
            }
        }
    }
}
@(0, common_1.Injectable)()
class BookingService {
    bookings = [];
    idCounter = 1;
    mutex = new KeyedMutex();
    // make createBooking atomic per room+timeslot to ensure only one booking per room/timeslot
    async createBooking(userId, data) {
        if (typeof data.roomId !== 'number' || typeof data.timeslotId !== 'number') {
            throw new common_1.ConflictException('roomId and timeslotId are required');
        }
        const key = `${data.roomId}:${data.timeslotId}`;
        return await this.mutex.runExclusive(key, async () => {
            // re-check conflict inside the lock
            const conflict = this.bookings.find(b => b.roomId === data.roomId && b.timeslotId === data.timeslotId && b.status !== 'cancelled');
            if (conflict) {
                // another request already created a booking for this room+timeslot
                throw new common_1.ConflictException('Timeslot already booked for this room');
            }
            const booking = {
                id: this.idCounter++,
                userId,
                roomId: data.roomId,
                timeslotId: data.timeslotId,
                status: data.status || 'pending',
            };
            this.bookings.push(booking);
            return booking;
        });
    }
    cancelBooking(id, userId) {
        const booking = this.bookings.find(b => b.id === id && b.userId === userId);
        if (booking) {
            booking.status = 'cancelled';
        }
        return booking;
    }
    getMyBookings(userId) {
        return this.bookings.filter(b => b.userId === userId);
    }
    // new: return all bookings (for registrars)
    getAllBookings() {
        return this.bookings;
    }
    // new: registrars may change room of a booking (not date) if occupancy < 85%
    updateBookingRoom(id, newRoomId, actualStudents, capacity) {
        const booking = this.bookings.find(b => b.id === id);
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (typeof newRoomId !== 'number' || isNaN(newRoomId)) {
            throw new common_1.ConflictException('newRoomId must be a number');
        }
        if (typeof actualStudents !== 'number' || typeof capacity !== 'number' || capacity <= 0) {
            throw new common_1.ConflictException('actualStudents and capacity must be valid numbers');
        }
        // check occupancy threshold: actual < 85% of capacity
        if (actualStudents >= 0.85 * capacity) {
            throw new common_1.ForbiddenException('Cannot change room when occupancy is >= 85% of capacity');
        }
        // do not allow changing the timeslot here (we only change roomId)
        if (newRoomId === booking.roomId) {
            return booking; // no-op
        }
        // ensure target room/timeslot isn't already booked
        const key = `${newRoomId}:${booking.timeslotId}`;
        const conflict = this.bookings.find(b => b.roomId === newRoomId && b.timeslotId === booking.timeslotId && b.status !== 'cancelled');
        if (conflict) {
            throw new common_1.ConflictException('Target room is already booked for this timeslot');
        }
        booking.roomId = newRoomId;
        return booking;
    }
}
exports.BookingService = BookingService;
listAvailableRooms(timeslotId, number, candidateRoomIds, number[]);
number[] | Promise < number[] > {
    if(Array) { }, : .isArray(this.bookings)
};
{
    const arr = this.bookings;
    return candidateRoomIds.filter(roomId => !arr.some(b => b.roomId === roomId && b.timeslotId === timeslotId && b.status !== 'cancelled'));
}
throw new Error('listAvailableRooms not implemented for your storage; use in-memory branch or add a DB query.');
//# sourceMappingURL=booking.service.js.map