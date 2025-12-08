'use client';

import { useState } from 'react';

export default function SaveTheDatePage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    relationship: '',
    attendance: 'attending',
    adults: '1',
    children: '0',
  });
  const [childrenList, setChildrenList] = useState<Array<{name: string, age: string, relationship: string}>>([
    { name: '', age: '', relationship: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAttendanceStatus(formData.attendance);

    try {
      const childrenDetails = childrenList
        .filter(child => child.name.trim())
        .map(child => `${child.name} (Age: ${child.age}, Relationship: ${child.relationship})`)
        .join('; ');

      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, childrenDetails })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit RSVP');
      }

      setToken(data.token);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleChildChange = (index: number, field: string, value: string) => {
    const updated = [...childrenList];
    updated[index] = { ...updated[index], [field]: value };
    setChildrenList(updated);
  };

  const addChild = () => {
    setChildrenList([...childrenList, { name: '', age: '', relationship: '' }]);
  };

  const removeChild = (index: number) => {
    if (childrenList.length > 1) {
      setChildrenList(childrenList.filter((_, i) => i !== index));
    }
  };

  if (success) {
    if (attendanceStatus === 'unable') {
      return (
        <div className="home-wrapper">
          <div className="home-container">
            <div className="success-card">
              <div className="success-icon">💐</div>
              <h2>Thank You for Your Response!</h2>
              <p className="success-main-text">
                We're sorry you won't be able to join us for this special celebration. 
                Your response helps us with our planning, and we truly appreciate you letting us know.
              </p>
              <p className="success-sub-text">
                Even though you can't attend, please save the date and keep our beloved grandmother 
                in your thoughts on this special day.
              </p>
              <div className="save-date-box">
                <h3>Save the Date</h3>
                <p><strong>Saturday, January 17th, 2026</strong></p>
                <p>11:00 AM - 3:00 PM</p>
                <p>Rancho Cucamonga, California</p>
                <button 
                  onClick={() => {
                    const event = {
                      title: 'Chela Bash 2026 - Celebration of Life',
                      description: 'Celebration of Life for our beloved 98-year-old Grandmother at Epic Events Center',
                      location: 'Epic Events Center, 12469 Foothill Boulevard, Rancho Cucamonga, CA 91739',
                      start: '20260117T110000',
                      end: '20260117T150000'
                    };
                    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${event.start}
DTEND:${event.end}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;
                    const blob = new Blob([icsContent], { type: 'text/calendar' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'chela-bash-2026.ics';
                    a.click();
                  }}
                  className="btn btn-primary"
                  style={{ marginTop: '20px' }}
                >
                  Add to Calendar
                </button>
              </div>
              <p className="success-closing">
                With warm regards,<br />
                <strong>The Family</strong> ❤️
              </p>
            </div>
          </div>

          <div className="dev-credit">
            Developed with ❤️ by <a href="https://waqarh.com" target="_blank" rel="noopener noreferrer">Waqar H.</a>
          </div>
        </div>
      );
    }

    return (
      <div className="home-wrapper">
        <div className="home-container">
          <div className="success-card">
            <div className="success-icon">🎉</div>
            <h2>Thank You for Your RSVP!</h2>
            <p className="success-main-text">
              Your presence means the world to us and to our beloved grandmother. 
              We are truly blessed to have you join us in celebrating this incredible milestone.
            </p>
            <p className="success-sub-text">
              Your response helps us plan every detail of this unforgettable 98th Celebration of Life 
              with love and care. We can't wait to create beautiful memories together!
            </p>
            <div className="token-box">
              <p><strong>Your Personal Invitation Token:</strong></p>
              <code className="token-code">{token}</code>
              <p className="token-instruction">Please save this special token safely</p>
            </div>
            <div className="success-next-steps">
              <h3>What's Next?</h3>
              <div className="next-step-item">
                <span className="step-number">1</span>
                <p>Keep this token in a safe place</p>
              </div>
              <div className="next-step-item">
                <span className="step-number">2</span>
                <p>You'll receive a personalized invitation link via email</p>
              </div>
              <div className="next-step-item">
                <span className="step-number">3</span>
                <p>Use your token to access full event details and confirm your attendance</p>
              </div>
            </div>
            <p className="success-closing">
              With gratitude and excitement,<br />
              <strong>The Family</strong> ❤️
            </p>
          </div>
        </div>

        <div className="dev-credit">
          Developed with ❤️ by <a href="https://waqarh.com" target="_blank" rel="noopener noreferrer">Waqar H.</a>
        </div>
      </div>
    );
  }

  return (
    <div className="home-wrapper">
      <div className="home-container">
        <div className="home-hero">
          <div className="hero-content">
            <h1 className="hero-title">Chela Bash 2026!</h1>
            
            <div className="hero-image-wrapper-inline">
              <div className="image-frame">
                <img 
                  src="/grandmother.jpg" 
                  alt="Grandmother" 
                  className="hero-image-modern"
                />
              </div>
            </div>

            <p className="hero-subtitle">Celebration of Life for our beloved 98-year-old Grandmother. All generations of our family are invited, with a special welcome to the young ones.</p>
            
            <div className="hero-details">
              <div className="detail-item">
                <div>
                  <div className="detail-label">Event Date</div>
                  <div className="detail-value">Saturday, January 17th, 2026</div>
                </div>
              </div>
              <div className="detail-item">
                <div>
                  <div className="detail-label">Time</div>
                  <div className="detail-value">11:00 AM - 3:00 PM</div>
                </div>
              </div>
              <div className="detail-item">
                <div>
                  <div className="detail-label">Location</div>
                  <div className="detail-value">Rancho Cucamonga, California</div>
                </div>
              </div>
              <div className="detail-item rsvp-deadline">
                <div>
                  <div className="detail-label">RSVP Deadline</div>
                  <div className="detail-value">Sunday, December 28th, 2025 at 5:00 PM</div>
                </div>
              </div>
            </div>

            <p className="venue-note">Full location details will be shared in the formal invitation</p>

            <div className="audio-section">
              <audio 
                controls 
                className="audio-player-modern"
                onLoadedMetadata={(e) => {
                  const audio = e.target as HTMLAudioElement;
                  audio.currentTime = 6;
                }}
              >
                <source src="/chela-bash-audio.mp3" type="audio/mpeg" />
              </audio>
            </div>

            {!showForm && (
              <div className="button-group">
                <button onClick={() => setShowForm(true)} className="btn btn-primary btn-large">
                  RSVP Now
                </button>
                <button 
                  onClick={() => {
                    const event = {
                      title: 'Chela Bash 2026 - Celebration of Life',
                      description: 'Celebration of Life for our beloved 98-year-old Grandmother at Epic Events Center',
                      location: 'Epic Events Center, 12469 Foothill Boulevard, Rancho Cucamonga, CA 91739',
                      start: '20260117T110000',
                      end: '20260117T150000'
                    };
                    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${event.start}
DTEND:${event.end}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;
                    const blob = new Blob([icsContent], { type: 'text/calendar' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'chela-bash-2026.ics';
                    a.click();
                  }}
                  className="btn btn-secondary btn-calendar"
                >
                  Save the Date
                </button>
              </div>
            )}
          </div>
        </div>

        {showForm && (
          <div className="rsvp-form-section">
            <h2 className="form-title">RSVP for Chela Bash 2026</h2>
            <p className="form-subtitle rsvp-deadline-note">Please RSVP by Sunday, December 28th, 2025 at 5:00 PM</p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="rsvp-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Primary Guest Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="relationship">Relationship to Marcela Garcia *</label>
                  <input
                    type="text"
                    id="relationship"
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleChange}
                    placeholder="e.g., Granddaughter, Friend, Neighbor"
                    required
                  />
                </div>
              </div>

              <div className="form-group attendance-group">
                <label>Will you be attending? *</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="attendance"
                      value="attending"
                      checked={formData.attendance === 'attending'}
                      onChange={handleChange}
                      required
                    />
                    <span>Yes, I'll be attending</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="attendance"
                      value="unable"
                      checked={formData.attendance === 'unable'}
                      onChange={handleChange}
                      required
                    />
                    <span>Unable to Attend</span>
                  </label>
                </div>
              </div>

              {formData.attendance === 'attending' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="adults">Number of Adults (age 16 and over) *</label>
                      <input
                        type="number"
                        id="adults"
                        name="adults"
                        value={formData.adults}
                        onChange={handleChange}
                        min="1"
                        max="20"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="children">Number of Children (under 16) *</label>
                      <input
                        type="number"
                        id="children"
                        name="children"
                        value={formData.children}
                        onChange={handleChange}
                        min="0"
                        max="20"
                        required
                      />
                    </div>
                  </div>

                  <div className="children-details-section">
                    <label className="section-label">Children's Details</label>
                    {childrenList.map((child, index) => (
                      <div key={index} className="child-entry">
                        <div className="child-fields">
                          <div className="form-group">
                            <label htmlFor={`childName${index}`}>Name</label>
                            <input
                              type="text"
                              id={`childName${index}`}
                              value={child.name}
                              onChange={(e) => handleChildChange(index, 'name', e.target.value)}
                              placeholder="Child's name"
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor={`childAge${index}`}>Age</label>
                            <input
                              type="text"
                              id={`childAge${index}`}
                              value={child.age}
                              onChange={(e) => handleChildChange(index, 'age', e.target.value)}
                              placeholder="Age"
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor={`childRel${index}`}>Relationship to Marcela Garcia</label>
                            <input
                              type="text"
                              id={`childRel${index}`}
                              value={child.relationship}
                              onChange={(e) => handleChildChange(index, 'relationship', e.target.value)}
                              placeholder="e.g., Great-granddaughter"
                            />
                          </div>
                        </div>
                        {childrenList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeChild(index)}
                            className="btn-remove-child"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addChild}
                      className="btn-add-child"
                    >
                      + Add Child
                    </button>
                  </div>

                  <p className="food-note">Food will be served at noon and cocktails will follow.</p>
                </>
              )}

              {formData.attendance === 'unable' && (
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit RSVP'}
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="dev-credit">
        Developed with ❤️ by <a href="https://waqarh.com" target="_blank" rel="noopener noreferrer">Waqar H.</a>
      </div>
    </div>
  );
}
