import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import AdminImageUpload from '../../components/AdminImageUpload';
import { fetchAdminReviews, updateReview, deleteReview, createAdminReview } from '../../services/api';

const DEFAULT_REVIEW_FORM = {
  authorName: '',
  authorCity: 'France',
  tourTitle: 'Voyage au Rajasthan 14 Jours',
  title: '',
  category: 'rajasthan',
  rating: 5,
  travelDate: 'Janvier 2026',
  comment: '',
  tag: '',
  tagIcon: 'fas fa-map-marker-alt',
  link: '/tour-rajasthan',
  image: '/images/Voyage-Jaisalmer.jpg',
  status: 'approved',
  featured: false
};

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_REVIEW_FORM);
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = () => {
    setLoading(true);
    fetchAdminReviews({ status: filterStatus })
      .then((res) => {
        setReviews(Array.isArray(res.data) ? res.data : (res.data?.reviews || []));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading reviews:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadReviews();
  }, [filterStatus]);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ ...DEFAULT_REVIEW_FORM });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (review) => {
    setIsEditing(true);
    setCurrentId(review._id || review.id);
    setFormData({
      authorName: review.authorName || '',
      authorCity: review.authorCity || 'France',
      tourTitle: review.tourTitle || 'Voyage au Rajasthan',
      title: review.title || review.tourTitle || '',
      category: review.category || 'rajasthan',
      rating: review.rating || 5,
      travelDate: review.travelDate || 'Janvier 2026',
      comment: review.comment || review.excerpt || '',
      tag: review.tag || '',
      tagIcon: review.tagIcon || 'fas fa-map-marker-alt',
      link: review.link || '/tour-rajasthan',
      image: review.image || review.img || '/images/image-8.jpg',
      status: review.status || 'approved',
      featured: Boolean(review.featured)
    });
    setIsModalOpen(true);
  };

  const handleStatusChange = async (id, status) => {
    try {
      setReviews((prev) =>
        prev.map((r) => ((r._id === id || r.id === id) ? { ...r, status } : r))
      );
      await updateReview(id, { status });
      loadReviews();
    } catch (err) {
      console.error('Error changing review status:', err);
      alert(err.response?.data?.message || 'Erreur lors du changement de statut.');
      loadReviews();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer définitivement cet avis client ?')) return;
    try {
      await deleteReview(id);
      loadReviews();
    } catch (err) {
      console.error('Error deleting review:', err);
      alert(err.response?.data?.message || 'Erreur lors de la suppression de l\'avis.');
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        img: formData.image,
        title: formData.title || formData.tourTitle,
        tag: formData.tag || `${formData.tourTitle || 'Voyage'} • ${formData.authorCity || 'France'}`
      };

      if (isEditing && currentId) {
        await updateReview(currentId, payload);
      } else {
        await createAdminReview(payload);
      }

      setIsModalOpen(false);
      setFormData({ ...DEFAULT_REVIEW_FORM });
      loadReviews();
    } catch (err) {
      console.error('Error saving review:', err);
      alert(err.response?.data?.message || 'Erreur lors de l\'enregistrement de l\'avis.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter reviews by search query locally
  const filteredReviews = reviews.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const str = `${r.authorName} ${r.authorCity} ${r.tourTitle} ${r.title} ${r.comment} ${r.tag} ${r.category}`.toLowerCase();
    return str.includes(q);
  });

  return (
    <AdminLayout 
      title="Avis Clients & Modération" 
      subtitle="Gérez, modifiez, validez ou ajoutez les témoignages réels des voyageurs affichés sur le site."
    >
      {/* Top Filter and Actions Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div className="admin-filter-bar" style={{ margin: 0 }}>
          <button className={`admin-filter-chip ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => setFilterStatus('all')}>
            <i className="fas fa-list"></i>
            <span>Tous les avis</span>
            {filterStatus === 'all' && <span className="admin-filter-count">{reviews.length}</span>}
          </button>
          <button className={`admin-filter-chip ${filterStatus === 'approved' ? 'active' : ''}`} onClick={() => setFilterStatus('approved')}>
            <i className="fas fa-check-circle"></i>
            <span>Publiés ({reviews.filter(r => r.status === 'approved').length})</span>
          </button>
          <button className={`admin-filter-chip ${filterStatus === 'pending' ? 'active' : ''}`} onClick={() => setFilterStatus('pending')}>
            <i className="fas fa-hourglass-half"></i>
            <span>En attente ({reviews.filter(r => r.status === 'pending').length})</span>
          </button>
          <button className={`admin-filter-chip ${filterStatus === 'rejected' ? 'active' : ''}`} onClick={() => setFilterStatus('rejected')}>
            <i className="fas fa-eye-slash"></i>
            <span>Masqués ({reviews.filter(r => r.status === 'rejected').length})</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}></i>
            <input 
              type="text" 
              placeholder="Rechercher voyageur, circuit..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '34px', width: '240px', height: '38px', borderRadius: '8px' }}
            />
          </div>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <i className="fas fa-plus"></i> Ajouter un Avis
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px' }}>
          <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '2.5rem', color: 'var(--admin-primary)' }}></i>
          <p style={{ marginTop: '16px', color: 'var(--admin-text-muted)' }}>Chargement des avis clients...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="admin-table-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <i className="fas fa-star-half-alt" style={{ fontSize: '3rem', color: '#CBD5E1', marginBottom: '16px', display: 'block' }}></i>
          <h3 style={{ color: 'var(--admin-text-main)', margin: '0 0 8px' }}>Aucun avis trouvé</h3>
          <p style={{ color: 'var(--admin-text-muted)', margin: '0 0 16px' }}>Modifiez vos filtres ou ajoutez un nouveau commentaire de voyageur.</p>
          <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
            <i className="fas fa-plus"></i> Créer un Avis
          </button>
        </div>
      ) : (
        <div className="admin-table-card">
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Visuel</th>
                  <th>Voyageur</th>
                  <th>Circuit & Date</th>
                  <th>Région</th>
                  <th>Note</th>
                  <th>Commentaire</th>
                  <th>Statut</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((r) => {
                  const rId = r._id || r.id;
                  const imgSrc = r.image || r.img || '/images/image-8.jpg';
                  return (
                    <tr key={rId}>
                      <td>
                        <img 
                          src={imgSrc} 
                          onError={(e) => { e.currentTarget.src = '/images/image-8.jpg'; }}
                          alt={r.authorName} 
                          style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #E2E8F0' }}
                        />
                      </td>
                      <td>
                        <strong style={{ color: 'var(--admin-text-main)' }}>{r.authorName}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                          <i className="fas fa-map-pin"></i> {r.authorCity || 'France'}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--admin-navy)' }}>{r.tourTitle || r.title || 'Voyage en Inde'}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>{r.travelDate || 'Voyage Récent'}</div>
                      </td>
                      <td>
                        <span style={{ 
                          display: 'inline-block',
                          padding: '3px 8px', 
                          borderRadius: '12px', 
                          fontSize: '0.74rem', 
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          background: '#EFF6FF',
                          color: '#1D4ED8'
                        }}>
                          {r.category || 'rajasthan'}
                        </span>
                      </td>
                      <td>
                        <div style={{ color: '#F59E0B', display: 'flex', gap: '2px' }}>
                          {[...Array(Number(r.rating) || 5)].map((_, i) => (
                            <i key={i} className="fas fa-star" style={{ fontSize: '0.82rem' }}></i>
                          ))}
                        </div>
                      </td>
                      <td style={{ maxWidth: '300px', fontSize: '0.86rem', lineHeight: '1.45' }}>
                        <p style={{ margin: 0, fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', color: '#334155' }}>
                          "{r.comment || r.excerpt}"
                        </p>
                      </td>
                      <td>
                        <span className={`admin-status-badge ${r.status === 'approved' ? 'status-confirme' : (r.status === 'pending' ? 'status-nouveau' : 'status-annule')}`}>
                          {r.status === 'approved' ? <><i className="fas fa-check"></i> En ligne</> : (r.status === 'pending' ? <><i className="fas fa-clock"></i> En attente</> : <><i className="fas fa-ban"></i> Masqué</>)}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button 
                            className="btn btn-sm btn-outline" 
                            onClick={() => handleOpenEdit(r)} 
                            title="Modifier cet avis"
                            style={{ padding: '4px 8px' }}
                          >
                            <i className="fas fa-edit"></i>
                          </button>

                          {r.status !== 'approved' && (
                            <button className="btn btn-sm" style={{ background: '#DCFCE7', color: '#15803D', border: '1px solid #BBF7D0', padding: '4px 8px' }} onClick={() => handleStatusChange(rId, 'approved')} title="Publier en ligne">
                              <i className="fas fa-check"></i>
                            </button>
                          )}
                          {r.status !== 'rejected' && (
                            <button className="btn btn-sm" style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A', padding: '4px 8px' }} onClick={() => handleStatusChange(rId, 'rejected')} title="Masquer du site">
                              <i className="fas fa-eye-slash"></i>
                            </button>
                          )}
                          <button className="btn btn-sm" style={{ background: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA', padding: '4px 8px' }} onClick={() => handleDelete(rId)} title="Supprimer définitivement">
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add / Edit Review */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
            <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', height: '100%', margin: 0, overflow: 'hidden' }}>
              <div className="modal-header">
                <h3 className="modal-title">
                  <i className="fas fa-star" style={{ color: 'var(--admin-gold)' }}></i>
                  <span>{isEditing ? 'Modifier l’Avis Client' : 'Ajouter un Avis Client Vérifié'}</span>
                </h3>
                <button type="button" className="modal-close" onClick={() => setIsModalOpen(false)} title="Fermer la boîte de dialogue">
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600' }}>Nom du Voyageur / Famille *</label>
                    <input 
                      type="text" 
                      required 
                      className="form-control" 
                      placeholder="ex: Famille Moreau ou Chantal & Robert" 
                      value={formData.authorName} 
                      onChange={(e) => setFormData({ ...formData, authorName: e.target.value })} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600' }}>Ville / Pays</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="ex: Lyon, France" 
                      value={formData.authorCity} 
                      onChange={(e) => setFormData({ ...formData, authorCity: e.target.value })} 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600' }}>Titre du Circuit / Prestation</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="ex: Voyage au Rajasthan 14 Jours" 
                      value={formData.tourTitle} 
                      onChange={(e) => setFormData({ ...formData, tourTitle: e.target.value })} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600' }}>Catégorie Région</label>
                    <select 
                      className="form-control" 
                      value={formData.category} 
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="rajasthan">Rajasthan</option>
                      <option value="inde-du-nord">Inde du Nord</option>
                      <option value="ladakh">Ladakh & Himalaya</option>
                      <option value="inde-du-sud">Inde du Sud & Kerala</option>
                      <option value="gujarat">Gujarat & Népal</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600' }}>Note</label>
                    <select 
                      className="form-control" 
                      value={formData.rating} 
                      onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5 / 5)</option>
                      <option value="4">⭐⭐⭐⭐ (4 / 5)</option>
                      <option value="3">⭐⭐⭐ (3 / 5)</option>
                      <option value="2">⭐⭐ (2 / 5)</option>
                      <option value="1">⭐ (1 / 5)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600' }}>Date du Voyage</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="ex: Janvier 2026" 
                      value={formData.travelDate} 
                      onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600' }}>Statut</label>
                    <select 
                      className="form-control" 
                      value={formData.status} 
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="approved">En ligne (Publié)</option>
                      <option value="pending">En attente (Pending)</option>
                      <option value="rejected">Masqué (Hidden)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600' }}>Badge / Tag Affiché</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="ex: Rajasthan • 14 Jours" 
                      value={formData.tag} 
                      onChange={(e) => setFormData({ ...formData, tag: e.target.value })} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: '600' }}>Lien vers Circuit (Optionnel)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="/tour-rajasthan" 
                      value={formData.link} 
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })} 
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <AdminImageUpload
                    label="Photo du Circuit ou Témoignage"
                    value={formData.image || ''}
                    onChange={(url) => setFormData({ ...formData, image: url })}
                    placeholder="https://... ou choisir une photo depuis l'appareil"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: '600' }}>Commentaire / Témoignage complet *</label>
                  <textarea 
                    rows="4" 
                    required 
                    className="form-control" 
                    placeholder="Témoignage du voyageur sur son expérience avec Jodhpur Voyage..." 
                    value={formData.comment} 
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  <i className={`fas ${submitting ? 'fa-spinner fa-spin' : 'fa-check'}`}></i>
                  <span>{isEditing ? 'Enregistrer les modifications' : 'Publier l’Avis'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminReviews;
