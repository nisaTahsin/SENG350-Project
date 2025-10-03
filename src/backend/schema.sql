-- ===== EXTENSIONS =====
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- ===== DROP IF TABLE EXISTS =====
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS timeslots CASCADE;
DROP TABLE IF EXISTS room_maintenance CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS booking_status CASCADE;

-- ===== USERS =====
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100),
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('staff','registrar','admin')),
  is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===== ROOMS =====
CREATE TABLE rooms (
  id BIGSERIAL PRIMARY KEY,
  room_name VARCHAR(100) NOT NULL,
  building VARCHAR(100) NOT NULL,
  capacity INT NOT NULL,
  room_location VARCHAR(255),
  url VARCHAR(255),
  av_equipment TEXT[] DEFAULT '{}',   -- simplified AV storage
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_room_name_building UNIQUE (room_name, building)
);

-- Faster lookups by name + building
CREATE INDEX idx_rooms_name_building ON rooms (lower(room_name), lower(building));

-- ===== TIMESLOTS =====
CREATE TABLE timeslots (
  id BIGSERIAL PRIMARY KEY,
  room_id BIGINT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_by BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Prevent overlapping timeslots for the same room
  CONSTRAINT no_overlap_timeslot EXCLUDE USING gist (
    room_id WITH =,
    tstzrange(start_time, end_time, '[]') WITH &&
  ),
  -- Ensure timeslot length is exactly 1 hour
  CONSTRAINT chk_timeslot_duration CHECK (end_time = start_time + interval '1 hour')
);

-- ===== BOOKINGS =====
CREATE TYPE booking_status AS ENUM ('confirmed','cancelled','rolled_back','failed','pending');

CREATE TABLE bookings (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  timeslot_id BIGINT NOT NULL REFERENCES timeslots(id) ON DELETE CASCADE,
  room_id BIGINT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  status booking_status NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  cancelled_at TIMESTAMPTZ,
  notes VARCHAR(500),
  -- Enforce room_id matches the timeslot’s room_id
  CONSTRAINT fk_booking_room_timeslot
    FOREIGN KEY (room_id, timeslot_id)
    REFERENCES timeslots (room_id, id)
    ON DELETE CASCADE
);

-- Only one confirmed booking per timeslot
CREATE UNIQUE INDEX ux_bookings_timeslot_confirmed ON bookings(timeslot_id)
  WHERE (status = 'confirmed');

-- Useful indexes
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_timeslot_status ON bookings(timeslot_id, status);

-- ===== AUDIT LOGS =====
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  actor_id BIGINT REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  target_type VARCHAR(50),
  target_id BIGINT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_time ON audit_logs(created_at);

-- ===== MAINTENANCE WINDOWS =====
CREATE TABLE room_maintenance (
  id BIGSERIAL PRIMARY KEY,
  room_id BIGINT REFERENCES rooms(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  reason VARCHAR(255),
  created_by BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Prevent overlapping maintenance windows for the same room
  CONSTRAINT no_overlap_maintenance EXCLUDE USING gist (
    room_id WITH =,
    tstzrange(start_time, end_time, '[]') WITH &&
  )
);

-- ===== TRIGGERS =====
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_rooms_updated
  BEFORE UPDATE ON rooms FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_updated_at();

CREATE TRIGGER trg_timeslots_updated
  BEFORE UPDATE ON timeslots FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_updated_at();
