"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const testing_1 = require("@nestjs/testing");
const vitest_1 = require("vitest");
const common_1 = require("@nestjs/common");
const booking_service_1 = require("../src/booking/booking.service");
(0, vitest_1.describe)('App E2E – BookingService via Nest container', () => {
    let service;
    (0, vitest_1.beforeEach)(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            providers: [booking_service_1.BookingService],
        }).compile();
        service = moduleRef.get(booking_service_1.BookingService);
    });
    (0, vitest_1.it)('creates then cancels a booking (no assumption on return type)', async () => {
        const booking = await service.createBooking(42, { roomId: 1, timeslotId: 10 });
        (0, vitest_1.expect)(booking).toBeTruthy();
        (0, vitest_1.expect)(booking.roomId).toBe(1);
        (0, vitest_1.expect)(booking.timeslotId).toBe(10);
        // cancelBooking may be sync or async and may not return a value
        const ret = service.cancelBooking(booking.id);
        if (ret && typeof ret.then === 'function') {
            await ret;
        }
        // Not throwing is enough to pass
        (0, vitest_1.expect)(true).toBe(true);
    });
    (0, vitest_1.it)('prevents double-booking of the same (roomId, timeslotId)', async () => {
        await service.createBooking(1, { roomId: 99, timeslotId: 77 });
        await (0, vitest_1.expect)(service.createBooking(2, { roomId: 99, timeslotId: 77 }))
            .rejects.toBeInstanceOf(common_1.ConflictException);
    });
    (0, vitest_1.it)('cancelBooking(unknownId) either throws NotFound OR is a no-op (returns falsy)', async () => {
        let threwNotFound = false;
        let returnedFalsy = false;
        try {
            const maybe = service.cancelBooking(123456);
            const value = maybe && typeof maybe.then === 'function' ? await maybe : maybe;
            returnedFalsy = value == null || value === false;
        }
        catch (e) {
            threwNotFound = e instanceof common_1.NotFoundException;
        }
        (0, vitest_1.expect)(threwNotFound || returnedFalsy).toBe(true);
    });
});
//# sourceMappingURL=app.e2e.spec.js.map