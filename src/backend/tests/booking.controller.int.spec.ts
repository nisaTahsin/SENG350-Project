import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { beforeAll, describe, expect, it } from 'vitest';
import { ConflictException } from '@nestjs/common';
import { BookingService } from '../src/booking/booking.service';

describe('Booking integration invariants (Nest DI)', () => {
  let svc: BookingService;

  beforeAll(async () => {
    const mod = await Test.createTestingModule({
      providers: [BookingService],
    }).compile();
    svc = mod.get(BookingService);
  });

  it('enforces required fields for createBooking', async () => {
    await expect(svc.createBooking(1, {} as any))
      .rejects.toBeInstanceOf(ConflictException);
    await expect(svc.createBooking(1, { roomId: 5 } as any))
      .rejects.toBeInstanceOf(ConflictException);
    await expect(svc.createBooking(1, { timeslotId: 5 } as any))
      .rejects.toBeInstanceOf(ConflictException);
  });

  it('allows same room across different timeslots', async () => {
    const a = await svc.createBooking(1, { roomId: 55, timeslotId: 1 });
    const b = await svc.createBooking(1, { roomId: 55, timeslotId: 2 });
    expect(a.id).not.toBe(b.id);
    expect(a.roomId).toBe(55);
    expect(b.roomId).toBe(55);
  });
});
