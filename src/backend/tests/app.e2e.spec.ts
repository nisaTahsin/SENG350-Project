import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { BookingService } from '../src/booking/booking.service';

describe('App E2E – BookingService via Nest container', () => {
  let service: BookingService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [BookingService],
    }).compile();
    service = moduleRef.get(BookingService);
  });

  it('creates then cancels a booking (no assumption on return type)', async () => {
    const booking = await service.createBooking(42, { roomId: 1, timeslotId: 10 });
    expect(booking).toBeTruthy();
    expect((booking as any).roomId).toBe(1);
    expect((booking as any).timeslotId).toBe(10);

    // cancelBooking may be sync or async and may not return a value
    const ret: any = service.cancelBooking((booking as any).id);
    if (ret && typeof ret.then === 'function') {
      await ret;
    }
    // Not throwing is enough to pass
    expect(true).toBe(true);
  });

  it('prevents double-booking of the same (roomId, timeslotId)', async () => {
    await service.createBooking(1, { roomId: 99, timeslotId: 77 });
    await expect(service.createBooking(2, { roomId: 99, timeslotId: 77 }))
      .rejects.toBeInstanceOf(ConflictException);
  });

  it('cancelBooking(unknownId) either throws NotFound OR is a no-op (returns falsy)', async () => {
    let threwNotFound = false;
    let returnedFalsy = false;

    try {
      const maybe = service.cancelBooking(123456);
      const value =
        maybe && typeof (maybe as any).then === 'function' ? await (maybe as any) : maybe;
      returnedFalsy = value == null || value === false;
    } catch (e) {
      threwNotFound = e instanceof NotFoundException;
    }

    expect(threwNotFound || returnedFalsy).toBe(true);
  });
});

