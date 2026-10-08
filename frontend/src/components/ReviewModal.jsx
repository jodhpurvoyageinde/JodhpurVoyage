import React, { useState } from 'react';
import { submitPublicReview } from '../services/api';

const ReviewModal = ({ isOpen, onClose, onReviewSubmitted }) => {
  const [formData, setFormData] = useState({
    heading: '',
    shortDescription: '',
    longDescription: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload = {
        heading: formData.heading,
        title: formData.heading,
        shortDescription: formData.shortDescription,
        excerpt: formData.shortDescription,
        longDescription: formData.longDescription,
        comment: formData.longDescription,
        image: formData.image || '/images/image-8.jpg'
      };
      const res = await submitPublicReview(payload);
      setSuccessMsg(res.data.message || 'Merci pour votre commentaire ! Il sera visible après validation.');
      if (onReviewSubmitted) onReviewSubmitted();
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
        setFormData({ heading: '', shortDescription: '', longDescription: '', image: '' });
      }, 2200);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Erreur lors de l’enregistrement de votre commentaire.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        <div className="modal-header">
          <h3 className="modal-title"><i className="fas fa-comment-dots" style={{ color: 'var(--gold-color)' }}></i> Laisser un Commentaire</h3>
          <button className="modal-close" onClick={onClose}><i className="fas fa-times"></i></button>
        </div>

        <div className="modal-body">
          {successMsg ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#15803d' }}>
              <i className="fas fa-check-circle" style={{ fontSize: '3rem', marginBottom: '16px' }}></i>
              <h4>Commentaire envoyé avec succès !</h4>
              <p>{successMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {errorMsg && (
                <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', marginBottom: '16px', fontSize: '0.9rem' }}>
                  {errorMsg}
                </div>
              )}

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontWeight: '600' }}>Titre / Heading *</label>
                <input 
                  type="text" 
                  name="heading" 
                  required 
                  className="form-control" 
                  placeholder="ex: Séjour inoubliable au Rajasthan" 
                  value={formData.heading} 
                  onChange={handleChange} 
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontWeight: '600' }}>Lien ou URL de la Photo (Optionnel)</label>
                <input 
                  type="text" 
                  name="image" 
                  className="form-control" 
                  placeholder="https://..." 
                  value={formData.image} 
                  onChange={handleChange} 
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontWeight: '600' }}>Description courte (Short Description) *</label>
                <textarea 
                  name="shortDescription" 
                  required 
                  rows="3" 
                  className="form-control" 
                  placeholder="Résumé court de votre expérience..." 
                  value={formData.shortDescription} 
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ fontWeight: '600' }}>Description longue (Long Description) *</label>
                <textarea 
                  name="longDescription" 
                  required 
                  rows="5" 
                  className="form-control" 
                  placeholder="Racontez en détail votre voyage, l'accueil, les visites et vos impressions..." 
                  value={formData.longDescription} 
                  onChange={handleChange}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-check"></i> Envoyer mon commentaire</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
