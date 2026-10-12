import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

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
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 500 }}>
        <div className="auth-logo">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏨</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            LuxStay
          </div>
        </div>

        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join LuxStay for exclusive hotel deals</p>

        {error && <div className="alert alert-error">⚠️ {error}</div>}
        {success && <div className="alert alert-success">✅ {success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                name="fullName"
                type="text"
                className="form-control"
                placeholder="John Doe"
                value={form.fullName}
                onChange={handleChange}
                required
                id="reg-fullname"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                name="phone"
                type="tel"
                className="form-control"
                placeholder="+1234567890"
                value={form.phone}
                onChange={handleChange}
                required
                id="reg-phone"
              />
            </div>
          </div>

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
              id="reg-email"
            />
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Password (min. 6 characters)</label>
            <input
              name="password"
              type={showPass ? 'text' : 'password'}
              className="form-control"
              placeholder="Create a strong password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              id="reg-password"
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

          <div className="form-group">
            <label className="form-label">Account Type</label>
            <select
              name="role"
              className="form-control"
              value={form.role}
              onChange={handleChange}
              id="reg-role"
            >
              <option value="CUSTOMER">Customer (Book Hotels)</option>
              <option value="HOTEL_OWNER">Hotel Owner (Manage Hotels)</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
            id="reg-submit"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-divider" style={{ marginTop: '1.5rem' }}>
          Already have an account?{' '}
          <Link to="/login" className="auth-link" style={{ display: 'inline' }}>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
