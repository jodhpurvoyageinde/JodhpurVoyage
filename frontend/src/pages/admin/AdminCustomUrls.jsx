import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
  fetchCustomUrls,
  fetchCustomUrlConfig,
  createCustomUrl,
  updateCustomUrl,
  deleteCustomUrl,
  resolveCustomUrl,
  fetchDestinations,
  fetchTours,
  fetchBlogs
} from '../../services/api';
import { loadCustomUrlMappings } from '../../utils/customUrlHelper';

const AdminCustomUrls = () => {
  const [urlList, setUrlList] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [testPath, setTestPath] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  const [availableDestinations, setAvailableDestinations] = useState([]);
  const [availableTours, setAvailableTours] = useState([]);
  const [availableBlogs, setAvailableBlogs] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [formData, setFormData] = useState({
    customPath: '',
    targetUrl: '',
    targetType: 'custom',
    redirectType: 301,
    active: true,
    description: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [listRes, configRes, destRes, tourRes, blogRes] = await Promise.all([
        fetchCustomUrls(),
        fetchCustomUrlConfig().catch(() => ({ data: null })),
        fetchDestinations().catch(() => ({ data: [] })),
        fetchTours().catch(() => ({ data: [] })),
        fetchBlogs().catch(() => ({ data: [] }))
      ]);
      setUrlList(listRes.data || []);
      setConfig(configRes.data || null);
      await loadCustomUrlMappings();

      const dests = Array.isArray(destRes.data) ? destRes.data : (destRes.data?.destinations || destRes.data?.cities || []);
      const tours = Array.isArray(tourRes.data) ? tourRes.data : (tourRes.data?.tours || tourRes.data?.data || []);
      const blogs = Array.isArray(blogRes.data) ? blogRes.data : (blogRes.data?.blogs || blogRes.data?.posts || []);

      setAvailableDestinations(dests);
      setAvailableTours(tours);
      setAvailableBlogs(blogs);
    } catch (err) {
      console.error('Error fetching custom URLs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        customPath: item.customPath || '',
        targetUrl: item.targetUrl || '',
        targetType: item.targetType || 'custom',
        redirectType: item.redirectType || 301,
        active: item.active !== false,
        description: item.description || ''
      });
    } else {
      setEditingItem(null);
      setFormData({
        customPath: '',
        targetUrl: '',
        targetType: 'custom',
        redirectType: 301,
        active: true,
        description: ''
      });
    }
    setFeedback(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFeedback(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customPath.trim() || !formData.targetUrl.trim()) {
      setFeedback({ type: 'error', message: 'Veuillez saisir le chemin personnalisé (Custom Path) et la cible (Target URL).' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      if (editingItem) {
        await updateCustomUrl(editingItem._id, formData);
        setFeedback({ type: 'success', message: 'Route personnalisée mise à jour avec succès !' });
      } else {
        await createCustomUrl(formData);
        setFeedback({ type: 'success', message: 'Nouvelle route personnalisée ajoutée avec succès !' });
      }

      await loadData();
      setTimeout(() => {
        handleCloseModal();
      }, 1000);
    } catch (err) {
      console.error(err);
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Erreur lors de l’enregistrement de la route.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, path) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer la route personnalisée "${path}" ?`)) {
      return;
    }
    try {
      await deleteCustomUrl(id);
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la suppression.');
    }
  };

  const handleTestResolve = async (e) => {
    e.preventDefault();
    if (!testPath.trim()) return;
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await resolveCustomUrl(testPath);
      setTestResult({ success: true, data: res.data });
    } catch (err) {
      setTestResult({
        success: false,
        message: err.response?.data?.message || 'Aucune route trouvée pour ce chemin.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const filteredUrls = urlList.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.customPath?.toLowerCase().includes(q) ||
      item.targetUrl?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.targetType?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <AdminLayout title="Gestion des URLs Personnalisées" subtitle="Créez et gérez les routes et redirections d'URLs sur mesure pour votre site.">
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '2.5rem', color: 'var(--admin-primary)' }}></i>
          <p style={{ marginTop: '16px', color: 'var(--admin-text-muted)' }}>Chargement des routes personnalisées...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Custom URL & Route Manager"
      subtitle="Personnalisez facilement les liens d'URLs, redirections SEO et préfixes d'API du serveur."
    >
      {/* Top Banner Info */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', borderRadius: '16px', padding: '24px', color: '#fff', marginBottom: '24px', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ margin: 0, color: '#F8FAFC', fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fas fa-link" style={{ color: '#38BDF8' }}></i>
              Configuration Dynamic Custom URLs
            </h3>
            <p style={{ margin: '6px 0 0 0', color: '#94A3B8', fontSize: '0.9rem' }}>
              Définissez des URLs personnalisées lisibles (ex: <code>/circuit-royale</code> &rarr; <code>/tours/circuit-rajasthan-10-jours</code>) et des redirections 301 SEO.
            </p>
          </div>
          {config && (
            <div style={{ background: 'rgba(255,255,255,0.08)', padding: '10px 18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)', fontSize: '0.85rem' }}>
              <span style={{ color: '#94A3B8' }}>Prefix API Backend: </span>
              <strong style={{ color: '#38BDF8', fontFamily: 'monospace' }}>{config.apiPrefix || '/api'}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Action Bar & Quick Search */}
      <div className="admin-action-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 320px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}></i>
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher une URL personnalisée ou une cible..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px', height: '42px', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => handleOpenModal(null)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <i className="fas fa-plus-circle"></i> Ajouter une Nouvelle Route URL
        </button>
      </div>

      {/* Main Table */}
      <div className="admin-table-card" style={{ marginBottom: '30px' }}>
        <div className="admin-table-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--admin-text-main)' }}>
            <i className="fas fa-list" style={{ color: 'var(--admin-primary)', marginRight: '8px' }}></i>
            Liste des URLs Personnalisées ({filteredUrls.length})
          </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Chemin Personnalisé (Custom Path)</th>
                <th>URL de Cible (Target URL)</th>
                <th>Type</th>
                <th>Redirection</th>
                <th>Statut</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUrls.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
                    <i className="fas fa-link-slash" style={{ fontSize: '2rem', marginBottom: '10px', display: 'block', color: '#94A3B8' }}></i>
                    Aucune route d'URL personnalisée configurée. Cliquez sur "Ajouter une Nouvelle Route URL" pour commencer.
                  </td>
                </tr>
              ) : (
                filteredUrls.map((item) => (
                  <tr key={item._id || item.customPath}>
                    <td>
                      <code style={{ fontSize: '0.9rem', color: '#0F172A', background: '#F1F5F9', padding: '4px 8px', borderRadius: '6px', fontWeight: 700 }}>
                        {item.customPath}
                      </code>
                      {item.description && (
                        <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td style={{ color: '#0284C7', fontWeight: 500 }}>
                      <i className="fas fa-arrow-right" style={{ fontSize: '0.75rem', marginRight: '6px', color: '#94A3B8' }}></i>
                      {item.targetUrl}
                    </td>
                    <td>
                      <span className="badge badge-primary" style={{ textTransform: 'capitalize', fontSize: '0.75rem' }}>
                        {item.targetType || 'custom'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: item.redirectType === 200 ? '#16A34A' : '#D97706' }}>
                        HTTP {item.redirectType || 301} {item.redirectType === 200 ? '(Rewrite)' : '(Redirect)'}
                      </span>
                    </td>
                    <td>
                      {item.active !== false ? (
                        <span className="admin-status-badge status-confirme">
                          <i className="fas fa-check-circle"></i> Actif
                        </span>
                      ) : (
                        <span className="admin-status-badge status-annule">
                          <i className="fas fa-ban"></i> Inactif
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handleOpenModal(item)}
                          title="Modifier"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-sm"
                          onClick={() => handleDelete(item._id, item.customPath)}
                          style={{ background: '#FEE2E2', color: '#DC2626', border: '1px solid #FCA5A5' }}
                          title="Supprimer"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Route Tester Card */}
      <div className="admin-table-card" style={{ padding: '24px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--admin-text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fas fa-vial" style={{ color: 'var(--admin-primary)' }}></i> Testeur de Résolution d'URL en Direct
        </h3>
        <p style={{ color: '#64748B', fontSize: '0.88rem', margin: '0 0 16px 0' }}>
          Testez le fonctionnement de n'importe quel chemin d'URL pour vérifier où il sera dirigé par l'API Backend.
        </p>

        <form onSubmit={handleTestResolve} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-control"
            placeholder="ex: /circuit-sur-mesure ou /tours/mon-circuit"
            value={testPath}
            onChange={(e) => setTestPath(e.target.value)}
            style={{ flex: '1 1 300px', height: '42px' }}
          />
          <button type="submit" className="btn btn-primary" disabled={isTesting}>
            {isTesting ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-search"></i>} Tester Résolution
          </button>
        </form>

        {testResult && (
          <div style={{ marginTop: '16px', padding: '16px', borderRadius: '10px', background: testResult.success ? '#F0FDF4' : '#FEF2F2', border: `1px solid ${testResult.success ? '#86EFAC' : '#FCA5A5'}` }}>
            {testResult.success ? (
              <div>
                <div style={{ color: '#166534', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fas fa-check-circle"></i> URL Résolue avec Succès !
                </div>
                <div style={{ fontSize: '0.88rem', color: '#14532D' }}>
                  Chemin Custom: <code>{testResult.data.customPath}</code> &rarr; Cible: <strong>{testResult.data.targetUrl}</strong> (Type: {testResult.data.targetType})
                </div>
              </div>
            ) : (
              <div style={{ color: '#991B1B', fontWeight: 600, fontSize: '0.88rem' }}>
                <i className="fas fa-exclamation-circle"></i> {testResult.message}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <div className="booking-modal-overlay active" onClick={(e) => e.target.classList.contains('booking-modal-overlay') && handleCloseModal()}>
          <div className="booking-modal" style={{ maxWidth: '600px', borderRadius: '16px' }}>
            <div className="booking-modal-header" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#fff', padding: '18px 24px' }}>
              <button className="modal-close-btn" onClick={handleCloseModal} aria-label="Fermer">
                <i className="fas fa-times"></i>
              </button>
              <h3 className="booking-modal-title" style={{ color: '#fff', fontSize: '1.15rem', margin: 0 }}>
                <i className="fas fa-link" style={{ color: 'var(--admin-gold)' }}></i>
                {editingItem ? 'Modifier la Route URL Personnalisée' : 'Ajouter une Route URL Personnalisée'}
              </h3>
            </div>

            <div className="booking-modal-body" style={{ padding: '24px' }}>
              {feedback && (
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    background: feedback.type === 'success' ? '#DCFCE7' : '#FEE2E2',
                    border: `1px solid ${feedback.type === 'success' ? '#16A34A' : '#DC2626'}`,
                    color: feedback.type === 'success' ? '#14532D' : '#991B1B',
                    fontWeight: 600,
                    fontSize: '0.88rem'
                  }}
                >
                  <i className={`fas ${feedback.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i> {feedback.message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Quick Target Selector Dropdown */}
                <div className="form-group" style={{ marginBottom: '16px', background: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <label className="form-label" style={{ fontWeight: 600, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="fas fa-magic" style={{ color: 'var(--admin-gold)' }}></i>
                    Sélectionner une Page ou Destination Cible (Remplissage Rapide)
                  </label>
                  <select
                    className="form-control"
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) return;
                      const [selectedUrl, type] = val.split('|');
                      setFormData((prev) => {
                        const updated = {
                          ...prev,
                          targetUrl: selectedUrl,
                          targetType: type || prev.targetType
                        };
                        if (!prev.customPath) {
                          const cleanSlug = selectedUrl.replace(/^\//, '').replace(/\//g, '-');
                          if (cleanSlug) {
                            updated.customPath = '/' + cleanSlug;
                          }
                        }
                        return updated;
                      });
                    }}
                    defaultValue=""
                  >
                    <option value="">-- Choisir une page ou destination dans la liste --</option>
                    <optgroup label="📍 Pages Principales du Site">
                      <option value="/destinations|custom">📍 Page Liste des Destinations (/destinations)</option>
                      <option value="/tours|custom">📍 Page Liste des Circuits / Tours (/tours)</option>
                      <option value="/voyage-sur-mesure|custom">📍 Page Voyage sur Mesure (/voyage-sur-mesure)</option>
                      <option value="/contact|custom">📍 Page Contact (/contact)</option>
                      <option value="/blog|custom">📍 Page Articles & Blog (/blog)</option>
                    </optgroup>

                    {availableDestinations.length > 0 && (
                      <optgroup label="🏙️ Destinations Individuelles">
                        {availableDestinations.map((d) => (
                          <option key={d._id || d.slug} value={`/destinations/${d.slug}|destination`}>
                            🏙️ {d.name || d.title} (/destinations/{d.slug})
                          </option>
                        ))}
                      </optgroup>
                    )}

                    {availableTours.length > 0 && (
                      <optgroup label="🐪 Circuits & Tours">
                        {availableTours.map((t) => (
                          <option key={t._id || t.slug} value={`/${t.slug}|tour`}>
                            🐪 {t.title || t.name} (/{t.slug})
                          </option>
                        ))}
                      </optgroup>
                    )}

                    {availableBlogs.length > 0 && (
                      <optgroup label="📝 Articles de Blog">
                        {availableBlogs.map((b) => (
                          <option key={b._id || b.slug} value={`/blog/${b.slug}|blog`}>
                            📝 {b.title} (/blog/{b.slug})
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                  <small style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
                    Choisissez une page existante pour remplir automatiquement l'URL Cible et le Type.
                  </small>
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>
                    <i className="fas fa-globe"></i> Chemin Custom (Custom Path) *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="customPath"
                    placeholder="ex: /mes-destinations ou /jodhpur-voyage"
                    value={formData.customPath}
                    onChange={handleChange}
                    required
                  />
                  <small style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    Le chemin qui apparaîtra juste après https://votre-domaine.com (ex: <code>/destinations</code> ou <code>/nos-destinations</code>)
                  </small>
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>
                    <i className="fas fa-bullseye"></i> URL de Cible (Target URL) *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="targetUrl"
                    placeholder="ex: /category/rajasthan, https://... ou #"
                    value={formData.targetUrl}
                    onChange={handleChange}
                    required
                  />
                  <small style={{ fontSize: '0.75rem', color: '#64748B' }}>Route interne (ex: /category/rajasthan), lien externe complet (https://...) ou '#'</small>
                </div>

                <div className="form-row-compact" style={{ marginBottom: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>Type de Cible</label>
                    <select
                      className="form-control"
                      name="targetType"
                      value={formData.targetType}
                      onChange={handleChange}
                    >
                      <option value="custom">Custom</option>
                      <option value="tour">Tour / Circuit</option>
                      <option value="destination">Destination</option>
                      <option value="blog">Article Blog</option>
                      <option value="redirect">Redirection Externe</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>Redirection HTTP</label>
                    <select
                      className="form-control"
                      name="redirectType"
                      value={formData.redirectType}
                      onChange={handleChange}
                    >
                      <option value={301}>301 (Permanent Redirect)</option>
                      <option value={302}>302 (Temporary Redirect)</option>
                      <option value={200}>200 (Internal Rewrite)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>Description / Note Interne</label>
                  <input
                    type="text"
                    className="form-control"
                    name="description"
                    placeholder="ex: Lien promo campagne Instagram 2026"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={handleChange}
                    />
                    Route URL active en ligne
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button type="button" className="btn btn-outline" onClick={handleCloseModal}>
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span><i className="fas fa-spinner fa-spin"></i> Enregistrement...</span>
                    ) : (
                      <span><i className="fas fa-save"></i> Enregistrer la Route</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCustomUrls;
