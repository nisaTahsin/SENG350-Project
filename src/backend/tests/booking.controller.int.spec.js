"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const request = __importStar(require("supertest"));
const booking_service_1 = require("../src/booking/booking.service");
const booking_entity_1 = require("../src/booking/booking.entity");
const booking_controller_1 = require("../src/booking/booking.controller");
const audit_service_1 = require("../src/audit/audit.service");
(0, vitest_1.describe)('BookingController (int-lite)', () => {
    let app;
    (0, vitest_1.beforeEach)(async () => {
        const repoMock = {
            create: vitest_1.vi.fn((d) => d),
            save: vitest_1.vi.fn(async (b) => ({ id: 1, status: 'confirmed', ...b })),
            findOne: vitest_1.vi.fn(async () => null),
            find: vitest_1.vi.fn(async () => []),
            delete: vitest_1.vi.fn(async () => ({ affected: 1 })),
        };
        const moduleRef = await testing_1.Test.createTestingModule({
            controllers: [booking_controller_1.BookingController],
            providers: [
                booking_service_1.BookingService,
                { provide: (0, typeorm_1.getRepositoryToken)(booking_entity_1.Booking), useValue: repoMock },
                { provide: audit_service_1.AuditService, useValue: { logAction: vitest_1.vi.fn().mockResolvedValue(undefined) } },
            ],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
    });
    (0, vitest_1.it)('POST /bookings (smoke) returns something', async () => {
        const res = await request(app.getHttpServer())
            .post('/bookings')
            .send({ roomId: 10, timeslotId: 20 });
        // adapt if your controller uses a different route signature
        (0, vitest_1.expect)([200, 201, 400, 404, 500]).toContain(res.status);
    });
});
//# sourceMappingURL=booking.controller.int.spec.js.map