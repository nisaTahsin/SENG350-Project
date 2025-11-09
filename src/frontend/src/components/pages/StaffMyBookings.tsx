import React, { useState, useEffect } from 'react';
import GenericPage from '../GenericPage';

// Shape returned by backend /booking/me (via TypeORM entity serialization)
interface ApiBooking {
  id: number;
  roomId: number;
  timeslotId: number;
  status: string; // confirmed | cancelled | pending | etc.
  notes?: string;
  createdAt: string;
  actualStudents?: number; // class size stored as actualStudents
  // Added relations from extended /booking/me
  room?: {
    id: number;
    room_name?: string;
    building?: string;
    capacity?: number;
    location?: string;
    avEquipment?: string; // optional AV equipment info (camelCase)
    av_equipment?: string; // optional AV equipment info (snake_case)
    equipment?: string; // possible alternate field name
  };
  timeslot?: {
    id: number;
    startTime: string;
    endTime: string;
  };
}

interface RoomDetailsResult {
  id: number;
  room_name: string; // assuming raw query or serialization from entity may differ
  roomName?: string; // fallback
  building: string;
  capacity: number;
  location?: string;
  avEquipment?: string; // optional
  av_equipment?: string; // optional
  equipment?: string; // optional alternate
}

interface DisplayBooking {
  id: number;
  status: string;
  roomName: string;
  building: string;
  capacity?: number;
  actualStudents?: number;
  location?: string;
  avEquipment?: string;
  createdAt: string;
  notes?: string;
  startTime?: string;
  endTime?: string;
  date?: string;
  isPast?: boolean;
}

