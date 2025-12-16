'use client';

import { useEffect, useState } from 'react';

interface CustomAlertProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

function CustomAlert({ message, type, onClose }: CustomAlertProps) {
  const bgColor = type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1';
  const textColor = type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460';
  const borderColor = type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb';

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: bgColor,
      color: textColor,
      border: `1px solid ${borderColor}`,
      borderRadius: '8px',
      padding: '15px 20px',
      maxWidth: '400px',
      zIndex: 1000,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{message}</span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            marginLeft: '10px',
            color: textColor
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [guests, setGuests] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [userRole, setUserRole] = useState('');
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '', role: 'admin' });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordChange, setPasswordChange] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [alert, setAlert] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);

  const showAlert = (message: string, type: 'success' | 'error' | 'info') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  useEffect(() => {
    // Check for saved session
    const savedUsername = sessionStorage.getItem('adminUsername');
    const savedPassword = sessionStorage.getItem('adminPassword');
    
    if (savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      fetchGuestData(savedUsername, savedPassword);
    } else {
      setLoading(false);
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setDropdownOpen(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchGuestData = async (user: string, pass: string) => {
    try {
      const response = await fetch('/api/admin/guests', {
        headers: {
          'Authorization': `Bearer ${user}:${pass}`
        }
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      setGuests(data.guests);
      setStats(data.stats);
      setUserRole(data.userRole);
      setAuthenticated(true);
    } catch (err: any) {
      setError(err.message);
      sessionStorage.removeItem('adminUsername');
      sessionStorage.removeItem('adminPassword');
    } finally {
      setLoading(false);
    }
  };

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
      setUserRole(data.userRole);
      setAuthenticated(true);
      
      // Save credentials to session storage
      sessionStorage.setItem('adminUsername', username);
      sessionStorage.setItem('adminPassword', password);
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
    showAlert('Invitation link copied to clipboard!', 'success');
  };

  const deleteGuest = async (guestId: number, guestName: string) => {
    if (!confirm(`Are you sure you want to delete ${guestName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/guests/${guestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${username}:${password}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete guest');
      }

      // Refresh guest list
      const guestResponse = await fetch('/api/admin/guests', {
        headers: {
          'Authorization': `Bearer ${username}:${password}`
        }
      });
      
      const data = await guestResponse.json();
      setGuests(data.guests);
      setStats(data.stats);
      
      showAlert('Guest deleted successfully', 'success');
    } catch (err: any) {
      showAlert(err.message, 'error');
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${username}:${password}`
        },
        body: JSON.stringify(newAdmin)
      });

      if (!response.ok) {
        throw new Error('Failed to add admin');
      }

      showAlert('Admin user added successfully!', 'success');
      setShowAddAdmin(false);
      setNewAdmin({ username: '', password: '', role: 'admin' });
    } catch (err: any) {
      showAlert(err.message, 'error');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordChange.newPassword !== passwordChange.confirmPassword) {
      showAlert('New passwords do not match!', 'error');
      return;
    }

    if (passwordChange.currentPassword !== password) {
      showAlert('Current password is incorrect!', 'error');
      return;
    }

    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${username}:${password}`
        },
        body: JSON.stringify({ newPassword: passwordChange.newPassword })
      });

      if (!response.ok) {
        throw new Error('Failed to change password');
      }

      showAlert('Password changed successfully! Please login again.', 'success');
      setPassword(passwordChange.newPassword);
      sessionStorage.setItem('adminPassword', passwordChange.newPassword);
      setShowChangePassword(false);
      setPasswordChange({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      showAlert(err.message, 'error');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminUsername');
    sessionStorage.removeItem('adminPassword');
    setAuthenticated(false);
    setUsername('');
    setPassword('');
    setGuests([]);
    setStats(null);
    setUserRole('');
  };

  const filteredGuests = guests.filter(g =>
    g.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.relationship.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Chela Bash 2026 - Admin Dashboard</h1>
            <p style={{ color: '#6b7280', marginTop: '10px' }}>
              Logged in as: <strong>{username}</strong> ({userRole})
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setShowChangePassword(!showChangePassword)} 
              className="btn btn-secondary"
            >
              Change Password
            </button>
            <button 
              onClick={handleLogout} 
              className="btn btn-secondary"
              style={{ background: '#dc2626', borderColor: '#dc2626' }}
            >
              Logout
            </button>
          </div>
        </div>

        {showChangePassword && (
          <div className="form-card" style={{ marginTop: '30px' }}>
            <h3 style={{ marginBottom: '20px' }}>Change Your Password</h3>
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password *</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={passwordChange.currentPassword}
                  onChange={(e) => setPasswordChange({...passwordChange, currentPassword: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password *</label>
                <input
                  type="password"
                  id="newPassword"
                  value={passwordChange.newPassword}
                  onChange={(e) => setPasswordChange({...passwordChange, newPassword: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={passwordChange.confirmPassword}
                  onChange={(e) => setPasswordChange({...passwordChange, confirmPassword: e.target.value})}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary">
                  Update Password
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowChangePassword(false);
                    setPasswordChange({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {userRole === 'super_admin' && (
        <div className="admin-management-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#d97706' }}>Admin Management</h2>
            <button 
              onClick={() => setShowAddAdmin(!showAddAdmin)} 
              className="btn btn-secondary"
            >
              {showAddAdmin ? 'Cancel' : '+ Add New Admin'}
            </button>
          </div>

          {showAddAdmin && (
            <div className="form-card" style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '20px' }}>Add New Admin User</h3>
              <form onSubmit={handleAddAdmin}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="newUsername">Username *</label>
                    <input
                      type="text"
                      id="newUsername"
                      value={newAdmin.username}
                      onChange={(e) => setNewAdmin({...newAdmin, username: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="newPassword">Password *</label>
                    <input
                      type="text"
                      id="newPassword"
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="newRole">Role *</label>
                  <select
                    id="newRole"
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value})}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #fbbf24' }}
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">
                  Create Admin User
                </button>
              </form>
            </div>
          )}
        </div>
      )}

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
                  <div className="dropdown-container">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDropdownOpen(dropdownOpen === guest.id ? null : guest.id);
                      }}
                      className="btn-dropdown"
                    >
                      ⋮
                    </button>
                    {dropdownOpen === guest.id && (
                      <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            window.open(`/invitation/${guest.token}`, '_blank');
                            setDropdownOpen(null);
                          }}
                          className="dropdown-item"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            copyToken(guest.token);
                            setDropdownOpen(null);
                          }}
                          className="dropdown-item"
                        >
                          Copy Link
                        </button>
                        <button
                          onClick={() => {
                            deleteGuest(guest.id, guest.full_name);
                            setDropdownOpen(null);
                          }}
                          className="dropdown-item dropdown-item-delete"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
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

      <div className="dev-credit">
        Made with ❤️ by <a href="https://waqarh.com" target="_blank" rel="noopener noreferrer">Waqar H.</a>
        <a href="https://wa.me/8801400006016" target="_blank" rel="noopener noreferrer" style={{marginLeft: '10px', color: '#25D366', textDecoration: 'none'}}>💬</a>
      </div>

      {alert && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
}
