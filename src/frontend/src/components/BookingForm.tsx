import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface BookingFormProps {
  roomId: number;
  roomName: string;
  selectedTime: string;
  selectedDate: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface BookingData {
  notes: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ roomId, roomName, selectedTime, selectedDate, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [bookingData, setBookingData] = useState<BookingData>({
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeslotId, setTimeslotId] = useState<number | null>(null);

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

  // Fetch timeslot ID when component mounts
  React.useEffect(() => {
    const fetchTimeslotId = async () => {
      try {
        const response = await fetch(`http://localhost:4000/rooms/${roomId}/timeslots`);
        if (!response.ok) {
          throw new Error('Failed to fetch timeslots');
        }
        const timeslots = await response.json();
        console.log('=== TIMESLOT DEBUG START ===');
        console.log('Looking for timeslot with:', { selectedTime, selectedDate });
        console.log('Available timeslots:', timeslots);
        console.log('Timeslots count:', timeslots.length);
        
        // Show available dates and times for debugging
        const availableDates = Array.from(new Set(timeslots.map((ts: any) => {
          const startTime = new Date(ts.startTime);
          return startTime.toISOString().split('T')[0];
        })));
        console.log('Available dates in timeslots:', availableDates);
        
        const availableTimes = timeslots.map((ts: any) => {
          const startTime = new Date(ts.startTime);
          return startTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
        });
        console.log('Available times in timeslots:', availableTimes);

        if (!selectedDate) {
          setError('Please select a date first');
          return;
        }

        const targetTimeslot = timeslots.find((ts: any) => {
          const startTime = new Date(ts.startTime);
          const endTime = new Date(ts.endTime);
          
          // Convert frontend time to a Date object for comparison (in UTC)
          const frontendTime24 = convertTo24Hour(selectedTime);
          const [hours, minutes] = frontendTime24.split(':');
          const selectedDateTime = new Date(selectedDate + 'T' + frontendTime24 + ':00.000Z');
          
          console.log('Time conversion debug:', {
            selectedTime,
            frontendTime24,
            hours,
            minutes,
            selectedDate,
            selectedDateTime: selectedDateTime.toISOString()
          });

          const dateString = startTime.toISOString().split('T')[0];
          
          console.log('Checking timeslot:', {
            timeslotId: ts.id,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            selectedDateTime: selectedDateTime.toISOString(),
            frontendTime24,
            dateString,
            selectedDate,
            isWithinTimeRange: selectedDateTime >= startTime && selectedDateTime < endTime,
            matchesDate: dateString === selectedDate
          });
          
          // Check if the selected time falls within this timeslot's time range
          return selectedDateTime >= startTime && selectedDateTime < endTime && dateString === selectedDate;
        });

        if (targetTimeslot) {
          console.log('✅ Found matching timeslot:', targetTimeslot);
          setTimeslotId(targetTimeslot.id);
        } else {
          console.log('❌ No matching timeslot found');
          setError('No timeslot found for the selected time and date');
        }
        console.log('=== TIMESLOT DEBUG END ===');
      } catch (err) {
        setError('Failed to fetch timeslot information');
      }
    };
    fetchTimeslotId();
  }, [roomId, selectedTime, selectedDate]);

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
      
      onSuccess();
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
        maxWidth: '500px',
        width: '90%',
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>
          Book Room: {roomName}
        </h2>
        <p style={{ marginBottom: '1rem', color: '#666' }}>
          <strong>Selected Time:</strong> {selectedTime}
        </p>

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
