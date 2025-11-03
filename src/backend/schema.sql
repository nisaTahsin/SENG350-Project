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

INSERT INTO users (username, email, password_hash, role)
VALUES
  ('staff', 'staff@test.com', 'test123', 'staff'),
  ('staffA', 'staffA@test.com', 'test123', 'staff'),
  ('registrar', 'registrar@test.com', 'test123', 'registrar'),
  ('admin', 'admin@test.com', 'test123', 'admin');

-- ===== ROOMS =====
CREATE TABLE rooms (
  id BIGSERIAL PRIMARY KEY,
  room_name VARCHAR(100) NOT NULL,
  building VARCHAR(100) NOT NULL,
  capacity INT NOT NULL,
  room_location VARCHAR(255),
  url VARCHAR(255),
  av_equipment TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_room_name_building UNIQUE (room_name, building)
);

CREATE INDEX idx_rooms_name_building ON rooms (lower(room_name), lower(building));

-- ===== SAFE CSV IMPORT (SKIP DUPLICATES) =====
-- Create a temporary staging table first
CREATE TEMP TABLE tmp_rooms (
  room_name VARCHAR(100),
  building VARCHAR(100),
  capacity INT,
  av_equipment TEXT,
  room_location VARCHAR(255),
  url VARCHAR(255)
);

-- Import CSV data into the staging table (not rooms)
COPY tmp_rooms(room_name, building, capacity, av_equipment, room_location, url)
FROM '/docker-entrypoint-initdb.d/uvic_rooms.csv'
DELIMITER ','
CSV HEADER;

-- Insert only unique room_name+building pairs into rooms
INSERT INTO rooms (room_name, building, capacity, av_equipment, room_location, url)
SELECT DISTINCT ON (room_name, building)
  room_name, building, capacity, av_equipment, room_location, url
FROM tmp_rooms
ON CONFLICT (room_name, building) DO NOTHING;

-- Drop the temp table
DROP TABLE tmp_rooms;


-- ===== TIMESLOTS =====
CREATE TABLE timeslots (
  id BIGSERIAL PRIMARY KEY,
  room_id BIGINT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  date DATE NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_by BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_timeslots_room_id_id UNIQUE (room_id, id),
  CONSTRAINT no_overlap_timeslot EXCLUDE USING gist (
    room_id WITH =,
    tstzrange(start_time, end_time, '[]') WITH &&
  ),
  CONSTRAINT chk_timeslot_duration CHECK (end_time = start_time + interval '30 minutes')
);

DO $$
DECLARE
    r RECORD;
    d DATE;
    slot_start TIME;
    slot_end TIME;
BEGIN
    -- Loop through all rooms
    FOR r IN SELECT id FROM rooms LOOP
        -- Loop through each date from 2025-11-02 to 2025-11-30
        d := '2025-11-02';
        WHILE d <= '2025-11-30' LOOP
            slot_start := '07:30';
            slot_end := slot_start + interval '30 minutes';

            -- Loop through timeslots until 19:00
            WHILE slot_end <= '19:00'::time LOOP
                INSERT INTO timeslots (room_id, start_time, end_time, is_available, date)
                VALUES (
                    r.id,
                    d + slot_start,
                    d + slot_end,
                    true,
                    d
                )
                ON CONFLICT DO NOTHING;

                -- Move to next slot
                slot_start := slot_start + interval '30 minutes';
                slot_end := slot_start + interval '30 minutes';
            END LOOP;

            d := d + 1; -- next day
        END LOOP;
    END LOOP;
END $$;


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

CREATE UNIQUE INDEX ux_bookings_timeslot_confirmed ON bookings(timeslot_id)
  WHERE (status = 'confirmed');

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
