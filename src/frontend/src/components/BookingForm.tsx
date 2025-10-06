import React, { useState } from 'react';

interface BookingFormProps {
  roomId: number;
  roomName: string;
  selectedTime: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface BookingData {
  title: string;
  description: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ roomId, roomName, selectedTime, onClose, onSuccess }) => {
  const [bookingData, setBookingData] = useState<BookingData>({
    title: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/booking/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // In a real app, you'd include the JWT token here
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          roomId,
          timeslotId: 1, // For now, use a dummy timeslot ID
          title: bookingData.title,
          description: bookingData.description,
        }),
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
            <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Booking Title:
            </label>
            <input
              id="title"
              type="text"
              value={bookingData.title}
              onChange={(e) => setBookingData({ ...bookingData, title: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
              }}
              placeholder="e.g., Team Meeting, Study Session"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Description (Optional):
            </label>
            <textarea
              id="description"
              value={bookingData.description}
              onChange={(e) => setBookingData({ ...bookingData, description: e.target.value })}
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
