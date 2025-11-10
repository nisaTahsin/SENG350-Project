// tests/booking.service.unit.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BookingService } from '../src/booking/booking.service';
import { Booking } from '../src/booking/booking.entity';
import { AuditService } from '../src/audit/audit.service';

describe('BookingService (unit)', () => {
  let service: BookingService;
  let repo: Pick<Repository<Booking>, 'create' | 'save' | 'findOne' | 'find'>;
  let audit: AuditService;

  beforeEach(async () => {
    const repoMock: typeof repo = {
      create: vi.fn((d: Partial<Booking>) => d as Booking),
      save:   vi.fn(async (b: Booking) => ({ id: 1, status: 'confirmed', ...b } as Booking)),
      findOne: vi.fn(async () => null),
      find:    vi.fn(async () => [{ roomId: 2 } as any]), // 2 is busy
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        BookingService,
        { provide: getRepositoryToken(Booking), useValue: repoMock },
        { provide: AuditService, useValue: { logAction: vi.fn().mockResolvedValue(undefined) } },
      ],
    }).compile();

    service = moduleRef.get(BookingService);
    repo    = moduleRef.get(getRepositoryToken(Booking));
    audit   = moduleRef.get(AuditService);
  });

  it('creates when no conflict', async () => {
    const out = await service.createBooking(7, { roomId: 10, timeslotId: 20 });
    expect(out).toMatchObject({ userId: 7, roomId: 10, timeslotId: 20, status: 'confirmed' });
    expect(repo.save).toHaveBeenCalled();
    expect((audit as any).logAction).toHaveBeenCalled();
  });

  it('throws on conflict (pre-check)', async () => {
    (repo.findOne as any).mockResolvedValueOnce({ id: 99 });
    await expect(service.createBooking(1, { roomId: 2, timeslotId: 3 }))
      .rejects.toThrow(/already booked/i);
  });

  it('lists available rooms (filters busy)', async () => {
    const free = await service.listAvailableRooms(123, [1, 2, 3]);
    expect(free).toEqual([1, 3]);
  });
});
