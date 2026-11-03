import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { changeAdminPassword, getAdminProfile } from '../../services/api';

const AdminChangePassword = () => {
  const [adminUser, setAdminUser] = useState(null);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getAdminProfile()
      .then((res) => setAdminUser(res.data))
      .catch((err) => console.error('Error fetching admin user:', err));
  }, []);

  const calculateStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '#CBD5E1' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak', color: '#EF4444', percent: '33%' };
    if (score <= 3) return { score: 2, label: 'Medium', color: '#F59E0B', percent: '66%' };
    return { score: 3, label: 'Strong', color: '#10B981', percent: '100%' };
  };

  const strength = calculateStrength(formData.newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.currentPassword) {
      setError('Please enter your current password.');
      return;
    }
    if (!formData.newPassword || formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from current password.');
      return;
    }

    setLoading(true);
    try {
      const res = await changeAdminPassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      setSuccess(res.data?.message || 'Password successfully updated! Your new password is now active.');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password. Please check your current password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Change Password"
      subtitle="Update your administrator credentials and security settings"
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* User Info Overview Banner */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            borderRadius: '16px',
            padding: '24px 28px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '28px',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.12)',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div 
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0D9488, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: '700',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(13, 148, 136, 0.35)'
              }}
            >
              {adminUser?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#fff' }}>
                  {adminUser?.name || 'Administrator'}
                </h3>
                <span 
                  style={{
                    background: 'rgba(13, 148, 136, 0.25)',
                    color: '#2DD4BF',
                    border: '1px solid rgba(45, 212, 191, 0.3)',
                    padding: '2px 10px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}
                >
                  {adminUser?.role || 'Admin'}
                </span>
              </div>
              <p style={{ margin: '4px 0 0', color: '#94A3B8', fontSize: '0.88rem' }}>
                <i className="fas fa-envelope" style={{ marginRight: '6px' }}></i>
                {adminUser?.email || 'admin@jodhpurvoyage.com'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.08)', padding: '8px 14px', borderRadius: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
            <span style={{ fontSize: '0.82rem', color: '#E2E8F0', fontWeight: '500' }}>Session Secure</span>
          </div>
        </div>

        {/* Password Form Card */}
        <div className="admin-card" style={{ padding: 0 }}>
          <div className="admin-card-header" style={{ padding: '20px 28px' }}>
            <h3>
              <i className="fas fa-shield-alt" style={{ color: 'var(--admin-primary)' }}></i>
              Update Password
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)' }}>
              All fields are required
            </span>
          </div>

          <div style={{ padding: '28px' }}>
            {error && (
              <div 
                style={{
                  background: '#FEE2E2',
                  border: '1px solid #FECACA',
                  color: '#B91C1C',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  marginBottom: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.9rem'
                }}
              >
                <i className="fas fa-exclamation-circle" style={{ fontSize: '1.2rem' }}></i>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div 
                style={{
                  background: '#DCFCE7',
                  border: '1px solid #BBF7D0',
                  color: '#15803D',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  marginBottom: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.9rem'
                }}
              >
                <i className="fas fa-check-circle" style={{ fontSize: '1.2rem' }}></i>
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Current Password */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                  Current Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    required
                    className="form-control"
                    placeholder="Enter your current password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    style={{ paddingRight: '45px', fontSize: '0.95rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#64748B',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      fontSize: '0.95rem'
                    }}
                    title={showCurrent ? 'Hide password' : 'Show password'}
                  >
                    <i className={showCurrent ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                  </button>
                </div>
                <small style={{ color: '#64748B', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                  The password you currently use to log in to this admin panel.
                </small>
              </div>

              <div style={{ height: '1px', background: '#F1F5F9', margin: '24px 0' }}></div>

              {/* New Password */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                  New Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNew ? 'text' : 'password'}
                    required
                    minLength={6}
                    className="form-control"
                    placeholder="Enter new strong password (min 6 characters)"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    style={{ paddingRight: '45px', fontSize: '0.95rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#64748B',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      fontSize: '0.95rem'
                    }}
                    title={showNew ? 'Hide password' : 'Show password'}
                  >
                    <i className={showNew ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.newPassword && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Password strength:</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: '700', color: strength.color }}>
                        {strength.label}
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '5px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: strength.percent, 
                          height: '100%', 
                          background: strength.color, 
                          transition: 'all 0.3s ease' 
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                  Confirm New Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    className="form-control"
                    placeholder="Re-type new password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    style={{ paddingRight: '45px', fontSize: '0.95rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#64748B',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      fontSize: '0.95rem'
                    }}
                    title={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    <i className={showConfirm ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                  </button>
                </div>
                {formData.confirmPassword && (
                  <small 
                    style={{ 
                      fontSize: '0.8rem', 
                      marginTop: '4px', 
                      display: 'block',
                      color: formData.newPassword === formData.confirmPassword ? '#10B981' : '#EF4444',
                      fontWeight: '500'
                    }}
                  >
                    {formData.newPassword === formData.confirmPassword ? (
                      <span><i className="fas fa-check-circle" style={{ marginRight: '4px' }}></i> Passwords match</span>
                    ) : (
                      <span><i className="fas fa-times-circle" style={{ marginRight: '4px' }}></i> Passwords do not match</span>
                    )}
                  </small>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{
                    padding: '10px 24px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-key"></i>
                      <span>Update Password</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setError('');
                    setSuccess('');
                  }}
                  className="btn btn-outline"
                  style={{ padding: '10px 18px', fontSize: '0.95rem' }}
                >
                  Reset Form
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Security Recommendations Card */}
        <div 
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '20px 24px',
            marginTop: '20px'
          }}
        >
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.98rem', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fas fa-lightbulb" style={{ color: '#F59E0B' }}></i>
            Password Best Practices
          </h4>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#64748B', fontSize: '0.86rem', lineHeight: '1.7' }}>
            <li>Use at least 8 or more characters for stronger account security.</li>
            <li>Combine uppercase letters, lowercase letters, numbers, and symbols (e.g. <code>!@#$%</code>).</li>
            <li>Do not share administrator login credentials across unauthorized devices.</li>
            <li>After changing your password, keep a secure record in your preferred password manager.</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminChangePassword;

