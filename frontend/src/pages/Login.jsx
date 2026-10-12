import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hotel, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(form);
      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'HOTEL_OWNER') navigate('/owner/dashboard');
      else navigate('/hotels');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  const fillDemo = (role) => {
    const creds = {
      admin: { email: 'admin@hotel.com', password: 'Admin@123' },
      owner: { email: 'owner@hotel.com', password: 'Owner@123' },
      customer: { email: 'customer@hotel.com', password: 'Customer@123' },
    };
    setForm(creds[role]);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏨</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            LuxStay
          </div>
        </div>

        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to continue your luxury journey</p>

        {/* Demo Credentials */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { label: 'Admin', role: 'admin', color: '#6C63FF' },
            { label: 'Owner', role: 'owner', color: '#FF6584' },
            { label: 'Customer', role: 'customer', color: '#06D6A0' },
          ].map(d => (
            <button
              key={d.role}
              onClick={() => fillDemo(d.role)}
              style={{
                padding: '0.3rem 0.8rem',
                borderRadius: 'var(--radius-full)',
                border: `1px solid ${d.color}40`,
                background: `${d.color}15`,
                color: d.color,
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Demo {d.label}
            </button>
          ))}
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              required
              id="login-email"
            />
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Password</label>
            <input
              name="password"
              type={showPass ? 'text' : 'password'}
              className="form-control"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              id="login-password"
              style={{ paddingRight: '3rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPass(s => !s)}
              style={{ position: 'absolute', right: '0.75rem', top: '2.1rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
            id="login-submit"
          >
            {loading ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Signing in...</> : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider" style={{ marginTop: '1.5rem' }}>
          Don't have an account?{' '}
          <Link to="/register" className="auth-link" style={{ display: 'inline' }}>
            Create one free
          </Link>
        </div>
      </div>
    </div>
  );
}