const StaffMyBookings: React.FC = () => {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [bookings, setBookings] = useState<DisplayBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showPast, setShowPast] = useState<boolean>(false);

  // Helpers to format timeslot date/time in local schedule terms
  const toLocalYmd = (d: Date): string => {
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  // Parse an ISO string like 'YYYY-MM-DDTHH:mm:ss.sssZ' without applying TZ
  const labelFromIsoIgnoringTZ = (iso: string): string => {
    const m = iso.match(/T(\d{2}):(\d{2})/);
    if (!m) return '';
    let h = parseInt(m[1], 10);
    const min = m[2];
    const mer = h >= 12 ? 'PM' : 'AM';
    if (h === 0) h = 12; else if (h > 12) h -= 12;
    return `${h}:${min} ${mer}`;
  };

  // Safe pretty formatter for YYYY-MM-DD without constructing a Date object
  const prettyYmd = (ymd?: string): string => {
    if (!ymd) return '';
    const m = ymd.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return ymd;
    const [, y, mm, dd] = m;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const idx = parseInt(mm, 10) - 1;
    const name = monthNames[idx] ?? mm;
    return `${name} ${parseInt(dd, 10)}, ${y}`;
  };

  // Parse ISO string into Date for comparison (returns null if invalid)
  const parseIsoToDate = (iso?: string): Date | null => {
    if (!iso) return null;
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
  };

  // Parse AV equipment string into a list of items.
  // Primary separator is ';'. We trim and filter empties, and handle one known
  // combined phrase ("Podium; Projectors present against wall").
  const parseAvEquipment = (s?: string): string[] => {
    if (!s) return [];
    // Split on semicolons; do not split on commas because those are used inside parentheses
    const raw = s.split(';').map(part => part.trim()).filter(Boolean);
    if (raw.length === 0) return [];
    const items: string[] = [];
    for (let i = 0; i < raw.length; i++) {
      const cur = raw[i];
      const next = raw[i + 1];
      // Merge specific known pair to match desired formatting example
      if (cur === 'Podium' && next === 'Projectors present against wall') {
        items.push(`${cur}; ${next}`);
        i++; // skip next
        continue;
      }
      items.push(cur);
    }
    return items;
  };

  // Fetch user's bookings from backend
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }
        const resp = await fetch('http://localhost:4000/booking/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await resp.json();
        if (!data.success) {
          setError(data.message || 'Failed to load bookings');
          setLoading(false);
          return;
        }
        const apiBookings: ApiBooking[] = data.bookings || [];

        // Fallback fetch for any bookings missing the room relation (older backend or cache)
        const missingRoomIds = Array.from(new Set(apiBookings.filter(b => !b.room).map(b => b.roomId)));
        const roomFallbackMap: Record<number, RoomDetailsResult> = {};
        if (missingRoomIds.length > 0) {
          await Promise.all(missingRoomIds.map(async (roomId) => {
            try {
              const r = await fetch(`http://localhost:4000/rooms/${roomId}`);
              const rd = await r.json();
              if (rd && rd.id) roomFallbackMap[roomId] = rd;
              else if (rd?.room) roomFallbackMap[roomId] = rd.room;
            } catch (_) { /* ignore */ }
          }));
        }

        const now = Date.now();
        const display: DisplayBooking[] = apiBookings.map(b => {
          const roomData = b.room || roomFallbackMap[b.roomId];
          const roomName = (roomData as any)?.room_name || (roomData as any)?.roomName || `Room ${b.roomId}`;
          const building = roomData?.building || 'Unknown';
          const capacity = roomData?.capacity;
          const location = roomData?.location;
          const avEquipment = (roomData as any)?.avEquipment || (roomData as any)?.av_equipment || (roomData as any)?.equipment;
          let date: string | undefined;
          let start: string | undefined;
          let end: string | undefined;
          let isPast = false;
          if (b.timeslot?.startTime) {
            // Use the ISO date part for the calendar day and derive labels without TZ shifts
            const startIso = String(b.timeslot.startTime);
            const endIso = String(b.timeslot.endTime);
            date = startIso.slice(0, 10); // YYYY-MM-DD
            start = labelFromIsoIgnoringTZ(startIso);
            end = labelFromIsoIgnoringTZ(endIso);
            const endDt = parseIsoToDate(endIso);
            if (endDt && endDt.getTime() < now) {
              isPast = true;
            }
          }
          // Treat cancelled as part of past/archived
          if (b.status === 'cancelled') isPast = true;
          return {
            id: b.id,
            status: b.status,
            roomName,
            building,
            capacity,
            actualStudents: b.actualStudents,
            location,
            avEquipment,
            createdAt: b.createdAt,
            notes: b.notes,
            startTime: start,
            endTime: end,
            date,
            isPast,
          };
        });
        setBookings(display);
      } catch (err: any) {
        setError(err.message || 'Unexpected error loading bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const toggleExpanded = (id: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleCancel = async (id: number) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Not authenticated');
      return;
    }
    if (!window.confirm('Cancel this booking?')) return;
    try {
      setRefreshing(true);
      const resp = await fetch(`http://localhost:4000/booking/${id}/cancel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await resp.json();
      if (!data.success) {
        alert(data.message || 'Failed to cancel booking');
        setRefreshing(false);
        return;
      }
      // Update status locally
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    } catch (err: any) {
      alert(err.message || 'Error cancelling booking');
    } finally {
      setRefreshing(false);
    }
  };

  // Date filter now based on timeslot date (fallback to createdAt)
  const isArchived = (b: DisplayBooking) => b.isPast || b.status === 'cancelled';
  const filteredBookings = (
    selectedDate
      ? bookings.filter(b => (b.date || b.createdAt.split('T')[0]) === selectedDate)
      : bookings
  )
    .filter(b => (isArchived(b) ? showPast : true))
    .sort((a, b) => {
      // Use timeslot date if available, else createdAt date part
      const aDateStr = a.date || a.createdAt.split('T')[0];
      const bDateStr = b.date || b.createdAt.split('T')[0];
      // Direct string comparison works for YYYY-MM-DD
      if (aDateStr < bDateStr) return -1;
      if (aDateStr > bDateStr) return 1;
      // If same date, optionally sort by startTime if present
      if (a.startTime && b.startTime) {
        const toMinutes = (lbl: string) => {
          const [time, mer] = lbl.split(' ');
          let [h, m] = time.split(':').map(x => parseInt(x, 10));
          if (mer === 'PM' && h !== 12) h += 12;
          if (mer === 'AM' && h === 12) h = 0;
          return h * 60 + m;
        };
        return toMinutes(a.startTime) - toMinutes(b.startTime);
      }
      return 0;
    });

  // Group by date (preserves sorted order)
  const groupedByDate: Array<{ date: string; items: DisplayBooking[] }> = [];
  filteredBookings.forEach((b) => {
    const d = b.date || b.createdAt.split('T')[0];
    const last = groupedByDate[groupedByDate.length - 1];
    if (last && last.date === d) {
      last.items.push(b);
    } else {
      groupedByDate.push({ date: d, items: [b] });
    }
  });

    if (loading) {
      return (
        <GenericPage title="My Bookings" description="View and manage your current bookings" userType="staff">
          <p>Loading bookings...</p>
        </GenericPage>
      );
    }

    if (error) {
      return (
        <GenericPage title="My Bookings" description="View and manage your current bookings" userType="staff">
          <p style={{ color: 'red' }}>{error}</p>
        </GenericPage>
      );
    }

    return (
    <GenericPage
      title="My Bookings"
      description="View and manage your current bookings"
      userType="staff"
    >
      <div style={{ marginTop: 16, marginBottom: 24, display: 'flex', gap: 24, alignItems: 'center' }}>
        <div>
          <label htmlFor="date-filter" style={{ fontWeight: 'bold', marginRight: 8 }}>Date:</label>
          <input
            id="date-filter"
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            style={{ padding: '4px 8px', fontSize: '1rem', marginRight: 8 }}
          />
        </div>
        <div>
          <label htmlFor="toggle-past" style={{ fontWeight: 'bold', marginRight: 8 }}>Show booking history</label>
          <input
            id="toggle-past"
            type="checkbox"
            checked={showPast}
            onChange={e => setShowPast(e.target.checked)}
          />
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        {groupedByDate.map(group => (
          <div key={group.date} style={{ marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#0b3d6e' }}>{prettyYmd(group.date)}</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {group.items.map((b) => (
            <li
              key={b.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: 8,
                padding: '12px 16px',
                marginBottom: 12,
                background: '#fff',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ margin: 0 }}>Booking #{b.id}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      padding: '2px 8px',
                      borderRadius: 999,
                      background: b.status === 'cancelled' ? '#fbeaea' : (b.isPast ? '#eee' : '#e6f6ef'),
                      color: b.status === 'cancelled' ? '#a11' : (b.isPast ? '#555' : '#127c56'),
                      border: b.status === 'cancelled' ? '1px solid #c33' : (b.isPast ? '1px solid #ddd' : '1px solid #bfe8d7'),
                    }}
                  >
                    {b.status === 'cancelled' ? 'Cancelled' : (b.isPast ? 'Passed' : 'Upcoming')}
                  </span>
                  <span style={{ color: '#555' }}>{b.date ? prettyYmd(b.date) : new Date(b.createdAt).toISOString().split('T')[0]}</span>
                </div>
              </div>
              <div style={{ marginTop: 6, color: '#333' }}>
                <div>
                  <strong>Room:</strong> {b.roomName}
                </div>
                <div>
                  <strong>Building:</strong> {b.building}
                </div>
                <div>
                  <strong>Location:</strong> {b.location ?? 'N/A'}
                </div>
                <div>
                  <strong>Status:</strong> {b.status}
                </div>
                {b.startTime && b.endTime && (
                  <div>
                    <strong>Timeslot:</strong> {b.startTime} - {b.endTime}
                  </div>
                )}
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  style={{
                    padding: '6px 10px',
                    borderRadius: 6,
                    border: '1px solid #bbb',
                    background: '#f7f7f7',
                    cursor: 'pointer',
                  }}
                  onClick={() => toggleExpanded(b.id)}
                >
                  {expandedIds.has(b.id) ? 'Hide details' : 'Details'}
                </button>
                {!b.isPast && b.status !== 'cancelled' && (
                  <button
                    type="button"
                    style={{
                      padding: '6px 10px',
                      borderRadius: 6,
                      border: '1px solid #c33',
                      background: '#fbeaea',
                      color: '#a11',
                      cursor: 'pointer',
                    }}
                    disabled={refreshing}
                    onClick={() => handleCancel(b.id)}
                  >
                    Cancel
                  </button>
                )}
              </div>
              {expandedIds.has(b.id) && (
                <div
                  style={{
                    marginTop: 12,
                    padding: '10px 12px',
                    background: '#fafafa',
                    border: '1px solid #eee',
                    borderRadius: 6,
                  }}
                >
                  <div style={{ marginBottom: 6 }}>
                    <strong>Created:</strong> {new Date(b.createdAt).toLocaleString()}
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <strong>Capacity:</strong> {b.capacity ?? 'N/A'}
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <strong>Class Size:</strong> {typeof b.actualStudents === 'number' ? b.actualStudents : 'N/A'}
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <strong>AV Equipment:</strong>{' '}
                    {parseAvEquipment(b.avEquipment).length === 0 ? (
                      <span>N/A</span>
                    ) : (
                      <ul style={{ margin: '4px 0 0 16px' }}>
                        {parseAvEquipment(b.avEquipment).map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {b.notes && (
                    <div style={{ marginBottom: 6 }}>
                      <strong>Notes:</strong> {b.notes}
                    </div>
                  )}
                </div>
              )}
            </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </GenericPage>
  );
};

export default StaffMyBookings;
