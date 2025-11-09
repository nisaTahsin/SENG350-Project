
import React, { useState, useEffect, useRef } from 'react';
import GenericPage from '../GenericPage';
import TimeslotTable from '../TimeslotTable';
import BookingForm from '../BookingForm';


const times = [
  '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM',
  '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM',
  '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM'
];


type BookingCell = { label: string; span: number };
type BookingMap = { [room: string]: { [time: string]: string | BookingCell } };
type BuildingData = {
  [building: string]: {
    rooms: Room[];
    bookings: BookingMap;
  };
};

type Room = {
  id: number;
  name: string;
  building: string;
  capacity: number;
  location?: string;
  url?: string;
  avEquipment?: string[];
  isActive: boolean;
};

const StaffBrowseAvailability: React.FC = () => {
  // Removed unused rooms state (data is organized per-building instead)
  const [buildings, setBuildings] = useState<string[]>([]);
  const [buildingData, setBuildingData] = useState<BuildingData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<{ id: number; name: string; time: string } | null>(null);
  const [selectedTimeslotId, setSelectedTimeslotId] = useState<number | null>(null);
  // Booking state now reflects server-confirmed bookings for the selected date/building
  const bookingStateRef = useRef<{[key: string]: boolean}>({});
  const [bookingState, setBookingState] = useState<{[key: string]: boolean}>({});
  const [bookingsLoading, setBookingsLoading] = useState(false);
  // Map UI (roomId-time-date) to concrete timeslot IDs for precise booking
  const [timeslotIdMap, setTimeslotIdMap] = useState<{ [key: string]: number }>({});

  // Helpers to avoid timezone drift from server 'Z' timestamps
  const toLocalYmd = (d: Date): string => {
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Parse an ISO string like 'YYYY-MM-DDTHH:mm:ss.sssZ' and extract HH:mm without applying TZ,
  // then format to UI 'h:mm AM/PM'
  const labelFromIsoIgnoringTZ = (iso: string): string => {
    const m = iso.match(/T(\d{2}):(\d{2})/);
    if (!m) return '';
    let h = parseInt(m[1], 10);
    const min = m[2];
    const mer = h >= 12 ? 'PM' : 'AM';
    if (h === 0) h = 12; // 00 -> 12 AM
    else if (h > 12) h -= 12;
    return `${h}:${min} ${mer}`;
  };

  // Canonical UI label normalizer (ensures pattern 'h:mm AM/PM' no leading zero)
  const normalizeTimeLabel = (label: string): string => {
    const m = label.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!m) return label;
    const h = parseInt(m[1], 10); // strip leading zeros
    const min = m[2];
    const mer = m[3].toUpperCase();
    return `${h}:${min} ${mer}`;
  };

  // Attempt fallback lookup if direct key missing (handles subtle spacing / leading zero mismatches)
  const findTimeslotIdFallback = (roomId: number, label: string, date: string): number | null => {
    const normalized = normalizeTimeLabel(label);
    // Direct attempt after normalization
    const directKey = `${roomId}-${normalized}-${date}`;
    if (timeslotIdMap[directKey]) return timeslotIdMap[directKey];
    // Scan all keys for same room/date with same HH:MM meridian
    const target24 = to24(normalized);
    for (const [key, id] of Object.entries(timeslotIdMap)) {
      if (!key.endsWith(`-${date}`)) continue;
      if (!key.startsWith(`${roomId}-`)) continue;
      const parts = key.split('-');
      // key = roomId-label-date; label may include spaces so reconstruct
      // parts[0]=roomId, parts[last]=date, label = parts.slice(1,-1).join('-') but we never insert '-' into label, so safe
      const keyLabel = parts[1];
      if (to24(normalizeTimeLabel(keyLabel)) === target24) return id;
    }
    return null;
  };

  const to24 = (lbl: string): string => {
    const m = lbl.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!m) return lbl;
    let h = parseInt(m[1], 10);
    const min = m[2];
    const mer = m[3].toUpperCase();
    if (mer === 'AM' && h === 12) h = 0;
    if (mer === 'PM' && h !== 12) h += 12;
    return `${h.toString().padStart(2,'0')}:${min}`;
  };

  // Fetch rooms from API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
  const response = await fetch('http://localhost:4000/rooms?' + new Date().getTime());
        if (!response.ok) {
          throw new Error('Failed to fetch rooms');
        }
  const roomsData: any[] = await response.json();
  console.log('Fetched rooms:', roomsData.length, 'rooms');
        
        // Group rooms by building
        const buildingsSet = new Set<string>();
        const buildingDataMap: BuildingData = {};
        
        // Normalize backend shape (room_name -> name, ensure arrays)
        const normalizedRooms: Room[] = roomsData.map((r: any) => ({
          id: typeof r.id === 'string' ? parseInt(r.id, 10) : r.id,
          name: r.name ?? r.room_name ?? 'Unnamed Room',
          building: r.building,
          capacity: typeof r.capacity === 'string' ? parseInt(r.capacity, 10) : r.capacity,
          location: r.location ?? r.room_location,
          url: r.url,
          avEquipment: Array.isArray(r.avEquipment)
            ? r.avEquipment
            : (typeof r.avEquipment === 'string' ? r.avEquipment.split(';').map((s: string) => s.trim()).filter(Boolean) : []),
          isActive: r.isActive !== false,
        }));

        normalizedRooms.forEach(room => {
          if (room.isActive) {
            buildingsSet.add(room.building);
            if (!buildingDataMap[room.building]) {
              buildingDataMap[room.building] = {
                rooms: [],
                bookings: {}
              };
            }
            buildingDataMap[room.building].rooms.push(room);
          }
        });
        
        setBuildings(Array.from(buildingsSet));
        setBuildingData(buildingDataMap);
        console.log('Buildings:', Array.from(buildingsSet));
        console.log('Building data:', buildingDataMap);
  // Avoid referencing bookingState here to keep effect deps minimal
        
        // Set default selected building
        if (buildingsSet.size > 0) {
          setSelectedBuilding(Array.from(buildingsSet)[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Get rooms and bookings for selected building
  const currentBuildingData = buildingData[selectedBuilding] || { rooms: [], bookings: {} };
  const { rooms: buildingRooms, bookings } = currentBuildingData;

  // Use all rooms for the selected building
  const filteredRooms = buildingRooms;
  const filteredBookings = bookings;

  // Fetch confirmed bookings for all rooms in the selected building & date
  useEffect(() => {
    if (!selectedBuilding || !selectedDate) return;
    const currentRooms = buildingData[selectedBuilding]?.rooms || [];
    if (currentRooms.length === 0) return;

    let cancelled = false;
    const fetchBookings = async () => {
      try {
        setBookingsLoading(true);
        const newState: { [key: string]: boolean } = {};
        // Fetch bookings per room in parallel
        const results = await Promise.all(
          currentRooms.map(async (room) => {
            try {
              const res = await fetch(`http://localhost:4000/booking/room/${room.id}`);
              if (!res.ok) {
                console.warn('Failed to fetch bookings for room', room.id);
                return [];
              }
              const data = await res.json();
              if (!data.success || !Array.isArray(data.bookings)) return [];
              return data.bookings;
            } catch (err) {
              console.error('Error fetching bookings for room', room.id, err);
              return [];
            }
          })
        );

        // Flatten and process bookings
        results.flat().forEach((booking: any) => {
          if (!booking) return;
          if (booking.status !== 'confirmed') return; // only mark active confirmed bookings
          // timeslot relation may be included; fallback to startTime/endTime fields
          const ts = booking.timeslot || { startTime: booking.startTime, endTime: booking.endTime };
          if (!ts?.startTime) return;
          const startIso: string = String(ts.startTime);
          const dateStr = startIso.slice(0, 10); // YYYY-MM-DD
          if (dateStr !== selectedDate) return; // only show bookings matching selected date

          // Format to match UI times array (e.g., '7:30 AM') using TZ-agnostic parse
          const uiTime = labelFromIsoIgnoringTZ(startIso);

          const rid = typeof booking.roomId === 'string' ? parseInt(booking.roomId, 10) : booking.roomId;
          const key = `${rid}-${uiTime}-${selectedDate}`;
          newState[key] = true;
        });

        if (!cancelled) {
          bookingStateRef.current = newState;
          setBookingState(newState);
          console.log('Updated booking state from server:', newState);
        }
      } finally {
        if (!cancelled) setBookingsLoading(false);
      }
    };
    fetchBookings();
    return () => {
      cancelled = true;
    };
  }, [selectedBuilding, selectedDate, buildingData]);

  // Fetch timeslot IDs per room for the selected date to bypass client-side matching
  useEffect(() => {
    if (!selectedBuilding || !selectedDate) return;
    const currentRooms = buildingData[selectedBuilding]?.rooms || [];
    if (currentRooms.length === 0) return;

    let cancelled = false;
    const fetchTimeslotIds = async () => {
      const newMap: { [key: string]: number } = {};
      await Promise.all(
        currentRooms.map(async (room) => {
          try {
            const res = await fetch(`http://localhost:4000/rooms/${room.id}/timeslots?date=${selectedDate}`);
            if (!res.ok) return;
            const raw = await res.json();
            const timeslots = Array.isArray(raw)
              ? raw
              : Array.isArray(raw?.timeslots)
                ? raw.timeslots
                : raw?.data?.timeslots ?? [];
            (timeslots as any[])
              .filter((ts: any) => {
                // also filter client-side to the selected date in case server returns broader range
                const startIso: string = ts.startTime;
                const dateStr = startIso.slice(0, 10); // YYYY-MM-DD
                return dateStr === selectedDate;
              })
              .forEach((ts: any) => {
                const label = labelFromIsoIgnoringTZ(String(ts.startTime));
                const key = `${room.id}-${label}-${selectedDate}`;
                const idNum = typeof ts.id === 'string' ? parseInt(ts.id, 10) : ts.id;
                newMap[key] = idNum;
              });
          } catch {}
        })
      );
      if (!cancelled) setTimeslotIdMap(newMap);
    };
    fetchTimeslotIds();
    return () => { cancelled = true; };
  }, [selectedBuilding, selectedDate, buildingData]);

  // Sync ref with state when state changes (still useful for TimeslotTable consumption)
  useEffect(() => {
    bookingStateRef.current = bookingState;
  }, [bookingState]);

  if (loading) {
    return (
      <GenericPage
        title="Browse Availability"
        description="View available classrooms and time slots for booking"
        userType="staff"
      >
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading rooms...</p>
        </div>
      </GenericPage>
    );
  }

         if (error) {
           return (
             <GenericPage
               title="Browse Availability"
               description="View available classrooms and time slots for booking"
               userType="staff"
             >
               <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
                 <p>Error: {error}</p>
               </div>
             </GenericPage>
           );
         }

        const handleBookRoom = (roomId: number, roomName: string, time: string) => {
          const norm = normalizeTimeLabel(time);
          setSelectedRoom({ id: roomId, name: roomName, time: norm });
          const directKey = `${roomId}-${norm}-${selectedDate}`;
          let id: number | null = typeof timeslotIdMap[directKey] === 'number' ? timeslotIdMap[directKey] : null;
          if (id === null) {
            id = findTimeslotIdFallback(roomId, norm, selectedDate);
            if (id === null) {
              console.warn('TimeslotId not found for label (after fallback attempts):', { roomId, originalTime: time, normalized: norm, date: selectedDate });
            }
          }
          setSelectedTimeslotId(id);
          setShowBookingForm(true);
        };

        const handleBookingSuccess = (resolvedLabel: string) => {
          // Re-fetch bookings so UI reflects server state rather than optimistic local state
          // (Effect watching selectedBuilding/selectedDate will auto-run since buildingData unchanged; force run by tweaking date? Instead call a lightweight fetch here.)
          const runRefresh = async () => {
            if (!selectedBuilding) return;
            const currentRooms = buildingData[selectedBuilding]?.rooms || [];
            if (currentRooms.length === 0) return;
            const newState: { [key: string]: boolean } = {};
            const results = await Promise.all(
              currentRooms.map(async (room) => {
                try {
                  const res = await fetch(`http://localhost:4000/booking/room/${room.id}`);
                  if (!res.ok) return [];
                  const data = await res.json();
                  if (!data.success || !Array.isArray(data.bookings)) return [];
                  return data.bookings;
                } catch { return []; }
              })
            );
            results.flat().forEach((booking: any) => {
              if (!booking || booking.status !== 'confirmed') return;
              const ts = booking.timeslot || { startTime: booking.startTime };
              if (!ts?.startTime) return;
              const startIso: string = String(ts.startTime);
              const dateStr = startIso.slice(0, 10);
              if (dateStr !== selectedDate) return;
                  const uiTime = labelFromIsoIgnoringTZ(startIso);
              const rid = typeof booking.roomId === 'string' ? parseInt(booking.roomId, 10) : booking.roomId;
              const key = `${rid}-${uiTime}-${selectedDate}`;
              newState[key] = true;
            });
            bookingStateRef.current = newState;
            setBookingState(newState);
          };
          runRefresh();
        };

  return (
    <GenericPage
      title="Browse Availability"
      description="View available classrooms and time slots for booking"
      userType="staff"
    >
      <div style={{ marginTop: 16, marginBottom: 24, display: 'flex', gap: 24, alignItems: 'center' }}>
        <div>
          <label htmlFor="date-filter" style={{ fontWeight: 'bold', marginRight: 8 }}>Date:</label>
          <input
            id="date-filter"
            type="date"
            value={selectedDate}
            onChange={e => {
              const picked = e.target.value;
              const todayStr = new Date().toISOString().split('T')[0];
              const maxDate = new Date();
              maxDate.setDate(maxDate.getDate() + 6); // inclusive 7-day window (today + 6)
              const maxStr = maxDate.toISOString().split('T')[0];
              if (picked > maxStr) {
                // Ignore selections beyond allowed range
                return;
              }
              setSelectedDate(picked);
            }}
            min={new Date().toISOString().split('T')[0]}
            max={(() => { const d = new Date(); d.setDate(d.getDate() + 6); return d.toISOString().split('T')[0]; })()}
            style={{ padding: '4px 8px', fontSize: '1rem', marginRight: 8 }}
          />
        </div>
        <div>
          <label htmlFor="building-select" style={{ fontWeight: 'bold', marginRight: 8 }}>Select Building:</label>
          <select
            id="building-select"
            value={selectedBuilding}
            onChange={e => setSelectedBuilding(e.target.value)}
            style={{ padding: '4px 8px', fontSize: '1rem' }}
          >
            {buildings.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>
             <div style={{ marginTop: 8 }}>
               <div style={{ marginBottom: '8px', fontSize: '0.85rem', color: '#555' }}>
                 {bookingsLoading ? 'Refreshing bookings…' : 'Showing confirmed bookings from server'}
               </div>
               <TimeslotTable 
                 times={times} 
                 rooms={filteredRooms} 
                 bookings={filteredBookings}
                 onBookRoom={handleBookRoom}
                 bookingState={bookingStateRef.current}
                 selectedDate={selectedDate}
               />
             </div>
             
              {showBookingForm && selectedRoom && (
                <BookingForm
                  roomId={selectedRoom.id}
                  roomName={selectedRoom.name}
                  selectedTime={selectedRoom.time}
                  selectedDate={selectedDate}
                  timeslotIdOverride={selectedTimeslotId ?? undefined}
                  onClose={() => {
                    setShowBookingForm(false);
                    setSelectedRoom(null);
                    setSelectedTimeslotId(null);
                  }}
                  onSuccess={handleBookingSuccess}
                />
              )}
           </GenericPage>
         );
       };

export default StaffBrowseAvailability;
