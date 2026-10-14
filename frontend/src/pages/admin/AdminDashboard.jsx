import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { fetchDashboardStats } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading dashboard stats:', err);
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'nouveau':
      case 'unread':
      case 'pending':
        return <span className="admin-status-badge status-nouveau"><i className="fas fa-clock"></i> New</span>;
      case 'contacte':
      case 'in_progress':
        return <span className="admin-status-badge status-contacte"><i className="fas fa-phone-alt"></i> Contacted</span>;
      case 'devis_envoye':
      case 'quoted':
        return <span className="admin-status-badge status-devis_envoye"><i className="fas fa-paper-plane"></i> Quote Sent</span>;
      case 'confirme':
      case 'confirmed':
      case 'approved':
      case 'read':
        return <span className="admin-status-badge status-confirme"><i className="fas fa-check-circle"></i> Confirmed</span>;
      case 'annule':
      case 'cancelled':
      case 'rejected':
        return <span className="admin-status-badge status-annule"><i className="fas fa-times-circle"></i> Cancelled</span>;
      default:
        return <span className="admin-status-badge">{status}</span>;
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Dashboard" subtitle="Activity & Performance Overview">
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '2.5rem', color: 'var(--admin-primary)' }}></i>
          <p style={{ marginTop: '16px', color: 'var(--admin-text-muted)', fontSize: '0.95rem' }}>Loading real-time performance metrics...</p>
        </div>
      </AdminLayout>
    );
  }

  const metrics = stats?.metrics || {};

  return (
    <AdminLayout 
      title="Dashboard — Overview" 
      subtitle="Overview and key performance indicators of your travel agency."
    >
      {/* 4-Column Stat Cards Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card primary">
          <div className="admin-stat-icon primary">
            <i className="fas fa-file-invoice-dollar"></i>
          </div>
          <div className="admin-stat-info">
            <h3>{metrics.totalBookings || 0}</h3>
            <p>Quote Requests</p>
            <span className="admin-stat-badge warning">
              <i className="fas fa-bell"></i> {metrics.newBookings || 0} new request(s)
            </span>
          </div>
        </div>

        <div className="admin-stat-card navy">
          <div className="admin-stat-icon navy">
            <i className="fas fa-route"></i>
          </div>
          <div className="admin-stat-info">
            <h3>{metrics.totalTours || 0}</h3>
            <p>Active Tours</p>
            <span className="admin-stat-badge info">
              <i className="fas fa-check"></i> Published online
            </span>
          </div>
        </div>

        <div className="admin-stat-card gold">
          <div className="admin-stat-icon gold">
            <i className="fas fa-star"></i>
          </div>
          <div className="admin-stat-info">
            <h3>{metrics.approvedReviews || 0}</h3>
            <p>Customer Reviews</p>
            <span className="admin-stat-badge warning">
              <i className="fas fa-hourglass-half"></i> {metrics.pendingReviews || 0} pending moderation
            </span>
          </div>
        </div>

        <div className="admin-stat-card green">
          <div className="admin-stat-icon green">
            <i className="fas fa-envelope-open-text"></i>
          </div>
          <div className="admin-stat-info">
            <h3>{metrics.unreadContacts || 0}</h3>
            <p>Unread Messages</p>
            <span className="admin-stat-badge success">
              <i className="fas fa-inbox"></i> Inbox items
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="admin-action-bar">
        <span className="admin-action-bar-title">
          <i className="fas fa-bolt" style={{ color: 'var(--admin-gold)' }}></i> Quick Shortcuts:
        </span>
        <Link to="/admin/bookings" className="btn btn-primary btn-sm">
          <i className="fas fa-file-invoice-dollar"></i> Manage Quotes ({metrics.newBookings || 0})
        </Link>
        <Link to="/admin/tours" className="btn btn-outline btn-sm">
          <i className="fas fa-plus"></i> Add Tour
        </Link>
        <Link to="/admin/destinations" className="btn btn-outline btn-sm">
          <i className="fas fa-map-marked-alt"></i> Mega-Menu & Destinations
        </Link>
        <Link to="/admin/reviews" className="btn btn-outline btn-sm">
          <i className="fas fa-star"></i> Moderate Reviews ({metrics.pendingReviews || 0})
        </Link>
        <Link to="/admin/hero-slider" className="btn btn-outline btn-sm">
          <i className="fas fa-sliders-h"></i> Hero Slider (Home)
        </Link>
        <Link to="/admin/blogs" className="btn btn-outline btn-sm">
          <i className="fas fa-pen-nib"></i> Write Blog Post
        </Link>
      </div>

      {/* Recent Bookings Table */}
      <div className="admin-table-card">
        <div className="admin-table-card-header">
          <h3>
            <i className="fas fa-calendar-check" style={{ color: 'var(--admin-primary)' }}></i>
            Recent Quote Requests Received
          </h3>
          <Link to="/admin/bookings" style={{ fontSize: '0.85rem', color: 'var(--admin-primary)', fontWeight: '600', textDecoration: 'none' }}>
            View all requests ({metrics.totalBookings || 0}) <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        {stats?.recentBookings && stats.recentBookings.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Destination / Itinerary</th>
                  <th>Travelers</th>
                  <th>Requested Date</th>
                  <th>Status</th>
                  <th>Date Received</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <strong>{b.fullName}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                        <i className="fas fa-envelope"></i> {b.email} {b.phone && `• ${b.phone}`}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: '600', color: 'var(--admin-navy)' }}>
                        {b.tourTitle || b.destinations?.join(', ') || 'Custom Trip'}
                      </span>
                      {b.accommodationType && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                          Hotel: {b.accommodationType}
                        </div>
                      )}
                    </td>
                    <td>{b.adultsCount} adult(s) {b.childrenCount > 0 ? `, ${b.childrenCount} child.` : ''}</td>
                    <td>{b.departureDate || 'Flexible dates'}</td>
                    <td>{getStatusBadge(b.status)}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                      {new Date(b.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <Link to="/admin/bookings" className="btn btn-outline btn-sm">
                        <i className="fas fa-eye"></i> View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
            <i className="fas fa-inbox" style={{ fontSize: '2rem', marginBottom: '10px', display: 'block', color: '#CBD5E1' }}></i>
            No quote requests received yet.
          </div>
        )}
      </div>

      {/* Recent Contact Messages */}
      <div className="admin-table-card">
        <div className="admin-table-card-header">
          <h3>
            <i className="fas fa-envelope" style={{ color: 'var(--admin-gold)' }}></i>
            Recent Contact Form Messages
          </h3>
          <Link to="/admin/inquiries" style={{ fontSize: '0.85rem', color: 'var(--admin-primary)', fontWeight: '600', textDecoration: 'none' }}>
            View all messages <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        {stats?.recentMessages && stats.recentMessages.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Subject</th>
                  <th>Message Preview</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentMessages.map((m) => (
                  <tr key={m._id}>
                    <td>
                      <strong>{m.fullName}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>{m.email}</div>
                    </td>
                    <td style={{ fontWeight: '600' }}>{m.subject}</td>
                    <td style={{ maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#475569' }}>
                      {m.message}
                    </td>
                    <td>
                      <span className={`admin-status-badge ${m.status === 'unread' ? 'status-nouveau' : 'status-confirme'}`}>
                        {m.status === 'unread' ? <><i className="fas fa-envelope"></i> Unread</> : <><i className="fas fa-envelope-open"></i> Handled</>}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                      {new Date(m.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <Link to="/admin/inquiries" className="btn btn-outline btn-sm">
                        <i className="fas fa-reply"></i> Reply
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
            <i className="fas fa-comments" style={{ fontSize: '2rem', marginBottom: '10px', display: 'block', color: '#CBD5E1' }}></i>
            No contact messages yet.
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
