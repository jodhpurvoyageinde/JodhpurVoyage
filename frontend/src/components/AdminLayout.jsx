import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getAdminProfile } from '../services/api';

const AdminLayout = ({ children, title, subtitle }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    getAdminProfile()
      .then((res) => {
        setAdminUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const isTeamPage = location.pathname === '/admin/pages' && new URLSearchParams(location.search).get('page') === 'notre-equipe';

  const isActive = (path) => {
    if (path === '/admin/dashboard') {
      return location.pathname === '/admin' || location.pathname === '/admin/dashboard';
    }
    if (path === '/admin/pages') {
      return location.pathname === '/admin/pages' && !isTeamPage;
    }
    return location.pathname.startsWith(path);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '2.5rem', color: '#0D9488' }}></i>
          <p style={{ marginTop: '16px', color: '#64748B', fontWeight: '500' }}>Loading admin portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-icon">
            <i className="fas fa-crown"></i>
          </div>
          <div className="admin-brand-text">
            <h2>Jodhpur Voyage</h2>
            <span>Admin Portal</span>
          </div>
        </div>

        <ul className="admin-nav">
          <p className="admin-nav-group-title">Dashboard</p>
          <li className={`admin-nav-item ${isActive('/admin/dashboard') ? 'active' : ''}`}>
            <Link to="/admin/dashboard">
              <i className="fas fa-chart-pie"></i>
              <span>Overview</span>
            </Link>
          </li>

          <p className="admin-nav-group-title">Commercial & Leads</p>
          <li className={`admin-nav-item ${isActive('/admin/bookings') ? 'active' : ''}`}>
            <Link to="/admin/bookings">
              <i className="fas fa-file-invoice-dollar"></i>
              <span>Quote Requests</span>
            </Link>
          </li>

          <p className="admin-nav-group-title">Catalog & Content</p>
          <li className={`admin-nav-item ${isActive('/admin/tours') ? 'active' : ''}`}>
            <Link to="/admin/tours">
              <i className="fas fa-route"></i>
              <span>Tours & Itineraries</span>
            </Link>
          </li>
          <li className={`admin-nav-item ${isActive('/admin/hero-slider') ? 'active' : ''}`}>
            <Link to="/admin/hero-slider">
              <i className="fas fa-sliders-h"></i>
              <span>Hero Slider (Accueil)</span>
            </Link>
          </li>
          <li className={`admin-nav-item ${isActive('/admin/itinerary-slider') ? 'active' : ''}`}>
            <Link to="/admin/itinerary-slider">
              <i className="fas fa-images"></i>
              <span>Itinerary Sliders</span>
            </Link>
          </li>
          <li className={`admin-nav-item ${isActive('/admin/destinations') ? 'active' : ''}`}>
            <Link to="/admin/destinations">
              <i className="fas fa-map-marked-alt"></i>
              <span>Destinations & Regions</span>
            </Link>
          </li>
          <li className={`admin-nav-item ${isActive('/admin/blogs') ? 'active' : ''}`}>
            <Link to="/admin/blogs">
              <i className="fas fa-newspaper"></i>
              <span>Blog Articles</span>
            </Link>
          </li>
          <li className={`admin-nav-item ${isActive('/admin/mega-menu') ? 'active' : ''}`}>
            <Link to="/admin/mega-menu">
              <i className="fas fa-sitemap"></i>
              <span>Mega Menu CMS</span>
            </Link>
          </li>
          <li className={`admin-nav-item ${isActive('/admin/pages') ? 'active' : ''}`}>
            <Link to="/admin/pages">
              <i className="fas fa-palette"></i>
              <span>Pages & Sections CMS</span>
            </Link>
          </li>
          <li className={`admin-nav-item ${isTeamPage ? 'active' : ''}`}>
            <Link to="/admin/pages?page=notre-equipe&tab=team">
              <i className="fas fa-users"></i>
              <span>Notre Équipe (Team)</span>
            </Link>
          </li>
          <li className={`admin-nav-item ${isActive('/admin/seo') ? 'active' : ''}`}>
            <Link to="/admin/seo">
              <i className="fas fa-search"></i>
              <span>SEO & Meta Tags</span>
            </Link>
          </li>
          <li className={`admin-nav-item ${isActive('/admin/custom-urls') ? 'active' : ''}`}>
            <Link to="/admin/custom-urls">
              <i className="fas fa-link"></i>
              <span>Custom URL Routes</span>
            </Link>
          </li>

          <p className="admin-nav-group-title">Customer Relations</p>
          <li className={`admin-nav-item ${isActive('/admin/reviews') ? 'active' : ''}`}>
            <Link to="/admin/reviews">
              <i className="fas fa-star"></i>
              <span>Review Moderation</span>
            </Link>
          </li>
          <li className={`admin-nav-item ${isActive('/admin/inquiries') ? 'active' : ''}`}>
            <Link to="/admin/inquiries">
              <i className="fas fa-envelope-open-text"></i>
              <span>Contact Messages</span>
            </Link>
          </li>
        </ul>

        <div className="admin-sidebar-footer">
          <Link to="/" target="_blank" className="btn btn-outline btn-sm btn-full" style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#F8FAFC' }}>
            <i className="fas fa-external-link-alt"></i> View Public Website
          </Link>
          <button onClick={handleLogout} className="btn btn-sm btn-full" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#FCA5A5', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-content">
        <header className="admin-top-nav">
          <div className="admin-top-nav-title">
            <h1>{title || 'Dashboard'}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>

          <div className="admin-top-nav-actions">
            {/* Language indicator */}
            <div className="admin-lang-toggle">
              <span className="admin-lang-btn active">EN</span>
            </div>

            {/* Public Link */}
            <Link to="/" target="_blank" className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fas fa-globe"></i>
              <span>Live Website</span>
            </Link>

            {/* User Profile */}
            <div className="admin-user-profile">
              <div className="admin-user-details">
                <div className="admin-user-name">{adminUser?.name || 'Administrator'}</div>
                <div className="admin-user-role">{adminUser?.email || 'admin@jodhpurvoyage.com'}</div>
              </div>
              <div className="admin-user-avatar">
                {adminUser?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
