// tests/absolute.mocks.ts
import { vi } from 'vitest';

// NOTE: literal absolute paths only—no variables—so hoisting can't break.
// Paths taken from your error logs.

vi.mock('/Users/taqdeerkaur/Desktop/SENG350_project/group_2_proj/src/backend/src/booking/booking.entity.ts', () => ({
  Booking: class Booking {
    id!: number; userId!: number; roomId!: number; timeslotId!: number; status!: string; notes?: string;
  },
}));
vi.mock('/Users/taqdeerkaur/Desktop/SENG350_project/group_2_proj/src/backend/src/booking/booking.entity', () => ({
  Booking: class Booking {
    id!: number; userId!: number; roomId!: number; timeslotId!: number; status!: string;
  },
}));

vi.mock('/Users/taqdeerkaur/Desktop/SENG350_project/group_2_proj/src/backend/src/user/user.entity.ts', () => ({
  User: class User { id!: number; email!: string; name?: string; role?: string; },
}));
vi.mock('/Users/taqdeerkaur/Desktop/SENG350_project/group_2_proj/src/backend/src/user/user.entity', () => ({
  User: class User { id!: number; email!: string; },
}));

vi.mock('/Users/taqdeerkaur/Desktop/SENG350_project/group_2_proj/src/backend/src/audit/audit.service.ts', () => ({
  AuditService: class AuditService { logAction = vi.fn().mockResolvedValue(undefined); },
}));
vi.mock('/Users/taqdeerkaur/Desktop/SENG350_project/group_2_proj/src/backend/src/audit/audit.service', () => ({
  AuditService: class AuditService { logAction = vi.fn().mockResolvedValue(undefined); },
}));

// Optional transitive entities (safe to include)
vi.mock('/Users/taqdeerkaur/Desktop/SENG350_project/group_2_proj/src/backend/src/room/room.entity.ts', () => ({
  Room: class Room { id!: number; name?: string; }
}));
vi.mock('/Users/taqdeerkaur/Desktop/SENG350_project/group_2_proj/src/backend/src/timeslot/timeslot.entity.ts', () => ({
  Timeslot: class Timeslot { id!: number; }
}));
