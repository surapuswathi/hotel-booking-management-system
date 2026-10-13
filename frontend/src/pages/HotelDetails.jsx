import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { hotelService } from '../services/services';
import { formatCurrency, today, tomorrow } from '../utils/helpers';
import { MapPin, Star, Wifi, Car, Utensils, Waves, BedDouble, Users, ArrowRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const amenityIconMap = {
  'WiFi': <Wifi size={15} />,
  'Parking': <Car size={15} />,
  'Restaurant': <Utensils size={15} />,
  'Pool': <Waves size={15} />,
  'Gym': '🏋️',
  'Spa': '💆',
  'Bar': '🍹',
  'Laundry': '👕',
};

const Spinner = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)' }}>
    <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('rooms');

  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || today());
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || tomorrow());
  const [guests, setGuests] = useState(searchParams.get('guests') || 1);

  useEffect(() => {
    hotelService.getById(id)
      .then(res => setHotel(res.data.data))
      .catch(() => setError('Hotel not found'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setRoomsLoading(true);
    hotelService.getRooms(id, checkIn, checkOut)
      .then(res => setRooms(res.data.data || []))
      .catch(() => setRooms([]))
      .finally(() => setRoomsLoading(false));
  }, [id, checkIn, checkOut]);

  const handleBook = (room) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    navigate(`/booking/${room.id}`, {
      state: { room, hotel, checkIn, checkOut, guests: Number(guests) }
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spinner />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '3rem' }}>😕</div>
          <h2 style={{ fontWeight: 700 }}>{error}</h2>
          <button className="btn btn-primary" onClick={() => navigate('/hotels')}>← Back to Hotels</button>
        </div>
      </>
    );
  }

  const amenities = hotel?.amenities
    ? (Array.isArray(hotel.amenities) ? hotel.amenities : hotel.amenities.split(',').map(a => a.trim()))
    : [];

  return (
    <>
      <Navbar />

      {/* Hero */}
      <div style={{ height: 420, background: 'linear-gradient(135deg, var(--bg-elevated), var(--bg-2))', position: 'relative', overflow: 'hidden' }}>
        {hotel?.imageUrl ? (
          <img src={hotel.imageUrl} alt={hotel?.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => e.target.style.display = 'none'} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '8rem', opacity: 0.15 }}>🏨</div>
        )}
        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,15,26,0.97) 0%, rgba(15,15,26,0.3) 60%, transparent 100%)' }} />
        {/* Top fade */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,15,26,0.5) 0%, transparent 30%)' }} />

        {/* Back button */}
        <button onClick={() => navigate('/hotels')}
          style={{ position: 'absolute', top: '1.5rem', left: '50%', transform: 'translateX(-50%)', marginLeft: '-620px', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(15,15,26,0.6)', backdropFilter: 'blur(10px)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '0.4rem 0.9rem', color: 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer', transition: 'var(--transition)' }}
        >
          <ChevronLeft size={16} /> Hotels
        </button>

        {/* Hotel info overlay */}
        <div className="container" style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div className="rating">
              <Star size={14} fill="currentColor" /> {hotel?.rating?.toFixed(1) || 'New'}
            </div>
            {hotel?.rating && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>· Exceptional</span>}
            {amenities.length > 0 && (
              <div style={{ display: 'flex', gap: '0.35rem', marginLeft: '0.5rem', flexWrap: 'wrap' }}>
                {amenities.slice(0, 3).map(a => (
                  <span key={a} style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius-full)', padding: '0.2rem 0.55rem', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
                    {a}
                  </span>
                ))}
              </div>
            )}
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, marginBottom: '0.5rem', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
            {hotel?.name}
          </h1>
          <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
            <MapPin size={15} />
            {[hotel?.address, hotel?.city, hotel?.state, hotel?.country].filter(Boolean).join(', ')}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>

          {/* Left column */}
          <div>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
              {[
                { id: 'rooms', label: `🛏 Rooms (${rooms.length})` },
                { id: 'about', label: '📋 About' },
                { id: 'amenities', label: '✨ Amenities' },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  style={{ padding: '0.75rem 1.25rem', background: 'none', border: 'none', borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === tab.id ? 'var(--primary-light)' : 'var(--text-muted)', fontWeight: activeTab === tab.id ? 700 : 500, fontSize: '0.875rem', cursor: 'pointer', transition: 'var(--transition)', marginBottom: '-1px' }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Rooms tab */}
            {activeTab === 'rooms' && (
              <div>
                {roomsLoading ? (
                  <Spinner />
                ) : rooms.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛏️</div>
                    <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>No rooms available</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Try different dates to find available rooms.</p>
                  </div>
                ) : (
                  <div className="room-grid">
                    {rooms.map(room => (
                      <div key={room.id} className="room-card" id={`room-${room.id}`}>
                        {room.imageUrl ? (
                          <img src={room.imageUrl} alt={room.roomNumber} className="room-card-img" onError={e => e.target.style.display = 'none'} />
                        ) : (
                          <div className="room-card-img-placeholder">🛏️</div>
                        )}
                        <div className="room-card-body">
                          <div className="room-card-type">{room.roomType?.name}</div>
                          <div className="room-card-name">Room {room.roomNumber}</div>
                          <div className="room-card-meta">
                            {room.roomType?.bedType && <span><BedDouble size={13} /> {room.roomType.bedType}</span>}
                            <span><Users size={13} /> Up to {room.roomType?.capacity || room.capacity} guests</span>
                          </div>
                          {room.roomType?.amenities && (
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                              {room.roomType.amenities}
                            </p>
                          )}
                          <div className="room-card-footer">
                            <div className="room-price">
                              {formatCurrency(room.price || room.roomType?.pricePerNight)}
                              <span style={{ fontSize: '0.78rem', fontWeight: 400, color: 'var(--text-muted)' }}>/night</span>
                            </div>
                            <button className="btn btn-primary btn-sm" onClick={() => handleBook(room)} id={`book-room-${room.id}`}>
                              Book Now <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* About tab */}
            {activeTab === 'about' && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>About {hotel?.name}</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: '0.95rem' }}>
                  {hotel?.description || 'No description available.'}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
                  {[
                    { label: 'City', value: hotel?.city },
                    { label: 'State', value: hotel?.state },
                    { label: 'Country', value: hotel?.country },
                    { label: 'Rating', value: hotel?.rating ? `${hotel.rating}/5` : 'Unrated' },
                  ].filter(i => i.value).map(({ label, value }) => (
                    <div key={label} style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem' }}>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{label}</p>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities tab */}
            {activeTab === 'amenities' && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Hotel Amenities</h2>
                {amenities.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>No amenities listed.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
                    {amenities.map(a => (
                      <div key={a} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.75rem 1rem', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: 600 }}>
                        <span style={{ color: 'var(--primary-light)' }}>{amenityIconMap[a] || '✓'}</span>
                        {a}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Sticky date picker */}
          <div style={{ position: 'sticky', top: '88px' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <div style={{ height: 4, background: 'var(--grad-primary)' }} />
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>🔍 Check Availability</h3>
              </div>
              <div style={{ padding: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Check-in Date</label>
                  <input type="date" className="form-control" min={today()} value={checkIn}
                    onChange={e => setCheckIn(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Check-out Date</label>
                  <input type="date" className="form-control" min={checkIn || tomorrow()} value={checkOut}
                    onChange={e => setCheckOut(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Guests</label>
                  <input type="number" className="form-control" min={1} max={20} value={guests}
                    onChange={e => setGuests(e.target.value)} />
                </div>

                {/* Night count */}
                {checkIn && checkOut && checkOut > checkIn && (() => {
                  const n = Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
                  return n > 0 ? (
                    <div style={{ padding: '0.75rem', background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--primary-light)', fontWeight: 600, textAlign: 'center', marginBottom: '1rem' }}>
                      🌙 {n} night{n !== 1 ? 's' : ''} selected
                    </div>
                  ) : null;
                })()}

                <div style={{ padding: '0.75rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  Select a room below to book
                </div>
              </div>
            </div>

            {/* Quick hotel stats */}
            <div style={{ marginTop: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem' }}>Quick Stats</h3>
              {[
                { icon: '🛏', label: 'Available Rooms', value: rooms.length },
                { icon: '⭐', label: 'Rating', value: hotel?.rating ? `${hotel.rating}/5` : 'New' },
                { icon: '📍', label: 'Location', value: hotel?.city },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{icon} {label}</span>
                  <span style={{ fontWeight: 700 }}>{value || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .container > div[style*="grid-template-columns: 1fr 320px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}