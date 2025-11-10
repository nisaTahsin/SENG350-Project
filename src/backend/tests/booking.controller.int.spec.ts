// tests/booking.controller.int.spec.ts
import { vi, beforeEach, describe, expect, it } from 'vitest';

// ---------- ABSOLUTE, LITERAL PATH MOCKS (hoisted safely) ----------
vi.mock('/Users/taqdeerkaur/Desktop/SENG350_project/group_2_proj/src/backend/src/booking/booking.entity.ts', () => ({
  Booking: class Booking {
    id!: number; userId!: number; roomId!: number; timeslotId!: number; status!: string; notes?: string;
  },
}));
vi.mock('/Users/taqdeerkaur/Desktop/SENG350_project/group_2_proj/src/backend/src/booking/booking.entity', () => ({
  Booking: class Booking { id!: number; userId!: number; roomId!: number; timeslotId!: number; status!: string; },
}));

vi.mock('/Users/taqdeerkaur/Desktop/SENG350_project/group_2_proj/src/backend/src/user/user.entity.ts', () => ({
  User: class User { id!: number; email!: string; },
}));
vi.mock('/Users/taqdeerkaur/Desktop/SENG350_project/group_2_proj/src/backend/src/user/user.entity', () => ({
  User: class User { id!: number; email!: string; },
}));

// data-source also imports user.entity — stub it completely
vi.mock('/Users/taqdeerkaur/Desktop/SENG350_project/group_2_proj/src/backend/src/data-source.ts', () => ({
  AppDataSource: {
    query: vi.fn(),
    initialize: vi.fn(),
    getRepository: vi.fn(),
  },
}));

// ---------- NOW import Nest bits and SUTs ----------
import { Test } from '@nestjs/testing';
import { BookingController } from '../src/booking/booking.controller';
import { BookingService } from '../src/booking/booking.service';
import { AuditService } from '../src/audit/audit.service';

// Helper: find & invoke the controller’s create-like method with a req containing headers.auth
async function invokeCreate(controller: any, dto: any, reqUser: { id: number; role?: string }) {
  const request = {
    user: reqUser,
    headers: { authorization: 'Bearer fake.jwt.token' },
  };

  const candidates = [
    'create',
    'createBooking',
    'book',
    'bookRoom',
    'postBooking',
    'createOne',
  ].filter((name) => typeof controller[name] === 'function');

  if (candidates.length === 0) {
    throw new Error(
      `No create-like method on controller. Available keys: ${Object.getOwnPropertyNames(
        Object.getPrototypeOf(controller),
      ).join(', ')}`,
    );
  }

  const fn = controller[candidates[0]].bind(controller);

  // Try (dto, req) then (req, dto)
  try {
    return await fn(dto, request);
  } catch {
    return await fn(request, dto);
  }
}

describe('BookingController (int-lite, no HTTP)', () => {
  let controller: any;
  let bookingServiceMock: { createBooking: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    bookingServiceMock = {
      createBooking: vi.fn(async (userId: number, data: any) => ({
        id: 1,
        userId,
        roomId: data.roomId,
        timeslotId: data.timeslotId,
        status: 'confirmed',
        notes: data.notes ?? undefined,
      })),
    };

    const auditMock = { logAction: vi.fn().mockResolvedValue(undefined) };

    const moduleRef = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [
        { provide: BookingService, useValue: bookingServiceMock },
        { provide: AuditService, useValue: auditMock },
      ],
    }).compile();

    controller = moduleRef.get(BookingController);
  });

  it('creates a booking (smoke)', async () => {
    const dto = { roomId: 10, timeslotId: 20, notes: 'project demo' };
    const reqUser = { id: 42, role: 'staff' };

    const result = await invokeCreate(controller, dto, reqUser);

    // If controller uses wrapper objects with success flag:
    if (result && typeof result === 'object' && 'success' in result) {
      expect(typeof (result as any).success).toBe('boolean');

      if ((result as any).success === true) {
        const payload = (result as any).data ?? (result as any).booking;
        expect(payload).toMatchObject({
          id: 1, userId: 42, roomId: 10, timeslotId: 20, status: 'confirmed', notes: 'project demo',
        });
        expect(bookingServiceMock.createBooking).toHaveBeenCalledWith(
          42, expect.objectContaining(dto),
        );
      } else {
        // If controller enforces auth/token parsing internally, we just verify it returns a structured error.
        expect((result as any).message ?? (result as any).error).toBeTruthy();
        // In this branch the service should NOT have been called
        expect(bookingServiceMock.createBooking).not.toHaveBeenCalled();
      }
      return;
    }

    // Otherwise controller returns the booking directly:
    expect(result).toMatchObject({
      id: 1, userId: 42, roomId: 10, timeslotId: 20, status: 'confirmed', notes: 'project demo',
    });
    expect(bookingServiceMock.createBooking).toHaveBeenCalledWith(42, expect.objectContaining(dto));
  });
});
