import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { hotelService } from '../services/services';
import { formatCurrency } from '../utils/helpers';
import { MapPin, Star, Search, ArrowRight, Shield, Clock, Award, Heart } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hotelService.getAll().then(res => {
      setFeaturedHotels(res.data.data?.slice(0, 4) || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', guests);
    navigate(`/hotels?${params.toString()}`);
  };

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-overlay"></div>
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>

        <div className="hero-content">
          <div className="hero-badge">
            ✨ Premium Hotel Booking Platform
          </div>

          <h1>
            Discover Your Perfect<br />
            <span>Luxury Stay</span>
          </h1>

          <p>
            Book from thousands of hand-picked hotels, resorts, and boutique stays worldwide. 
            Unmatched service, unforgettable experiences.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="search-box">
            <div className="search-field">
              <label>📍 Destination</label>
              <input
                type="text"
                placeholder="City or hotel name..."
                value={city}
                onChange={e => setCity(e.target.value)}
              />
            </div>
            <div className="search-field">
              <label>📅 Check-in</label>
              <input
                type="date"
                min={today}
                value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
              />
            </div>
            <div className="search-field">
              <label>📅 Check-out</label>
              <input
                type="date"
                min={checkIn || tomorrow}
                value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
              />
            </div>
            <div className="search-field">
              <label>👥 Guests</label>
              <input
                type="number"
                min={1}
                max={20}
                value={guests}
                onChange={e => setGuests(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ alignSelf: 'flex-end' }}>
              <Search size={18} />
              Search
            </button>
          </form>
        </div>
      </section>

      {/* STATS BANNER */}
      <section style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '2rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' }}>
            {[
              { value: '500+', label: 'Hotels', icon: '🏨' },
              { value: '50k+', label: 'Happy Guests', icon: '😊' },
              { value: '100+', label: 'Cities', icon: '🌍' },
              { value: '4.9★', label: 'Average Rating', icon: '⭐' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{s.icon}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.value}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED HOTELS */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="flex-between mb-3">
            <div>
              <h2 className="section-title">Featured Hotels</h2>
              <p className="section-subtitle">Handpicked properties for an extraordinary experience</p>
            </div>
            <button onClick={() => navigate('/hotels')} className="btn btn-secondary" style={{ gap: '0.5rem' }}>
              View All <ArrowRight size={16} />
            </button>
          </div>

          {loading ? (
            <div className="hotel-grid">
              {[1,2,3,4].map(i => (
                <div key={i} className="card" style={{ height: 320, background: 'var(--bg-elevated)', animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          ) : (
            <div className="hotel-grid">
              {featuredHotels.map(hotel => (
                <div
                  key={hotel.id}
                  className="hotel-card"
                  onClick={() => navigate(`/hotels/${hotel.id}`)}
                >
                  {hotel.imageUrl ? (
                    <img src={hotel.imageUrl} alt={hotel.name} className="hotel-card-img" />
                  ) : (
                    <div className="hotel-card-img-placeholder">🏨</div>
                  )}
                  <div className="hotel-card-body">
                    <div className="hotel-card-name">{hotel.name}</div>
                    <div className="hotel-card-location">
                      <MapPin size={14} /> {hotel.city}, {hotel.state}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                      {hotel.description?.substring(0, 80)}...
                    </p>
                    <div className="hotel-card-footer">
                      <div className="hotel-price">
                        {formatCurrency(hotel.rooms?.[0]?.price || 89)}
                        <span>/night</span>
                      </div>
                      <div className="rating">
                        <Star size={14} fill="currentColor" />
                        {hotel.rating}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <h2 className="section-title text-center">Why Choose LuxStay?</h2>
          <p className="section-subtitle text-center">We make hotel booking seamless, secure, and spectacular</p>

          <div className="features-grid">
            {[
              { icon: '🛡️', title: 'Secure Booking', desc: 'Bank-level security ensures your bookings and payments are always protected.' },
              { icon: '⚡', title: 'Instant Confirmation', desc: 'Get real-time booking confirmations the moment you complete your reservation.' },
              { icon: '💰', title: 'Best Price Guarantee', desc: 'We match any lower price you find and offer exclusive member discounts.' },
              { icon: '🌟', title: 'Premium Properties', desc: 'Every hotel is hand-verified by our quality team for an exceptional stay.' },
              { icon: '📱', title: '24/7 Support', desc: 'Round-the-clock customer support for any assistance before, during, or after your stay.' },
              { icon: '🎁', title: 'Loyalty Rewards', desc: 'Earn points on every booking and redeem them for free nights and upgrades.' },
            ].map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding: '5rem 0', background: 'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(255,101,132,0.1))' }}>
        <div className="container text-center">
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem' }}>
            Ready to Book Your Dream Stay?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.05rem' }}>
            Join thousands of happy travelers who trust LuxStay for their journeys.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/hotels')} className="btn btn-primary btn-lg">
              Explore Hotels
            </button>
            <button onClick={() => navigate('/register')} className="btn btn-secondary btn-lg">
              Create Free Account
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
