"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const testing_1 = require("@nestjs/testing");
const vitest_1 = require("vitest");
const common_1 = require("@nestjs/common");
const booking_service_1 = require("../src/booking/booking.service");
(0, vitest_1.describe)('Booking integration invariants (Nest DI)', () => {
    let svc;
    (0, vitest_1.beforeAll)(async () => {
        const mod = await testing_1.Test.createTestingModule({
            providers: [booking_service_1.BookingService],
        }).compile();
        svc = mod.get(booking_service_1.BookingService);
    });
    (0, vitest_1.it)('enforces required fields for createBooking', async () => {
        await (0, vitest_1.expect)(svc.createBooking(1, {}))
            .rejects.toBeInstanceOf(common_1.ConflictException);
        await (0, vitest_1.expect)(svc.createBooking(1, { roomId: 5 }))
            .rejects.toBeInstanceOf(common_1.ConflictException);
        await (0, vitest_1.expect)(svc.createBooking(1, { timeslotId: 5 }))
            .rejects.toBeInstanceOf(common_1.ConflictException);
    });
    (0, vitest_1.it)('allows same room across different timeslots', async () => {
        const a = await svc.createBooking(1, { roomId: 55, timeslotId: 1 });
        const b = await svc.createBooking(1, { roomId: 55, timeslotId: 2 });
        (0, vitest_1.expect)(a.id).not.toBe(b.id);
        (0, vitest_1.expect)(a.roomId).toBe(55);
        (0, vitest_1.expect)(b.roomId).toBe(55);
    });
});
//# sourceMappingURL=booking.controller.int.spec.js.map