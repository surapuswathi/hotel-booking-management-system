import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '1rem' }}>
              🏨 LuxStay
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: 280, lineHeight: 1.7 }}>
              Your premium hotel booking partner. Discover extraordinary stays at the world's most beautiful hotels.
            </p>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.875rem' }}>Explore</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/hotels">Hotels</Link></li>
              <li><Link to="/customer/bookings">My Bookings</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.875rem' }}>Account</h4>
            <ul className="footer-links">
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/customer/profile">Profile</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.875rem' }}>Support</h4>
            <ul className="footer-links">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 LuxStay Hotel Booking & Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
