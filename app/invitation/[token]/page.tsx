'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function InvitationPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [guest, setGuest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmedAdults, setConfirmedAdults] = useState('');
  const [confirmedChildren, setConfirmedChildren] = useState('');
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchGuest();
  }, [token]);

  const fetchGuest = async () => {
    try {
      const response = await fetch(`/api/guest/${token}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid token');
      }

      setGuest(data);
      setConfirmedAdults(data.confirmed_adults?.toString() || data.adults.toString());
      setConfirmedChildren(data.confirmed_children?.toString() || data.children.toString());
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => router.push('/'), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (status: string) => {
    setUpdating(true);
    setError('');

    try {
      const response = await fetch(`/api/guest/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          confirmedAdults: parseInt(confirmedAdults),
          confirmedChildren: parseInt(confirmedChildren)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update');
      }

      setSuccess(true);
      setGuest(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="container"><p>Loading invitation...</p></div>;
  }

  if (error && !guest) {
    return (
      <div className="container">
        <div className="error-message">
          <h2>Invalid Invitation</h2>
          <p>{error}</p>
          <p>Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="invitation-card">
        <h1 style={{ textAlign: 'center', color: '#d97706', marginBottom: '30px' }}>
          You're Invited to Chela Bash 2026!
        </h1>

        <p style={{ fontSize: '1.2rem', textAlign: 'center', marginBottom: '30px' }}>
          Dear {guest.full_name},
        </p>

        <p style={{ fontSize: '1.1rem', textAlign: 'center', marginBottom: '40px', lineHeight: '1.8' }}>
          Join us for a Celebration of Life honoring our beloved 98-year-old Grandmother. 
          All generations of our family are invited, with a special welcome to the young ones.
        </p>

        <div className="info-section">
          <h3>Event Details</h3>
          <p><strong>Date:</strong> Saturday, January 17th, 2026</p>
          <p><strong>Time:</strong> 11:00 AM - 3:00 PM</p>
        </div>

        <div className="info-section">
          <h3>Venue</h3>
          <p><strong>Epic Events Center</strong></p>
          <p>12469 Foothill Boulevard</p>
          <p>Rancho Cucamonga, CA 91739</p>
          <p><a href="https://epiceventscenter.com" target="_blank" rel="noopener noreferrer" style={{ color: '#f59e0b' }}>epiceventscenter.com</a></p>
        </div>

        <div className="info-section">
          <h3>Dress Code</h3>
          <p>Semi-formal / Cocktail attire</p>
          <p>Celebrate in style as we honor this special milestone!</p>
        </div>

        <div className="info-section">
          <h3>Parking Information</h3>
          <p>Free parking available at Epic Events Center</p>
          <p>Additional street parking nearby</p>
        </div>

        <div className="info-section">
          <h3>A Message from the Family</h3>
          <p>
            We are thrilled to celebrate this incredible milestone with our beloved grandmother! 
            Your presence would mean the world to us and to her. Join us for an afternoon of joy, 
            laughter, cherished memories, and celebration across all generations.
          </p>
          <p style={{ marginTop: '15px' }}>
            Lunch and refreshments will be served. We look forward to creating beautiful memories together!
          </p>
        </div>

        <div className="info-section">
          <h3>Additional Information</h3>
          <p>• Please arrive by 10:45 AM for seating</p>
          <p>• Photography and videography will be available</p>
          <p>• Kids' activities will be provided</p>
          <p>• For dietary restrictions, please note in your confirmation</p>
        </div>
      </div>

      <div className="form-card">
        <h2 style={{ marginBottom: '20px', color: '#667eea' }}>Confirm Your Attendance</h2>

        {success && (
          <div className="success-message">
            Thank you for confirming! We look forward to seeing you.
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <p style={{ marginBottom: '20px' }}>
          <strong>Current Status:</strong>{' '}
          <span className={`status-badge status-${guest.status}`}>
            {guest.status.toUpperCase()}
          </span>
        </p>

        <div className="form-group">
          <label htmlFor="confirmedAdults">Number of Adults Attending</label>
          <input
            type="number"
            id="confirmedAdults"
            value={confirmedAdults}
            onChange={(e) => setConfirmedAdults(e.target.value)}
            min="0"
            max={guest.adults}
          />
          <small>Originally RSVP'd: {guest.adults}</small>
        </div>

        <div className="form-group">
          <label htmlFor="confirmedChildren">Number of Children Attending</label>
          <input
            type="number"
            id="confirmedChildren"
            value={confirmedChildren}
            onChange={(e) => setConfirmedChildren(e.target.value)}
            min="0"
            max={guest.children}
          />
          <small>Originally RSVP'd: {guest.children}</small>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button
            onClick={() => handleConfirm('confirmed')}
            className="btn btn-primary"
            disabled={updating}
            style={{ flex: 1 }}
          >
            {updating ? 'Updating...' : 'Confirm Attendance'}
          </button>
          <button
            onClick={() => handleConfirm('declined')}
            className="btn btn-secondary"
            disabled={updating}
            style={{ flex: 1 }}
          >
            {updating ? 'Updating...' : 'Decline'}
          </button>
        </div>
      </div>
    </div>
  );
}
