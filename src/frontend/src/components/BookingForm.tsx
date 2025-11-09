import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface BookingFormProps {
  roomId: number;
  roomName: string;
  selectedTime: string; // initially requested label (may change if user picks a fallback)
  selectedDate: string;
  // If provided, bypass timeslot matching and use this ID directly
  timeslotIdOverride?: number;
  onClose: () => void;
  // Provide the resolved label actually used for the booking
  onSuccess: (resolvedLabel: string) => void;
}

interface BookingData {
  notes: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ roomId, roomName, selectedTime, selectedDate, timeslotIdOverride, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [bookingData, setBookingData] = useState<BookingData>({
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeslotId, setTimeslotId] = useState<number | null>(null);
  // Effective time label may change when a fallback slot is chosen
  const [effectiveTime, setEffectiveTime] = useState<string>(selectedTime);
  // Optional helpers for visibility and manual fallback when matching fails
  const [showDebug, setShowDebug] = useState(false);
  const [debugAvailableDates, setDebugAvailableDates] = useState<string[]>([]);
  const [debugAvailableTimes, setDebugAvailableTimes] = useState<string[]>([]);
  const [debugSample, setDebugSample] = useState<any[]>([]);
  const [candidateSlots, setCandidateSlots] = useState<Array<{ id: number; label: string }>>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);

