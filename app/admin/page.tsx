'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [guests, setGuests] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/admin/guests', {
        headers: {
          'Authorization': `Bearer ${username}:${password}`
        }
      });

      if (!response.ok) {
        throw new Error('Invalid password');
      }

      const data = await response.json();
      setGuests(data.guests);
      setStats(data.stats);
      setAuthenticated(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Relationship', 'Attendance', 'Adults', 'Children', 'Children Details', 'Confirmed Adults', 'Confirmed Children', 'Status', 'Token', 'Created'];
    const rows = guests.map(g => [
      g.full_name,
      g.email,
      g.phone || '',
      g.relationship,
      g.status === 'declined' ? 'Unable to Attend' : 'Attending',
      g.adults,
      g.children,
      g.notes || '',
      g.confirmed_adults || '',
      g.confirmed_children || '',
      g.status,
      g.token,
      new Date(g.created_at).toLocaleDateString()
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chela-bash-guests-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const copyToken = (token: string) => {
    const url = `${window.location.origin}/invitation/${token}`;
    navigator.clipboard.writeText(url);
    alert('Invitation link copied to clipboard!');
  };

  const filteredGuests = guests.filter(g =>
    g.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.relationship.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!authenticated) {
    return (
      <div className="container">
        <div className="form-card" style={{ maxWidth: '400px', margin: '100px auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Admin Login</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Chela Bash 2026 - Admin Dashboard</h1>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats.totalRsvps}</h3>
            <p>Total RSVPs</p>
          </div>
          <div className="stat-card">
            <h3>{stats.attending}</h3>
            <p>Attending</p>
          </div>
          <div className="stat-card">
            <h3>{stats.declined}</h3>
            <p>Unable to Attend</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalAdults}</h3>
            <p>Total Adults</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalChildren}</h3>
            <p>Total Children</p>
          </div>
        </div>
      )}

      <div className="table-container">
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search guests..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={exportCSV} className="btn btn-secondary">
            Export CSV
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Relationship</th>
              <th>Attendance</th>
              <th>Adults</th>
              <th>Children</th>
              <th>Children Details</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGuests.map((guest) => (
              <tr key={guest.id}>
                <td>{guest.full_name}</td>
                <td>{guest.email}</td>
                <td>{guest.phone || '-'}</td>
                <td>{guest.relationship}</td>
                <td>
                  <span className={`status-badge ${guest.status === 'declined' ? 'status-declined' : 'status-confirmed'}`}>
                    {guest.status === 'declined' ? 'Unable to Attend' : 'Attending'}
                  </span>
                </td>
                <td>
                  {guest.confirmed_adults !== null ? guest.confirmed_adults : guest.adults}
                  {guest.confirmed_adults !== null && guest.confirmed_adults !== guest.adults && (
                    <small> (was {guest.adults})</small>
                  )}
                </td>
                <td>
                  {guest.confirmed_children !== null ? guest.confirmed_children : guest.children}
                  {guest.confirmed_children !== null && guest.confirmed_children !== guest.children && (
                    <small> (was {guest.children})</small>
                  )}
                </td>
                <td style={{ maxWidth: '200px', fontSize: '0.85rem' }}>
                  {guest.notes || '-'}
                </td>
                <td>
                  <span className={`status-badge status-${guest.status}`}>
                    {guest.status}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => copyToken(guest.token)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                  >
                    Copy Link
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredGuests.length === 0 && (
          <p style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
            No guests found
          </p>
        )}
      </div>
    </div>
  );
}
