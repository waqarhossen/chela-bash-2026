'use client';

import { useState } from 'react';

export default function SaveTheDatePage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    relationship: '',
    adults: '1',
    children: '0',
  });
  const [childrenList, setChildrenList] = useState<Array<{name: string, age: string, relationship: string}>>([
    { name: '', age: '', relationship: '' }
  ]);
  const [attendanceChoice, setAttendanceChoice] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAttendanceStatus(attendanceChoice);

    try {
      const childrenDetails = childrenList
        .filter(child => child.name.trim())
        .map(child => `${child.name} (Age: ${child.age}, Relationship: ${child.relationship})`)
        .join('; ');

      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, attendance: attendanceChoice, childrenDetails })
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
                Even though you can't attend, please keep our beloved grandmother 
                in your thoughts on this special day.
              </p>
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
            <h2>
              {attendanceStatus === 'attending' 
                ? 'Thank You for Your RSVP - Save the Date!' 
                : 'Thank You for Your Response!'
              }
            </h2>
            
            <div className="family-message">
              <p><strong>Dear Family and Friends,</strong></p>
              
              {attendanceStatus === 'attending' ? (
                <>
                  <p>Thank you for RSVPing to Marcela Garcia's Celebration of Life. Your response helps us coordinate a meaningful gathering that honors not only Marcela, but the entire generation of women who carried this family forward.</p>
                  
                  <p>You'll notice we asked for details about the children attending, especially those under 16. This was intentional. This celebration is bigger than one person. It is a tribute to the women who created our roots, our culture, and our identity. Marcela is one of them, but she stands among many powerful matriarchs who sacrificed, nurtured, protected, and built the foundation we stand on today.</p>
                  
                  <p>Including the young ones is our way of connecting legacy to future. We want them present, we want them visible, and we want them to understand that they come from strength. Their attendance honors the women who came before them, and their presence keeps that history alive.</p>
                  
                  <p>Thank you again for confirming your attendance. We look forward to celebrating together as one unified family, bridging generations with love, respect, and gratitude.</p>
                </>
              ) : (
                <>
                  <p>Thank you for letting us know you won't be able to join us for Marcela Garcia's Celebration of Life. We understand that not everyone can attend, and we appreciate you taking the time to respond.</p>
                  
                  <p>Even though you can't be with us in person, please keep Marcela and our family in your thoughts on this special day. Your connection to our family remains strong regardless of distance or circumstances.</p>
                </>
              )}
            </div>
            
            {attendanceStatus === 'attending' && (
              <div className="success-next-steps">
                <button 
                  onClick={() => {
                    const event = {
                      title: 'A Life in Celebration - Celebration of Life',
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
                    a.download = 'a-life-in-celebration.ics';
                    a.click();
                  }}
                  className="btn btn-primary btn-large"
                  style={{ width: '100%', padding: '15px 30px', fontSize: '1.2rem', marginTop: '20px' }}
                >
                  📅 Add to Calendar
                </button>
              </div>
            )}
            
            <div className="dedication">
              <h3>In Honor of the Women Who Built Us</h3>
              <p>From the García matriarchs to every woman who crossed oceans, borders, seasons, and struggles so the next generation could stand taller. This celebration is dedicated to the powerful women whose courage shaped our family, our community, and our future.</p>
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
            <h1 className="hero-title">A Life in Celebration!</h1>
            
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

            <div className="attendance-choice-section">
              <p className="attendance-instruction">
                Please select one so we know you received the invitation and can plan properly. 
                Your response truly helps the family prepare for this special celebration.
              </p>
              
              <div className="attendance-buttons">
                <button
                  onClick={() => {
                    setAttendanceChoice('attending');
                    setShowForm(true);
                  }}
                  className="btn btn-primary btn-attendance"
                >
                  RSVP - I'll be attending
                </button>
                
                <button
                  onClick={() => {
                    setAttendanceChoice('unable');
                    setShowForm(true);
                  }}
                  className="btn btn-secondary btn-attendance"
                >
                  Unable to attend
                </button>
              </div>
            </div>

          </div>
        </div>

        {showForm && (
          <div className="rsvp-form-section">
            <h2 className="form-title">
              {attendanceChoice === 'attending' ? 'RSVP for A Life in Celebration' : 'Unable to Attend'}
            </h2>
            <p className="form-subtitle rsvp-deadline-note">Please complete by Sunday, December 28th, 2025 at 5:00 PM</p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="rsvp-form">
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

              {attendanceChoice === 'attending' && (
                <>
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

                  <div className="form-group">
                    <label htmlFor="phone">Phone *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
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
                </>
              )}

              {attendanceChoice === 'unable' && (
                <div className="form-group">
                  <label htmlFor="phone">Phone *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
                {loading ? 'Submitting...' : (attendanceChoice === 'attending' ? 'Submit RSVP' : 'Submit Response')}
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="dev-credit">
        Made with ❤️ by <a href="https://waqarh.com" target="_blank" rel="noopener noreferrer">Waqar H.</a>
        <a href="https://wa.me/8801400006016" target="_blank" rel="noopener noreferrer" style={{marginLeft: '10px', color: '#25D366', textDecoration: 'none'}}>💬</a>
      </div>
    </div>
  );
}
