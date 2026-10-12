import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Hotel, BedDouble, Tag, BookOpen, Users, CreditCard,
  BarChart3, LogOut, Settings, ChevronRight
} from 'lucide-react';

const adminNav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/hotels', label: 'Hotels', icon: Hotel },
  { to: '/admin/rooms', label: 'Rooms', icon: BedDouble },
  { to: '/admin/room-types', label: 'Room Types', icon: Tag },
  { to: '/admin/bookings', label: 'Bookings', icon: BookOpen },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
];

const ownerNav = [
  { to: '/owner/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/owner/hotels', label: 'My Hotels', icon: Hotel },
  { to: '/owner/rooms', label: 'Rooms', icon: BedDouble },
  { to: '/owner/bookings', label: 'Bookings', icon: BookOpen },
];

export default function Sidebar({ type = 'admin' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = type === 'admin' ? adminNav : ownerNav;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🏨</div>
        LuxStay
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">
          {type === 'admin' ? 'Administration' : 'Hotel Management'}
        </div>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </div>

      <div style={{ marginTop: 'auto' }}>
        <NavLink to="/customer/profile" className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}>
          <Settings size={18} />
          Settings
        </NavLink>
        <button
          onClick={handleLogout}
          className="sidebar-item"
          style={{ width: '100%', border: 'none', background: 'none', color: 'var(--danger)', cursor: 'pointer' }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">
          {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{user?.fullName}</div>
          <div className="sidebar-user-role">{user?.role}</div>
        </div>
      </div>
    </aside>
  );
}