  // Helper function to convert 12-hour time to 24-hour format
  const convertTo24Hour = (time12: string): string => {
    const [time, period] = time12.split(' ');
    const [hours, minutes] = time.split(':');
    let hour24 = parseInt(hours);
    if (period === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (period === 'AM' && hour24 === 12) {
      hour24 = 0;
    }
    return `${hour24.toString().padStart(2, '0')}:${minutes}`;
  };

  // Format YYYY-MM-DD using local time (avoid UTC date shift from toISOString)
  const toLocalYmd = (d: Date): string => {
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // TZ-agnostic label generator from ISO string
  const labelFromIsoIgnoringTZ = (iso: string): string => {
    const m = iso.match(/T(\d{2}):(\d{2})/);
    if (!m) return '';
    let h = parseInt(m[1], 10);
    const min = m[2];
    const mer = h >= 12 ? 'PM' : 'AM';
    if (h === 0) h = 12; else if (h > 12) h -= 12;
    return `${h}:${min} ${mer}`;
  };

  // Canonical UI label normalizer to match grid labels (h:mm AM/PM)
  const normalizeTimeLabel = (label: string): string => {
    const m = label.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!m) return label.trim();
    const h = parseInt(m[1], 10);
    const min = m[2];
    const mer = m[3].toUpperCase();
    return `${h}:${min} ${mer}`;
  };

  // Set override immediately if provided
  React.useEffect(() => {
    if (typeof timeslotIdOverride === 'number') {
      setTimeslotId(timeslotIdOverride);
      setError(null);
    }
  }, [timeslotIdOverride]);

  // Fetch timeslot ID when component mounts (only if we don't have an override)
  React.useEffect(() => {
    if (typeof timeslotIdOverride === 'number') return;
    const fetchTimeslotId = async () => {
      try {
        // Ask backend only for timeslots for the selected date to reduce ambiguity
        const response = await fetch(`http://localhost:4000/rooms/${roomId}/timeslots?date=${selectedDate}`);
        if (!response.ok) {
          throw new Error('Failed to fetch timeslots');
        }
        const raw = await response.json();
        // Support both direct array and wrapped shapes
        const timeslots = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.timeslots)
            ? raw.timeslots
            : raw?.data?.timeslots ?? [];
        if (!Array.isArray(timeslots)) {
          console.warn('Unexpected timeslot response shape:', raw);
        }
        console.log('=== TIMESLOT DEBUG START ===');
        console.log('Looking for timeslot with:', { selectedTime, selectedDate });
        console.log('Available timeslots (count):', Array.isArray(timeslots) ? timeslots.length : 'n/a');
        console.log('Timeslots count:', timeslots.length);
        
        // Show available dates and times for debugging (use local date)
        const availableDates = Array.from(new Set((timeslots as any[]).map((ts: any) => String(ts.startTime).slice(0, 10))));
        console.log('Available dates in timeslots:', availableDates);
        
        const availableTimes = (timeslots as any[])
          .filter((ts: any) => String(ts.startTime).slice(0, 10) === selectedDate)
          .map((ts: any) => labelFromIsoIgnoringTZ(String(ts.startTime)));
        console.log('Available times in timeslots:', availableTimes);
        // Save to UI debug state
        setDebugAvailableDates(availableDates);
        setDebugAvailableTimes(availableTimes);

        if (!selectedDate) {
          setError('Please select a date first');
          return;
        }

        const normalizedSelected = normalizeTimeLabel(selectedTime);
        const targetTimeslot = (timeslots as any[]).find((ts: any) => {
          const startIso = String(ts.startTime);
          const endIso = String(ts.endTime);
          const dateStr = startIso.slice(0, 10);
          const uiLabel = labelFromIsoIgnoringTZ(startIso);
          const match = dateStr === selectedDate && uiLabel === normalizedSelected;
          if (!match) {
            // Range fallback in local clock
            const selected24 = convertTo24Hour(normalizedSelected); // HH:MM
            const selectedDateTime = new Date(`${selectedDate}T${selected24}:00`);
            const startDt = new Date(startIso);
            const endDt = new Date(endIso);
            const inRange = selectedDateTime >= startDt && selectedDateTime < endDt && dateStr === selectedDate;
            if (inRange) {
              console.log('Using range fallback match for timeslot:', ts.id);
              return true;
            }
          }
          if (match) {
            console.log('Label match timeslot:', { id: ts.id, uiLabel, selected: normalizedSelected });
          }
          return match;
        });

        if (targetTimeslot) {
          console.log('✅ Found matching timeslot:', targetTimeslot);
          setTimeslotId(targetTimeslot.id);
        } else {
          console.log('❌ No matching timeslot found');
          console.log('Selected:', { selectedDate, selectedTime });
          console.log('Sample of timeslots:', (timeslots as any[]).slice(0, 5));
          setError('No timeslot found for the selected time and date');
          setDebugSample((timeslots as any[]).slice(0, 5));
          // Build candidate slots for this date to allow manual selection
          const candidates = (timeslots as any[])
            .filter((ts: any) => String(ts.startTime).slice(0, 10) === selectedDate)
            // enforce business window 07:30 - 19:00 inclusive
            .filter((ts: any) => {
              const iso = String(ts.startTime);
              const h = parseInt(iso.match(/T(\d{2}):/)?.[1] || '0', 10);
              const m = parseInt(iso.match(/T\d{2}:(\d{2})/)?.[1] || '0', 10);
              const minutes = h * 60 + m;
              const startWindow = 7 * 60 + 30; // 07:30
              const endWindow = 19 * 60; // 19:00 exact
              return minutes >= startWindow && minutes <= endWindow;
            })
            .map((ts: any) => {
              const label = labelFromIsoIgnoringTZ(String(ts.startTime));
              return { id: ts.id as number, label };
            })
            // sort by time ascending for usability
            .sort((a: any, b: any) => {
              const toMinutes = (lbl: string) => {
                const [time, mer] = lbl.split(' ');
                let [h, m] = time.split(':').map((x: string) => parseInt(x));
                if (mer === 'PM' && h !== 12) h += 12;
                if (mer === 'AM' && h === 12) h = 0;
                return h * 60 + m;
              };
              return toMinutes(a.label) - toMinutes(b.label);
            });
          setCandidateSlots(candidates);
          setSelectedCandidateId(candidates.length ? candidates[0].id : null);
        }
        console.log('=== TIMESLOT DEBUG END ===');
      } catch (err) {
        setError('Failed to fetch timeslot information');
      }
    };
    fetchTimeslotId();
  }, [roomId, selectedTime, selectedDate, timeslotIdOverride]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!user) {
      setError('You must be logged in to make a booking');
      setLoading(false);
      return;
    }

