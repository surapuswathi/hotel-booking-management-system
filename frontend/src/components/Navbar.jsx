import React, { useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hotel, Menu, X, User, LogOut, BookOpen, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout, isAdmin, isOwner } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isOwner) return '/owner/dashboard';
    return '/customer/bookings';
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">🏨</div>
          LuxStay
        </Link>

        <ul className="navbar-links">
          <li><NavLink to="/" className={({isActive}) => isActive ? 'active' : ''} end>Home</NavLink></li>
          <li><NavLink to="/hotels" className={({isActive}) => isActive ? 'active' : ''}>Hotels</NavLink></li>
          {isAuthenticated && (
            <li><NavLink to="/customer/bookings" className={({isActive}) => isActive ? 'active' : ''}>My Bookings</NavLink></li>
          )}
        </ul>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <div
                className="navbar-user"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="user-avatar">
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.fullName?.split(' ')[0]}
                </span>
              </div>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-md)',
                  minWidth: 200,
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 1000,
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Signed in as <strong style={{ color: 'var(--text-primary)' }}>{user?.role}</strong>
                  </div>
                  {(isAdmin || isOwner) && (
                    <Link to={getDashboardLink()} onClick={() => setDropdownOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', transition: 'var(--transition)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(108,99,255,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                  )}
                  <Link to="/customer/profile" onClick={() => setDropdownOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(108,99,255,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <User size={16} /> My Profile
                  </Link>
                  <Link to="/customer/bookings" onClick={() => setDropdownOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(108,99,255,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <BookOpen size={16} /> My Bookings
                  </Link>
                  <button onClick={handleLogout}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem 1rem', color: 'var(--danger)', fontSize: '0.875rem', width: '100%', border: 'none', background: 'none', cursor: 'pointer', borderTop: '1px solid var(--border)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,71,111,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
