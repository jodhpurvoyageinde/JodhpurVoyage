import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginAdmin } from '../../services/api';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await loginAdmin({ email, password });
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      if (!err.response) {
        setErrorMsg('Unable to connect to the backend server. Please ensure the backend is active.');
      } else {
        setErrorMsg(err.response.data?.message || 'Invalid credentials. Please verify your email and password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '24px',
      fontFamily: "'Montserrat', sans-serif"
    }}>
      <div style={{ 
        background: '#FFFFFF', 
        borderRadius: '16px', 
        padding: '40px', 
        maxWidth: '460px', 
        width: '100%', 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '1.8rem',
            margin: '0 auto 16px',
            boxShadow: '0 8px 20px rgba(217, 119, 6, 0.3)'
          }}>
            <i className="fas fa-crown"></i>
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#0F172A', margin: '0 0 6px', fontFamily: "'Playfair Display', serif" }}>
            Jodhpur Voyage
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
            Administration & Management Portal
          </p>
        </div>

        {errorMsg && (
          <div style={{ 
            padding: '12px 16px', 
            background: '#FEE2E2', 
            color: '#B91C1C', 
            borderRadius: '8px', 
            marginBottom: '24px', 
            fontSize: '0.88rem',
            border: '1px solid #FECACA',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <i className="fas fa-exclamation-triangle" style={{ fontSize: '1.1rem', flexShrink: 0 }}></i>
            <div>{errorMsg}</div>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label" style={{ fontWeight: '600', color: '#1E293B', fontSize: '0.88rem' }}>
              Administrator Email
            </label>
            <div style={{ position: 'relative' }}>
              <i className="fas fa-envelope" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}></i>
              <input
                type="email"
                required
                className="form-control"
                style={{ paddingLeft: '40px', height: '44px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ fontWeight: '600', color: '#1E293B', fontSize: '0.88rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <i className="fas fa-lock" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}></i>
              <input
                type="password"
                required
                className="form-control"
                style={{ paddingLeft: '40px', height: '44px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full btn-lg" 
            disabled={loading}
            style={{ 
              height: '46px', 
              fontSize: '0.95rem', 
              fontWeight: '600',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0D9488, #0F766E)',
              boxShadow: '0 4px 14px rgba(13, 148, 136, 0.4)'
            }}
          >
            {loading ? (
              <span><i className="fas fa-circle-notch fa-spin"></i> Authenticating...</span>
            ) : (
              <span><i className="fas fa-sign-in-alt"></i> Sign In to Admin Portal</span>
            )}
          </button>
        </form>

        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #E2E8F0', textAlign: 'center', fontSize: '0.85rem', color: '#64748B' }}>
          <Link to="/" style={{ color: '#0D9488', fontWeight: '600', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <i className="fas fa-arrow-left"></i> Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