    if (!timeslotId) {
      setError('Timeslot not found. Please try again.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      
      const bookingPayload = {
        roomId: Number(roomId),
        timeslotId: Number(timeslotId),
        notes: bookingData.notes,
      };
      
      console.log('Creating booking with payload:', bookingPayload);
      console.log('roomId type:', typeof roomId, 'value:', roomId);
      console.log('timeslotId type:', typeof timeslotId, 'value:', timeslotId);
      
      const response = await fetch('http://localhost:4000/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }

      const result = await response.json();
      console.log('Booking created:', result);
      
      // Show success message
      alert('Booking created successfully!');
      
  onSuccess(effectiveTime);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '560px',
        width: '90%',
        maxHeight: '85vh',
        overflowY: 'auto',
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>
          Book Room: {roomName}
        </h2>
        <p style={{ marginBottom: '1rem', color: '#666' }}>
          <strong>Selected Time:</strong> {effectiveTime}
        </p>

        {/* Lightweight debug toggle for visibility when matching fails */}
        <div style={{ marginBottom: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setShowDebug(v => !v)}
            style={{
              padding: '2px 6px',
              border: '1px solid #ccc',
              borderRadius: 4,
              background: '#f7f7f7',
              cursor: 'pointer',
              fontSize: 12
            }}
          >
            {showDebug ? 'Hide debug' : 'Show debug'}
          </button>
        </div>
        {showDebug && (
          <div style={{ background: '#fafafa', border: '1px dashed #ccc', borderRadius: 6, padding: 8, marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: '#333' }}>
              <div><strong>Available dates:</strong> {debugAvailableDates.join(', ') || '(none)'}</div>
              <div><strong>Available times (24h):</strong> {debugAvailableTimes.join(', ') || '(none)'}</div>
              {debugSample.length > 0 && (
                <details style={{ marginTop: 6 }}>
                  <summary style={{ cursor: 'pointer' }}>Sample of timeslots</summary>
                  <pre style={{ fontSize: 11, whiteSpace: 'pre-wrap' }}>{JSON.stringify(debugSample, null, 2)}</pre>
                </details>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="notes" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Notes (Optional):
            </label>
            <textarea
              id="notes"
              value={bookingData.notes}
              onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
                minHeight: '80px',
                resize: 'vertical',
              }}
              placeholder="Additional details about your booking..."
            />
          </div>


          {error && (
            <div style={{
              color: 'red',
              marginBottom: '1rem',
              padding: '0.5rem',
              backgroundColor: '#ffe6e6',
              border: '1px solid #ffcccc',
              borderRadius: '4px',
            }}>
              {error}
              {/* Fallback selector when no exact match found */}
              {candidateSlots.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 12, color: '#333', marginBottom: 4 }}>
                    Select a timeslot for {selectedDate}:
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <select
                      value={selectedCandidateId ?? ''}
                      onChange={(e) => setSelectedCandidateId(parseInt(e.target.value))}
                      style={{ padding: '4px 6px' }}
                    >
                      {candidateSlots.map(slot => (
                        <option key={slot.id} value={slot.id}>{slot.label}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedCandidateId) {
                          setTimeslotId(selectedCandidateId);
                          const chosen = candidateSlots.find(c => c.id === selectedCandidateId);
                          if (chosen) setEffectiveTime(chosen.label);
                          setError(null);
                        }
                      }}
                      style={{ padding: '4px 8px', background: '#28a745', border: 'none', color: '#fff', borderRadius: 4, cursor: 'pointer' }}
                    >
                      Use this timeslot
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: loading ? '#ccc' : '#007bff',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
              }}
            >
              {loading ? 'Creating...' : 'Create Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
