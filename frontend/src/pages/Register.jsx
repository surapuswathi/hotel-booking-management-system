import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, User, Phone, Mail, Lock, ChevronRight, Building2 } from 'lucide-react';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'CUSTOMER',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      await register(form);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--bg)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        width: 700,
        height: 700,
        borderRadius: '50%',
        background: 'var(--primary)',
        opacity: 0.04,
        filter: 'blur(120px)',
        top: -200,
        right: -200,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'var(--secondary)',
        opacity: 0.04,
        filter: 'blur(100px)',
        bottom: -100,
        left: -100,
        pointerEvents: 'none',
      }} />

      {/* Left Panel — Branding */}
      <div style={{
        display: 'none',
        flex: '0 0 42%',
        background: 'linear-gradient(145deg, var(--bg-card), #16213E)',
        borderRight: '1px solid var(--border)',
        padding: '3rem',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }} className="register-left-panel">
        {/* Decorative orbs */}
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'var(--primary)', opacity: 0.08, filter: 'blur(80px)', top: -100, left: -100 }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'var(--secondary)', opacity: 0.06, filter: 'blur(60px)', bottom: 50, right: -50 }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
            <div style={{
              width: 44, height: 44,
              background: 'var(--grad-primary)',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem',
            }}>🏨</div>
            <span style={{
              fontSize: '1.4rem', fontWeight: 800,
              background: 'var(--grad-primary)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>LuxStay</span>
          </div>

          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>
            Your journey to<br />
            <span style={{ background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              perfect stays
            </span><br />
            starts here.
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 320 }}>
            Join thousands of travellers who discover extraordinary hotels at unbeatable prices.
          </p>

          {/* Feature bullets */}
          {[
            { icon: '✨', text: 'Curated luxury hotels worldwide' },
            { icon: '🔒', text: 'Secure & instant booking' },
            { icon: '💰', text: 'Best price guarantee' },
            { icon: '🎧', text: '24/7 customer support' },
          ].map(f => (
            <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <span style={{
                width: 34, height: 34, borderRadius: 8,
                background: 'rgba(108,99,255,0.12)',
                border: '1px solid rgba(108,99,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.9rem', flexShrink: 0,
              }}>{f.icon}</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel — Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        overflowY: 'auto',
      }}>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(1.75rem, 4vw, 2.5rem)',
          width: '100%',
          maxWidth: 480,
          boxShadow: 'var(--shadow-lg)',
          animation: 'fadeInUp 0.5s ease',
        }}>
          {/* Mobile logo */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }} className="register-mobile-logo">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              marginBottom: '0.25rem',
            }}>
              <div style={{
                width: 40, height: 40, background: 'var(--grad-primary)', borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
              }}>🏨</div>
              <span style={{
                fontSize: '1.4rem', fontWeight: 800,
                background: 'var(--grad-primary)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>LuxStay</span>
            </div>
          </div>

          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.4rem' }}>
            Create Account
          </h1>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
            Join LuxStay for exclusive hotel deals
          </p>

          {/* Alerts */}
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success" style={{ marginBottom: '1.25rem' }}>
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name + Phone row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              {/* Full Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label htmlFor="reg-fullname" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  <input
                    id="reg-fullname"
                    name="fullName"
                    type="text"
                    className="form-control"
                    placeholder="John Doe"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    style={{ paddingLeft: '2.25rem' }}
                  />
                </div>
              </div>

              {/* Phone */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label htmlFor="reg-phone" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Phone
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  <input
                    id="reg-phone"
                    name="phone"
                    type="tel"
                    className="form-control"
                    placeholder="+1234567890"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    autoComplete="tel"
                    style={{ paddingLeft: '2.25rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="reg-email" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  style={{ paddingLeft: '2.25rem' }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="reg-password" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Password <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(min. 6 characters)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input
                  id="reg-password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  style={{ paddingLeft: '2.25rem', paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  style={{
                    position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    color: 'var(--text-muted)', cursor: 'pointer',
                    padding: '0.2rem', lineHeight: 1,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-light)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Account Type */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label htmlFor="reg-role" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Account Type
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[
                  { value: 'CUSTOMER', label: 'Customer', icon: '👤', desc: 'Book hotels' },
                  { value: 'HOTEL_OWNER', label: 'Hotel Owner', icon: '🏨', desc: 'Manage hotels' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, role: opt.value }))}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${form.role === opt.value ? 'var(--primary)' : 'var(--border)'}`,
                      background: form.role === opt.value ? 'rgba(108,99,255,0.1)' : 'var(--bg-elevated)',
                      color: form.role === opt.value ? 'var(--primary-light)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>{opt.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>{opt.label}</div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.7 }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
              <input type="hidden" id="reg-role" name="role" value={form.role} />
            </div>

            <button
              type="submit"
              id="reg-submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', justifyContent: 'center' }}>
                  <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                  Creating Account…
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                  Create Account <ChevronRight size={18} />
                </span>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--primary-light)'}
            >
              Sign in here
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (min-width: 900px) {
          .register-left-panel {
            display: flex !important;
          }
          .register-mobile-logo {
            display: none !important;
          }
        }

        @media (max-width: 500px) {
          /* Stack name/phone on tiny screens */
          form > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
