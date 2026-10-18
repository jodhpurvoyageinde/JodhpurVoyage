import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { fetchPageContent, updatePageContent, resetPageContent, uploadImage } from '../../services/api';

const PAGE_GROUPS = [
  {
    groupTitle: 'Menu "About Us"',
    icon: 'fas fa-users',
    pages: [
      { key: 'qui-sommes-nous', title: 'About Us', url: '/qui-sommes-nous', image: '/images/image-12.jpg' },
      { key: 'notre-equipe', title: 'Our Team', url: '/notre-equipe', image: '/images/image-8.jpg' }
    ]
  },
  {
    groupTitle: 'Menu "Inspiration"',
    icon: 'fas fa-lightbulb',
    pages: [
      { key: 'culture-et-safari', title: 'Culture & Safari', url: '/culture-et-safari', image: '/images/image-6.jpg' }
    ]
  }
];

const ALL_PAGES = PAGE_GROUPS.flatMap(g => g.pages);

const AdminPages = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = searchParams.get('page') || 'qui-sommes-nous';

  const [selectedPageKey, setSelectedPageKey] = useState(initialPage);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);
  const [activeSectionTab, setActiveSectionTab] = useState('hero');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    loadPage(selectedPageKey);
  }, [selectedPageKey]);

  useEffect(() => {
    const pageFromUrl = searchParams.get('page');
    if (pageFromUrl && pageFromUrl !== selectedPageKey) {
      setSelectedPageKey(pageFromUrl);
    }
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) {
      setActiveSectionTab(tabFromUrl);
    } else if (pageFromUrl === 'notre-equipe') {
      setActiveSectionTab('team');
    }
  }, [searchParams]);

  const loadPage = async (key) => {
    setLoading(true);
    try {
      const res = await fetchPageContent(key);
      setPageData(res.data);
    } catch (err) {
      console.error(`Error loading page ${key}:`, err);
      showToast('Error loading page content', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePageSelect = (key) => {
    setSelectedPageKey(key);
    setSearchParams({ page: key });
    setActiveSectionTab('hero');
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await updatePageContent(selectedPageKey, pageData);
      showToast(`Page "${pageData.title || selectedPageKey}" saved successfully!`, 'success');
    } catch (err) {
      console.error('Save page error:', err);
      showToast('Error saving page changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset this page to its default design and content?')) {
      return;
    }
    setSaving(true);
    try {
      const res = await resetPageContent(selectedPageKey);
      setPageData(res.data?.data || res.data);
      showToast('Page reset to default values!', 'info');
    } catch (err) {
      console.error('Reset error:', err);
      showToast('Error resetting page', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Image Upload handler
  const handleFileUpload = async (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;

    const fieldId = e.target.id || 'file_upload';
    setUploadingField(fieldId);

    try {
      const res = await uploadImage(file);
      const url = res.data?.url || res.data?.secure_url || res.data?.path;
      if (url) {
        callback(url);
        showToast('Image uploaded successfully!', 'success');
      } else {
        showToast('Image upload failed', 'error');
      }
    } catch (err) {
      console.error('Upload error:', err);
      showToast('Error uploading image', 'error');
    } finally {
      setUploadingField(null);
    }
  };

  const updateNested = (section, field, value) => {
    setPageData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Pillars / Highlights helpers
  const handlePillarChange = (idx, field, value) => {
    setPageData(prev => {
      const items = [...(prev.pillars?.items || [])];
      items[idx] = { ...items[idx], [field]: value };
      return {
        ...prev,
        pillars: { ...prev.pillars, items }
      };
    });
  };

  const addPillar = () => {
    setPageData(prev => ({
      ...prev,
      pillars: {
        ...prev.pillars,
        items: [
          ...(prev.pillars?.items || []),
          {
            icon: 'fas fa-check-circle',
            title: 'New Key Highlight',
            desc: 'Detailed description for your visitors and travelers.'
          }
        ]
      }
    }));
  };

  const removePillar = (idx) => {
    if (!window.confirm('Delete this card?')) return;
    setPageData(prev => {
      const items = [...(prev.pillars?.items || [])];
      items.splice(idx, 1);
      return {
        ...prev,
        pillars: { ...prev.pillars, items }
      };
    });
  };

  // Team members helpers for Notre Équipe
  const handleMemberChange = (idx, field, value) => {
    setPageData(prev => {
      const members = [...(prev.members || [])];
      members[idx] = { ...members[idx], [field]: value };
      return { ...prev, members };
    });
  };

  const addMember = () => {
    setPageData(prev => ({
      ...prev,
      members: [
        ...(prev.members || []),
        {
          name: 'Nouveau Membre',
          role: 'Guide Francophone',
          category: 'Guides Francophones',
          specialty: 'Rajasthan & Inde du Nord',
          desc: 'Biographie et compétences du membre...',
          quote: "« Partager notre amour profond pour l'Inde avec professionnalisme et authenticité. »",
          image: '/images/image-12.jpg',
          objectPosition: 'center 25%'
        }
      ]
    }));
  };

  const removeMember = (idx) => {
    if (!window.confirm('Delete this member?')) return;
    setPageData(prev => {
      const members = [...prev.members];
      members.splice(idx, 1);
      return { ...prev, members };
    });
  };

  const currentPageMeta = ALL_PAGES.find(p => p.key === selectedPageKey) || {
    key: selectedPageKey,
    title: pageData?.title || selectedPageKey,
    url: `/${selectedPageKey}`
  };

  return (
    <AdminLayout title="Pages & Sections CMS" subtitle="Complete design & content editor for each Mega Menu page">
      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          padding: '14px 22px',
          borderRadius: '8px',
          background: toast.type === 'error' ? '#EF4444' : toast.type === 'info' ? '#3B82F6' : '#10B981',
          color: '#ffffff',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.95rem',
          fontWeight: '500',
          animation: 'fadeIn 0.3s ease'
        }}>
          <i className={toast.type === 'error' ? 'fas fa-exclamation-circle' : toast.type === 'info' ? 'fas fa-info-circle' : 'fas fa-check-circle'}></i>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Visual Mega Menu Pages Selector */}
      <div style={{
        background: '#FFFFFF',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-th-large" style={{ color: '#0D9488' }}></i> Choose a Mega Menu Page to Edit
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#64748B' }}>
              Click any page card below to customize its hero banner, presentation texts, highlights, and images.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link
              to={currentPageMeta.url}
              target="_blank"
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', borderColor: '#CBD5E1', color: '#334155' }}
            >
              <i className="fas fa-external-link-alt"></i> View on Live Site
            </Link>
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-outline btn-sm"
              style={{ borderColor: '#E2E8F0', color: '#64748B' }}
              disabled={saving}
            >
              <i className="fas fa-undo"></i> Reset to Default
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn btn-primary btn-sm"
              style={{ minWidth: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              disabled={saving}
            >
              {saving ? (
                <>
                  <i className="fas fa-circle-notch fa-spin"></i> Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i> Save Page
                </>
              )}
            </button>
          </div>
        </div>

        {/* Visual Cards Grid by Mega Menu Groups */}
        {PAGE_GROUPS.map((grp, gIdx) => (
          <div key={gIdx} style={{ marginBottom: gIdx < PAGE_GROUPS.length - 1 ? '20px' : '0' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0D9488', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className={grp.icon}></i> {grp.groupTitle}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {grp.pages.map(p => {
                const isSelected = selectedPageKey === p.key;
                return (
                  <div
                    key={p.key}
                    onClick={() => handlePageSelect(p.key)}
                    style={{
                      border: isSelected ? '2px solid #0D9488' : '1px solid #E2E8F0',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      background: isSelected ? '#F0FDFA' : '#FFFFFF',
                      boxShadow: isSelected ? '0 4px 12px rgba(13, 148, 136, 0.2)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ height: '80px', overflow: 'hidden', background: '#CBD5E1', position: 'relative' }}>
                      <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = '/images/slide4-300x176.jpg'; }} />
                      {isSelected && (
                        <div style={{ position: 'absolute', top: '6px', right: '6px', background: '#0D9488', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
                          <i className="fas fa-check"></i>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '10px', textAlign: 'center' }}>
                      <strong style={{ fontSize: '0.85rem', color: isSelected ? '#0D9488' : '#1E293B', display: 'block' }}>
                        {p.title}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{p.url}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {loading || !pageData ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '12px' }}>
          <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '2.5rem', color: '#0D9488' }}></i>
          <p style={{ marginTop: '16px', color: '#64748B', fontWeight: '500' }}>Loading page sections...</p>
        </div>
      ) : (
        <>
          {/* ========================================================================= */}
          {/* PAGE DESIGNER SECTION TABS */}
          {/* ========================================================================= */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto' }}>
            {[
              { id: 'hero', label: '1. Hero Banner (Top)', icon: 'fas fa-image' },
              { id: 'identity', label: '2. Presentation & Content', icon: 'fas fa-align-left' },
              { id: 'pillars', label: '3. Highlights / Cards', icon: 'fas fa-th-large' },
              ...(pageData.founder ? [{ id: 'founder', label: '4. Founder Story & Quote', icon: 'fas fa-quote-right' }] : []),
              ...(pageData.members ? [{ id: 'team', label: '4. Team Members', icon: 'fas fa-users' }] : []),
              { id: 'cta', label: '5. CTA Banner (Bottom)', icon: 'fas fa-bullhorn' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSectionTab(tab.id)}
                style={{
                  padding: '10px 18px',
                  border: 'none',
                  background: activeSectionTab === tab.id ? '#0D9488' : '#FFFFFF',
                  color: activeSectionTab === tab.id ? '#ffffff' : '#475569',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                }}
              >
                <i className={tab.icon}></i>
                {tab.label}
              </button>
            ))}
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: HERO BANNER */}
          {/* ========================================================================= */}
          {activeSectionTab === 'hero' && (
            <div style={{ background: '#FFFFFF', padding: '28px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
              <h4 style={{ margin: '0 0 20px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-image" style={{ color: '#0D9488' }}></i> Main Hero Banner
              </h4>

              {/* Background preview and upload */}
              <div style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>Hero Banner Background Image</label>
                <div style={{ width: '100%', height: '180px', borderRadius: '10px', overflow: 'hidden', background: '#CBD5E1', marginBottom: '10px', position: 'relative' }}>
                  <img
                    src={pageData.hero?.bgImage || '/images/image-12.jpg'}
                    alt="Hero Banner Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {uploadingField === 'hero_bg_field' && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      <i className="fas fa-circle-notch fa-spin"></i>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-control"
                    value={pageData.hero?.bgImage || ''}
                    onChange={(e) => updateNested('hero', 'bgImage', e.target.value)}
                    placeholder="Image URL or path (/images/...)"
                  />
                  <label style={{ padding: '8px 14px', background: '#0D9488', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                    <i className="fas fa-upload"></i> Upload
                    <input
                      id="hero_bg_field"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(e, (url) => updateNested('hero', 'bgImage', url))}
                    />
                  </label>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>Header Badge Text</label>
                  <input
                    type="text"
                    className="form-control"
                    value={pageData.hero?.badge || ''}
                    onChange={(e) => updateNested('hero', 'badge', e.target.value)}
                    placeholder="e.g. Travel Requirements & Tips"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>Badge Icon (FontAwesome)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={pageData.hero?.badgeIcon || 'fas fa-compass'}
                    onChange={(e) => updateNested('hero', 'badgeIcon', e.target.value)}
                    placeholder="e.g. fas fa-compass"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>Main H1 Page Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={pageData.hero?.title || pageData.title || ''}
                  onChange={(e) => updateNested('hero', 'title', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>Banner Subtitle / Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={pageData.hero?.description || ''}
                  onChange={(e) => updateNested('hero', 'description', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: IDENTITY / PRESENTATION */}
          {/* ========================================================================= */}
          {activeSectionTab === 'identity' && (
            <div style={{ background: '#FFFFFF', padding: '28px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
              <h4 style={{ margin: '0 0 20px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-align-left" style={{ color: '#0D9488' }}></i> Page Presentation & Text Content
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '28px' }}>
                <div>
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>Subtitle (Golden/Accent)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={pageData.intro?.subtitle || pageData.identity?.subtitle || ''}
                      onChange={(e) => {
                        updateNested('identity', 'subtitle', e.target.value);
                        if (pageData.intro) updateNested('intro', 'subtitle', e.target.value);
                      }}
                      placeholder="e.g. VISAGES & TALENTS"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>Main Section Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={pageData.intro?.title || pageData.identity?.title || ''}
                      onChange={(e) => {
                        updateNested('identity', 'title', e.target.value);
                        if (pageData.intro) updateNested('intro', 'title', e.target.value);
                      }}
                      placeholder="e.g. À Vos Côtés de A à Z"
                    />
                  </div>

                  {pageData.intro ? (
                    <div className="form-group" style={{ marginBottom: '14px' }}>
                      <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>Description</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        value={pageData.intro?.description || pageData.identity?.paragraph1 || ''}
                        onChange={(e) => {
                          updateNested('intro', 'description', e.target.value);
                          updateNested('identity', 'paragraph1', e.target.value);
                        }}
                        placeholder="De la conception de votre itinéraire..."
                      />
                    </div>
                  ) : (
                    <>
                      <div className="form-group" style={{ marginBottom: '14px' }}>
                        <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>Paragraph 1</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          value={pageData.identity?.paragraph1 || ''}
                          onChange={(e) => updateNested('identity', 'paragraph1', e.target.value)}
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: '14px' }}>
                        <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>Paragraph 2</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          value={pageData.identity?.paragraph2 || ''}
                          onChange={(e) => updateNested('identity', 'paragraph2', e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>Paragraph 3</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={pageData.identity?.paragraph3 || ''}
                      onChange={(e) => updateNested('identity', 'paragraph3', e.target.value)}
                    />
                  </div>
                </div>

                {/* Right Image */}
                <div>
                  <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>Illustrative Image (Right)</label>
                  <div style={{ width: '100%', height: '260px', borderRadius: '12px', overflow: 'hidden', background: '#CBD5E1', marginBottom: '10px', position: 'relative' }}>
                    <img
                      src={pageData.identity?.image || '/images/image-9.jpg'}
                      alt="Illustration"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {uploadingField === 'identity_img_field' && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        <i className="fas fa-circle-notch fa-spin"></i>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="form-control"
                      value={pageData.identity?.image || ''}
                      onChange={(e) => updateNested('identity', 'image', e.target.value)}
                      placeholder="Image URL (/images/...)"
                    />
                    <label style={{ padding: '8px 14px', background: '#0D9488', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fas fa-upload"></i> Upload
                      <input
                        id="identity_img_field"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload(e, (url) => updateNested('identity', 'image', url))}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: PILLARS / ADVANTAGES */}
          {/* ========================================================================= */}
          {activeSectionTab === 'pillars' && (
            <div style={{ background: '#FFFFFF', padding: '28px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '14px', marginBottom: '24px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: '600', fontSize: '0.82rem' }}>Subtitle</label>
                  <input
                    type="text"
                    className="form-control"
                    value={pageData.pillars?.subtitle || ''}
                    onChange={(e) => updateNested('pillars', 'subtitle', e.target.value)}
                    placeholder="e.g. Why Choose Us"
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: '600', fontSize: '0.82rem' }}>Section Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={pageData.pillars?.title || ''}
                    onChange={(e) => updateNested('pillars', 'title', e.target.value)}
                    placeholder="e.g. The Key Pillars of Our Commitment"
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: '600', fontSize: '0.82rem' }}>Description</label>
                  <input
                    type="text"
                    className="form-control"
                    value={pageData.pillars?.description || ''}
                    onChange={(e) => updateNested('pillars', 'description', e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fas fa-th-large" style={{ color: '#0D9488' }}></i> Key Highlights / Cards ({pageData.pillars?.items?.length || 0})
                </h4>
                <button
                  type="button"
                  onClick={addPillar}
                  className="btn btn-outline btn-sm"
                  style={{ borderColor: '#0D9488', color: '#0D9488', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <i className="fas fa-plus"></i> Add Card
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '18px' }}>
                {(pageData.pillars?.items || []).map((pillar, pIdx) => (
                  <div key={pIdx} style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', background: '#F8FAFC', position: 'relative' }}>
                    <button
                      type="button"
                      onClick={() => removePillar(pIdx)}
                      title="Delete card"
                      style={{ position: 'absolute', top: '12px', right: '12px', background: '#FEE2E2', border: 'none', color: '#EF4444', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#F0FDFA', color: '#0D9488', border: '1px solid #CCFBF1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                        <i className={pillar.icon || 'fas fa-check'}></i>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Card #{pIdx + 1}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px', gap: '8px', marginBottom: '8px' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: '600' }}>Title</label>
                        <input
                          type="text"
                          className="form-control"
                          style={{ fontSize: '0.85rem' }}
                          value={pillar.title || ''}
                          onChange={(e) => handlePillarChange(pIdx, 'title', e.target.value)}
                        />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: '600' }}>FA Icon</label>
                        <input
                          type="text"
                          className="form-control"
                          style={{ fontSize: '0.82rem' }}
                          value={pillar.icon || 'fas fa-check'}
                          onChange={(e) => handlePillarChange(pIdx, 'icon', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: '600' }}>Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        style={{ fontSize: '0.82rem' }}
                        value={pillar.desc || ''}
                        onChange={(e) => handlePillarChange(pIdx, 'desc', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: FOUNDER NOTE */}
          {/* ========================================================================= */}
          {activeSectionTab === 'founder' && pageData.founder && (
            <div style={{ background: '#FFFFFF', padding: '28px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
              <h4 style={{ margin: '0 0 20px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-quote-right" style={{ color: '#0D9488' }}></i> Founder Story & Philosophy
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '28px' }}>
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                  <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 12px', border: '3px solid #0D9488', position: 'relative' }}>
                    <img
                      src={pageData.founder?.photo || '/images/mr-singh.jpg'}
                      alt="Photo"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {uploadingField === 'founder_photo_f' && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        <i className="fas fa-circle-notch fa-spin"></i>
                      </div>
                    )}
                  </div>

                  <label style={{ padding: '6px 12px', background: '#0D9488', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                    <i className="fas fa-camera"></i> Change Photo
                    <input
                      id="founder_photo_f"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(e, (url) => updateNested('founder', 'photo', url))}
                    />
                  </label>

                  <div className="form-group" style={{ marginBottom: '10px', textAlign: 'left' }}>
                    <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: '600' }}>Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={pageData.founder?.name || ''}
                      onChange={(e) => updateNested('founder', 'name', e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0, textAlign: 'left' }}>
                    <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: '600' }}>Role / Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={pageData.founder?.role || ''}
                      onChange={(e) => updateNested('founder', 'role', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>Key Quote / Philosophy</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      style={{ fontStyle: 'italic', background: '#F8FAFC' }}
                      value={pageData.founder?.quote || ''}
                      onChange={(e) => updateNested('founder', 'quote', e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>Story Paragraph 1</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={pageData.founder?.description1 || ''}
                      onChange={(e) => updateNested('founder', 'description1', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>Story Paragraph 2</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={pageData.founder?.description2 || ''}
                      onChange={(e) => updateNested('founder', 'description2', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: TEAM MEMBERS (IF NOTRE EQUIPE) */}
          {/* ========================================================================= */}
          {activeSectionTab === 'team' && pageData.members && (
            <div style={{ background: '#FFFFFF', padding: '28px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fas fa-users" style={{ color: '#0D9488' }}></i> Team Members ({pageData.members?.length || 0})
                </h4>
                <button
                  type="button"
                  onClick={addMember}
                  className="btn btn-outline btn-sm"
                  style={{ borderColor: '#0D9488', color: '#0D9488', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <i className="fas fa-plus"></i> Add Member
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '20px' }}>
                {pageData.members.map((member, mIdx) => (
                  <div key={mIdx} style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', background: '#F8FAFC', position: 'relative' }}>
                    <button
                      type="button"
                      onClick={() => removeMember(mIdx)}
                      title="Delete member"
                      style={{ position: 'absolute', top: '12px', right: '12px', background: '#FEE2E2', border: 'none', color: '#EF4444', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>

                    <div style={{ width: '100%', height: '140px', borderRadius: '8px', overflow: 'hidden', background: '#CBD5E1', marginBottom: '10px', position: 'relative' }}>
                      <img src={member.image || '/images/image-12.jpg'} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                      <input
                        type="text"
                        className="form-control"
                        style={{ fontSize: '0.8rem' }}
                        value={member.image || ''}
                        onChange={(e) => handleMemberChange(mIdx, 'image', e.target.value)}
                        placeholder="Photo URL (/images/...)"
                      />
                      <label style={{ padding: '6px 10px', background: '#0D9488', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
                        <i className="fas fa-upload"></i>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => handleFileUpload(e, (url) => handleMemberChange(mIdx, 'image', url))}
                        />
                      </label>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: '600' }}>Nom & Prénom *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={member.name || ''}
                          onChange={(e) => handleMemberChange(mIdx, 'name', e.target.value)}
                        />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: '600' }}>Catégorie *</label>
                        <select
                          className="form-control"
                          value={member.category || 'Guides Francophones'}
                          onChange={(e) => handleMemberChange(mIdx, 'category', e.target.value)}
                        >
                          <option value="Direction">Direction</option>
                          <option value="Guides Francophones">Guides Francophones</option>
                          <option value="Management">Management</option>
                          <option value="Chauffeurs Privés">Chauffeurs Privés</option>
                          <option value="Conseillers">Conseillers</option>
                          <option value="Autre">Autre</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: '600' }}>Rôle / Titre *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={member.role || ''}
                          onChange={(e) => handleMemberChange(mIdx, 'role', e.target.value)}
                        />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: '600' }}>Spécialité / Régions</label>
                        <input
                          type="text"
                          className="form-control"
                          value={member.specialty || ''}
                          onChange={(e) => handleMemberChange(mIdx, 'specialty', e.target.value)}
                          placeholder="e.g. Rajasthan, Inde du Nord..."
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '8px' }}>
                      <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: '600' }}>Citation / Devise (Quote)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={member.quote || ''}
                        onChange={(e) => handleMemberChange(mIdx, 'quote', e.target.value)}
                        placeholder="« Partager notre amour profond pour l'Inde... »"
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: '600' }}>Biographie</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        style={{ fontSize: '0.82rem' }}
                        value={member.desc || ''}
                        onChange={(e) => handleMemberChange(mIdx, 'desc', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: CTA BANNER */}
          {/* ========================================================================= */}
          {activeSectionTab === 'cta' && (
            <div style={{ background: '#FFFFFF', padding: '28px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
              <h4 style={{ margin: '0 0 20px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-bullhorn" style={{ color: '#0D9488' }}></i> Call to Action Banner (CTA)
              </h4>

              <div style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>Background Image</label>
                <div style={{ width: '100%', height: '160px', borderRadius: '10px', overflow: 'hidden', background: '#CBD5E1', marginBottom: '10px', position: 'relative' }}>
                  <img
                    src={pageData.cta?.bgImage || '/images/image-8.jpg'}
                    alt="CTA Background"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-control"
                    value={pageData.cta?.bgImage || ''}
                    onChange={(e) => updateNested('cta', 'bgImage', e.target.value)}
                    placeholder="Image URL"
                  />
                  <label style={{ padding: '8px 14px', background: '#0D9488', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="fas fa-upload"></i> Upload
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(e, (url) => updateNested('cta', 'bgImage', url))}
                    />
                  </label>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>Catchy Headline / Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={pageData.cta?.title || ''}
                  onChange={(e) => updateNested('cta', 'title', e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>Button Text</label>
                  <input
                    type="text"
                    className="form-control"
                    value={pageData.cta?.buttonText || 'Request a Custom Quote'}
                    onChange={(e) => updateNested('cta', 'buttonText', e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>Button Redirect Link</label>
                  <input
                    type="text"
                    className="form-control"
                    value={pageData.cta?.buttonLink || '/voyage-sur-mesure'}
                    onChange={(e) => updateNested('cta', 'buttonLink', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bottom Save Button */}
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleSave}
              className="btn btn-primary btn-lg"
              style={{ minWidth: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              disabled={saving}
            >
              {saving ? (
                <>
                  <i className="fas fa-circle-notch fa-spin"></i> Saving changes...
                </>
              ) : (
                <>
                  <i className="fas fa-check-circle"></i> Save All Changes
                </>
              )}
            </button>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminPages;
