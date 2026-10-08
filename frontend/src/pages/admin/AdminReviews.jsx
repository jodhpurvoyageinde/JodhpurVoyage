import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import AdminImageUpload from '../../components/AdminImageUpload';
import { fetchAdminReviews, updateReview, deleteReview, createAdminReview } from '../../services/api';

const DEFAULT_REVIEW_FORM = {
  heading: '',
  image: '/images/image-8.jpg',
  shortDescription: '',
  longDescription: '',
  status: 'approved'
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
      heading: review.heading || review.title || review.tourTitle || '',
      image: review.image || review.img || '/images/image-8.jpg',
      shortDescription: review.shortDescription || review.excerpt || '',
      longDescription: review.longDescription || review.comment || review.excerpt || '',
      status: review.status || 'approved'
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
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer définitivement ce commentaire ?')) return;
    try {
      await deleteReview(id);
      loadReviews();
    } catch (err) {
      console.error('Error deleting review:', err);
      alert(err.response?.data?.message || 'Erreur lors de la suppression du commentaire.');
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        heading: formData.heading,
        title: formData.heading,
        image: formData.image || '/images/image-8.jpg',
        img: formData.image || '/images/image-8.jpg',
        shortDescription: formData.shortDescription,
        excerpt: formData.shortDescription,
        longDescription: formData.longDescription,
        comment: formData.longDescription,
        status: formData.status || 'approved'
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
      alert(err.response?.data?.message || 'Erreur lors de l\'enregistrement du commentaire.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter reviews by search query locally
  const filteredReviews = reviews.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const heading = (r.heading || r.title || r.tourTitle || '').toLowerCase();
    const shortDesc = (r.shortDescription || r.excerpt || '').toLowerCase();
    const longDesc = (r.longDescription || r.comment || '').toLowerCase();
    return heading.includes(q) || shortDesc.includes(q) || longDesc.includes(q);
  });

  return (
    <AdminLayout 
      title="Commentaires & Témoignages" 
      subtitle="Gérez les commentaires des voyageurs (Heading, Image, Description courte et Description longue)."
    >
      {/* Top Filter and Actions Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div className="admin-filter-bar" style={{ margin: 0 }}>
          <button className={`admin-filter-chip ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => setFilterStatus('all')}>
            <i className="fas fa-list"></i>
            <span>Tous les commentaires</span>
            {filterStatus === 'all' && <span className="admin-filter-count">{reviews.length}</span>}
          </button>
          <button className={`admin-filter-chip ${filterStatus === 'approved' ? 'active' : ''}`} onClick={() => setFilterStatus('approved')}>
            <i className="fas fa-check-circle"></i>
            <span>Publiés ({reviews.filter(r => r.status === 'approved').length})</span>
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
              placeholder="Rechercher un commentaire..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '34px', width: '250px', height: '38px', borderRadius: '8px' }}
            />
          </div>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <i className="fas fa-plus"></i> Ajouter un Commentaire
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px' }}>
          <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '2.5rem', color: 'var(--admin-primary)' }}></i>
          <p style={{ marginTop: '16px', color: 'var(--admin-text-muted)' }}>Chargement des commentaires...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="admin-table-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <i className="fas fa-comments" style={{ fontSize: '3rem', color: '#CBD5E1', marginBottom: '16px', display: 'block' }}></i>
          <h3 style={{ color: 'var(--admin-text-main)', margin: '0 0 8px' }}>Aucun commentaire trouvé</h3>
          <p style={{ color: 'var(--admin-text-muted)', margin: '0 0 16px' }}>Ajoutez un nouveau commentaire avec les 4 champs (Heading, Image, Description courte, Description longue).</p>
          <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
            <i className="fas fa-plus"></i> Créer un Commentaire
          </button>
        </div>
      ) : (
        <div className="admin-table-card">
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '70px' }}>Image</th>
                  <th style={{ width: '220px' }}>Titre / Heading</th>
                  <th style={{ width: '240px' }}>Description courte</th>
                  <th>Description longue</th>
                  <th style={{ width: '100px' }}>Statut</th>
                  <th style={{ textAlign: 'right', width: '110px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((r) => {
                  const rId = r._id || r.id;
                  const imgSrc = r.image || r.img || '/images/image-8.jpg';
                  const headingText = r.heading || r.title || r.tourTitle || 'Commentaire';
                  const shortDescText = r.shortDescription || r.excerpt || '';
                  const longDescText = r.longDescription || r.comment || '';

                  return (
                    <tr key={rId}>
                      <td>
                        <img 
                          src={imgSrc} 
                          onError={(e) => { e.currentTarget.src = '/images/image-8.jpg'; }}
                          alt={headingText} 
                          style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #E2E8F0' }}
                        />
                      </td>
                      <td>
                        <strong style={{ color: 'var(--admin-text-main)', fontSize: '0.95rem' }}>{headingText}</strong>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: '#475569' }}>
                        <p style={{ margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {shortDescText || <span style={{ color: '#94A3B8', fontStyle: 'italic' }}>Non renseignée</span>}
                        </p>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: '#334155' }}>
                        <p style={{ margin: 0, fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          "{longDescText || <span style={{ color: '#94A3B8' }}>Non renseignée</span>}"
                        </p>
                      </td>
                      <td>
                        <span className={`admin-status-badge ${r.status === 'approved' ? 'status-confirme' : 'status-annule'}`}>
                          {r.status === 'approved' ? <><i className="fas fa-check"></i> En ligne</> : <><i className="fas fa-ban"></i> Masqué</>}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button 
                            className="btn btn-sm btn-outline" 
                            onClick={() => handleOpenEdit(r)} 
                            title="Modifier ce commentaire"
                            style={{ padding: '4px 8px' }}
                          >
                            <i className="fas fa-edit"></i>
                          </button>

                          {r.status !== 'approved' ? (
                            <button className="btn btn-sm" style={{ background: '#DCFCE7', color: '#15803D', border: '1px solid #BBF7D0', padding: '4px 8px' }} onClick={() => handleStatusChange(rId, 'approved')} title="Publier en ligne">
                              <i className="fas fa-check"></i>
                            </button>
                          ) : (
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

      {/* Modal Add / Edit Review (ONLY 4 FIELDS: Heading, Image, Short Description, Long Description) */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', height: '100%', margin: 0, overflow: 'hidden' }}>
              <div className="modal-header">
                <h3 className="modal-title">
                  <i className="fas fa-comment-dots" style={{ color: 'var(--admin-gold)' }}></i>
                  <span>{isEditing ? 'Modifier le Commentaire' : 'Ajouter un Commentaire'}</span>
                </h3>
                <button type="button" className="modal-close" onClick={() => setIsModalOpen(false)} title="Fermer la boîte de dialogue">
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                {/* Field 1: Heading / Titre */}
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontWeight: '600' }}>Titre / Heading *</label>
                  <input 
                    type="text" 
                    required 
                    className="form-control" 
                    placeholder="ex: Voyage au Rajasthan 14 Jours" 
                    value={formData.heading} 
                    onChange={(e) => setFormData({ ...formData, heading: e.target.value })} 
                  />
                  <small style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                    Titre principal du commentaire affiché sur la carte.
                  </small>
                </div>

                {/* Field 2: Image */}
                <div style={{ marginBottom: '16px' }}>
                  <AdminImageUpload
                    label="Image / Photo"
                    value={formData.image || ''}
                    onChange={(url) => setFormData({ ...formData, image: url })}
                    placeholder="URL de l'image ou choisir une photo depuis l'appareil"
                  />
                  <small style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                    Photo d'illustration du commentaire (format paysage recommandé).
                  </small>
                </div>

                {/* Field 3: Short Description */}
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontWeight: '600' }}>Description courte (Short Description) *</label>
                  <textarea 
                    rows="3" 
                    required 
                    className="form-control" 
                    placeholder="Courte description / résumé qui s'affiche sur la carte du commentaire..." 
                    value={formData.shortDescription} 
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} 
                  ></textarea>
                  <small style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                    Texte court présenté sur la carte d'aperçu dans la grille des commentaires.
                  </small>
                </div>

                {/* Field 4: Long Description */}
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontWeight: '600' }}>Description longue (Long Description) *</label>
                  <textarea 
                    rows="6" 
                    required 
                    className="form-control" 
                    placeholder="Témoignage complet et détaillé du voyageur sur son expérience avec Jodhpur Voyage..." 
                    value={formData.longDescription} 
                    onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })} 
                  ></textarea>
                  <small style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                    Texte intégral affiché lors de l'ouverture du témoignage complet.
                  </small>
                </div>

                {/* Status Selector */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: '600' }}>Statut</label>
                  <select 
                    className="form-control" 
                    value={formData.status} 
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="approved">En ligne (Publié)</option>
                    <option value="rejected">Masqué</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  <i className={`fas ${submitting ? 'fa-spinner fa-spin' : 'fa-check'}`}></i>
                  <span>{isEditing ? 'Enregistrer les modifications' : 'Publier le Commentaire'}</span>
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
