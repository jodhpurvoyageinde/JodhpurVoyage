import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import {
  fetchAdminHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  reorderHeroSlides,
  resetHeroSlides,
  uploadImage
} from '../../services/api';

const COMMON_ICONS = [
  { label: 'Crown / Royal', value: 'fa-crown' },
  { label: 'Water / River', value: 'fa-water' },
  { label: 'Fort / Palace', value: 'fa-fort-awesome' },
  { label: 'Mountain / Trek', value: 'fa-mountain' },
  { label: 'Sun / Desert', value: 'fa-sun' },
  { label: 'Gem / Luxury', value: 'fa-gem' },
  { label: 'Compass / Travel', value: 'fa-compass' },
  { label: 'Star / Featured', value: 'fa-star' },
  { label: 'Om / Spiritual', value: 'fa-om' },
  { label: 'Leaf / Nature', value: 'fa-leaf' },
  { label: 'Shield / Safe', value: 'fa-user-shield' },
  { label: 'Heart / Passion', value: 'fa-heart' },
  { label: 'Landmark / Culture', value: 'fa-landmark' },
  { label: 'Wheel / Dharma', value: 'fa-dharmachakra' }
];

const DEFAULT_SLIDE_FORM = {
  image: '/images/dest-rajasthan.jpg',
  badge: '',
  badgeIcon: 'fa-crown',
  title: '',
  titleHighlight: '',
  description: '',
  isActive: true
};

const AdminHeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState(0);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ ...DEFAULT_SLIDE_FORM });

  // Toast state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const fileInputRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  // Load slides from backend
  const loadSlides = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminHeroSlides();
      const list = res.data?.data || (Array.isArray(res.data) ? res.data : []);
      setSlides(list);
      if (selectedPreviewIndex >= list.length) {
        setSelectedPreviewIndex(0);
      }
    } catch (err) {
      console.error('Error fetching hero slides:', err);
      showToast('Impossible de charger les slides du slider.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlides();
  }, []);

  // Open modal for Create
  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      ...DEFAULT_SLIDE_FORM,
      order: slides.length
    });
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (slide) => {
    setEditingId(slide._id);
    setFormData({
      image: slide.image || '',
      badge: slide.badge || '',
      badgeIcon: slide.badgeIcon || 'fa-star',
      title: slide.title || '',
      titleHighlight: slide.titleHighlight || '',
      description: slide.description || '',
      isActive: slide.isActive !== false
    });
    setIsModalOpen(true);
  };

  // File Upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadImage(file);
      if (res.data?.url) {
        setFormData((prev) => ({ ...prev, image: res.data.url }));
        showToast('Image téléchargée avec succès !', 'success');
      } else {
        showToast('Téléchargement réussi mais aucun lien retourné', 'error');
      }
    } catch (err) {
      console.error('Upload error:', err);
      showToast(err.response?.data?.message || 'Erreur lors du téléchargement de l’image.', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Save (Create or Update)
  const handleSaveSlide = async (e) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      showToast('Veuillez renseigner un titre pour cette slide.', 'error');
      return;
    }
    if (!formData.image?.trim()) {
      showToast('Veuillez renseigner une image (URL ou fichier).', 'error');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await updateHeroSlide(editingId, formData);
        showToast('Slide mise à jour avec succès !', 'success');
      } else {
        await createHeroSlide(formData);
        showToast('Nouvelle slide ajoutée avec succès !', 'success');
      }
      setIsModalOpen(false);
      loadSlides();
    } catch (err) {
      console.error('Save error:', err);
      showToast(err.response?.data?.message || 'Erreur lors de l’enregistrement de la slide.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Toggle Active / Inactive
  const handleToggleActive = async (slide) => {
    const newStatus = slide.isActive === false ? true : false;
    try {
      setSlides((prev) =>
        prev.map((s) => (s._id === slide._id ? { ...s, isActive: newStatus } : s))
      );
      await updateHeroSlide(slide._id, { isActive: newStatus });
      showToast(newStatus ? 'Slide activée' : 'Slide désactivée', 'info');
    } catch (err) {
      console.error(err);
      showToast('Erreur lors du changement de statut', 'error');
      loadSlides();
    }
  };

  // Delete slide
  const handleDeleteSlide = async (slide) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la slide "${slide.title}" ?`)) {
      return;
    }
    try {
      await deleteHeroSlide(slide._id);
      showToast('Slide supprimée avec succès', 'info');
      loadSlides();
    } catch (err) {
      console.error(err);
      showToast('Erreur lors de la suppression', 'error');
    }
  };

  // Move slide up
  const handleMoveUp = async (index) => {
    if (index === 0) return;
    const newSlides = [...slides];
    const temp = newSlides[index - 1];
    newSlides[index - 1] = newSlides[index];
    newSlides[index] = temp;
    setSlides(newSlides);
    setSelectedPreviewIndex(index - 1);

    try {
      const slideIds = newSlides.map((s) => s._id);
      await reorderHeroSlides(slideIds);
      showToast('Nouvel ordre enregistré', 'success');
    } catch (err) {
      console.error(err);
      showToast('Erreur lors de la réorganisation', 'error');
      loadSlides();
    }
  };

  // Move slide down
  const handleMoveDown = async (index) => {
    if (index === slides.length - 1) return;
    const newSlides = [...slides];
    const temp = newSlides[index + 1];
    newSlides[index + 1] = newSlides[index];
    newSlides[index] = temp;
    setSlides(newSlides);
    setSelectedPreviewIndex(index + 1);

    try {
      const slideIds = newSlides.map((s) => s._id);
      await reorderHeroSlides(slideIds);
      showToast('Nouvel ordre enregistré', 'success');
    } catch (err) {
      console.error(err);
      showToast('Erreur lors de la réorganisation', 'error');
      loadSlides();
    }
  };

  // Reset to default 14 slides
  const handleResetToDefaults = async () => {
    if (!window.confirm('Voulez-vous réinitialiser le slider avec les 14 slides d’origine ? Toutes vos modifications personnalisées seront écrasées.')) {
      return;
    }
    setLoading(true);
    try {
      await resetHeroSlides();
      showToast('Slider réinitialisé avec les 14 slides d’origine !', 'success');
      loadSlides();
    } catch (err) {
      console.error(err);
      showToast('Erreur lors de la réinitialisation.', 'error');
      setLoading(false);
    }
  };

  // Filtered slides
  const filteredSlides = slides.filter((slide) => {
    const matchesSearch =
      (slide.title || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
      (slide.titleHighlight || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
      (slide.badge || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
      (slide.description || '').toLowerCase().includes(searchFilter.toLowerCase());

    if (statusFilter === 'active') return matchesSearch && slide.isActive !== false;
    if (statusFilter === 'inactive') return matchesSearch && slide.isActive === false;
    return matchesSearch;
  });

  const previewSlide = slides[selectedPreviewIndex] || slides[0] || formData;

  return (
    <AdminLayout
      title="Hero Slider — Page d'Accueil"
      subtitle="Ajoutez, modifiez ou réorganisez les photos et textes qui défilent en haut de la page d'accueil."
    >
      {/* Toast Notification */}
      {toast.show && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 9999,
            padding: '12px 20px',
            borderRadius: '8px',
            color: '#fff',
            fontWeight: '600',
            fontSize: '0.9rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor:
              toast.type === 'error'
                ? '#EF4444'
                : toast.type === 'info'
                ? '#3B82F6'
                : '#10B981',
            transition: 'all 0.3s ease'
          }}
        >
          <i
            className={`fas ${
              toast.type === 'error'
                ? 'fa-exclamation-circle'
                : toast.type === 'info'
                ? 'fa-info-circle'
                : 'fa-check-circle'
            }`}
          ></i>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Action Header Card */}
      <div
        style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '20px 24px',
          marginBottom: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Total Slides</span>
            <h3 style={{ fontSize: '1.6rem', color: '#0F172A', margin: '2px 0 0', fontWeight: 700 }}>
              {slides.length}
            </h3>
          </div>
          <div style={{ width: '1px', height: '36px', background: '#E2E8F0' }}></div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Slides Actives</span>
            <h3 style={{ fontSize: '1.6rem', color: '#10B981', margin: '2px 0 0', fontWeight: 700 }}>
              {slides.filter((s) => s.isActive !== false).length}
            </h3>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <button
            onClick={handleResetToDefaults}
            className="btn btn-outline btn-sm"
            style={{ borderColor: '#CBD5E1', color: '#475569' }}
            title="Restaurer les 14 slides d'origine"
          >
            <i className="fas fa-undo-alt"></i> Réinitialiser par défaut
          </button>

          <Link
            to="/"
            target="_blank"
            className="btn btn-outline btn-sm"
            style={{ borderColor: '#0D9488', color: '#0D9488' }}
          >
            <i className="fas fa-external-link-alt"></i> Voir sur le Site
          </Link>

          <button
            onClick={handleOpenCreateModal}
            className="btn btn-primary btn-sm"
            style={{
              background: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
              color: '#fff',
              border: 'none',
              boxShadow: '0 4px 12px rgba(13, 148, 136, 0.25)'
            }}
          >
            <i className="fas fa-plus"></i> Ajouter une Nouvelle Slide
          </button>
        </div>
      </div>

      {/* Grid: Preview & Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)', gap: '24px', marginBottom: '30px' }}>
        
        {/* Interactive Real-Time Preview Card */}
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            border: '1px solid #E2E8F0'
          }}
        >
          <div
            style={{
              padding: '14px 20px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#F8FAFC'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-eye" style={{ color: '#0D9488' }}></i>
              <span style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.9rem' }}>
                Aperçu en Direct sur la Page d'Accueil
              </span>
            </div>
            {previewSlide && (
              <span style={{ fontSize: '0.78rem', background: '#E2E8F0', padding: '3px 8px', borderRadius: '4px', color: '#475569' }}>
                Slide #{selectedPreviewIndex + 1} / {slides.length}
              </span>
            )}
          </div>

          {/* Actual mockup of the hero slider */}
          <div
            style={{
              position: 'relative',
              height: '340px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#0F172A',
              color: '#fff',
              textAlign: 'center',
              padding: '20px'
            }}
          >
            {/* Background Image */}
            <img
              src={previewSlide?.image || '/images/dest-rajasthan.jpg'}
              alt={previewSlide?.title || 'Preview'}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.7)'
              }}
              onError={(e) => { e.currentTarget.src = '/images/dest-rajasthan.jpg'; }}
            />

            {/* Dark overlay */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to bottom, rgba(15,23,42,0.3) 0%, rgba(15,23,42,0.65) 100%)'
              }}
            ></div>

            {/* Mockup Content */}
            <div style={{ position: 'relative', zIndex: 2, maxWidth: '580px', width: '100%' }}>
              {previewSlide?.badge && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 14px',
                    borderRadius: '20px',
                    background: 'rgba(15, 23, 42, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    marginBottom: '10px',
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  <i className={`fas ${previewSlide.badgeIcon || 'fa-star'}`} style={{ color: '#F59E0B' }}></i>
                  <span>{previewSlide.badge}</span>
                </div>
              )}

              <h2
                style={{
                  fontSize: '1.9rem',
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontWeight: 700,
                  margin: '0 0 10px',
                  lineHeight: 1.2
                }}
              >
                {previewSlide?.title || 'Titre de la slide'}{' '}
                {previewSlide?.titleHighlight && (
                  <span style={{ color: '#38BDF8', fontStyle: 'italic', fontWeight: 600 }}>
                    {previewSlide.titleHighlight}
                  </span>
                )}
              </h2>

              <p
                style={{
                  fontSize: '0.88rem',
                  opacity: 0.9,
                  lineHeight: 1.45,
                  margin: '0 auto 16px',
                  maxHeight: '65px',
                  overflow: 'hidden'
                }}
              >
                {previewSlide?.description || 'Description et sous-titre de la slide...'}
              </p>

              {/* Mock Search Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.22)',
                  borderRadius: '30px',
                  padding: '4px 6px 4px 14px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  maxWidth: '440px',
                  margin: '0 auto'
                }}
              >
                <i className="fas fa-search" style={{ fontSize: '0.8rem', opacity: 0.8, marginRight: '8px' }}></i>
                <span style={{ fontSize: '0.78rem', opacity: 0.85, flex: 1, textAlign: 'left' }}>
                  Laissez-vous inspirer (ex: Rajasthan, Taj Mahal, Varanasi...)
                </span>
                <span
                  style={{
                    background: '#0D9488',
                    color: '#fff',
                    borderRadius: '20px',
                    padding: '5px 12px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}
                >
                  Rechercher →
                </span>
              </div>
            </div>

            {/* Bottom dots */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                display: 'flex',
                gap: '6px',
                zIndex: 3
              }}
            >
              {slides.map((_, idx) => (
                <span
                  key={idx}
                  onClick={() => setSelectedPreviewIndex(idx)}
                  style={{
                    width: idx === selectedPreviewIndex ? '20px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    background: idx === selectedPreviewIndex ? '#0D9488' : 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                ></span>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: '12px 20px',
              background: '#F8FAFC',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn btn-sm btn-outline"
                onClick={() => setSelectedPreviewIndex((prev) => (prev - 1 + slides.length) % slides.length)}
                disabled={slides.length <= 1}
              >
                <i className="fas fa-chevron-left"></i> Précédent
              </button>
              <button
                className="btn btn-sm btn-outline"
                onClick={() => setSelectedPreviewIndex((prev) => (prev + 1) % slides.length)}
                disabled={slides.length <= 1}
              >
                Suivant <i className="fas fa-chevron-right"></i>
              </button>
            </div>

            {previewSlide && (
              <button
                onClick={() => handleOpenEditModal(previewSlide)}
                className="btn btn-sm btn-primary"
              >
                <i className="fas fa-edit"></i> Modifier cette Slide
              </button>
            )}
          </div>
        </div>

        {/* Quick Instructions & Tips Card */}
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            border: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <h4 style={{ margin: '0 0 12px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-lightbulb" style={{ color: '#F59E0B' }}></i>
              <span>Conseils pour un Slider Impressionnant</span>
            </h4>
            <ul style={{ paddingLeft: '20px', margin: 0, color: '#475569', fontSize: '0.88rem', lineHeight: '1.7' }}>
              <li>
                <strong>Image HD :</strong> Utilisez de superbes photos panoramiques (format paysage 1920x800 px ou similaire). Vous pouvez directement téléverser depuis votre ordinateur.
              </li>
              <li>
                <strong>Titre & Mot Mis en Valeur :</strong> Séparez le texte normal (ex: <em>"Les Ghats de"</em>) du mot en surbrillance cyan (ex: <em>"Varanasi"</em>).
              </li>
              <li>
                <strong>Badge & Icône :</strong> Choisissez un badge percutant comme <em>"Rituels Sacrés"</em>, <em>"Tour Opérateur Spécialisé"</em> avec l'icône appropriée.
              </li>
              <li>
                <strong>Ordre des Slides :</strong> Utilisez les boutons <i className="fas fa-arrow-up"></i> et <i className="fas fa-arrow-down"></i> pour choisir quelle slide apparaît en premier.
              </li>
              <li>
                <strong>Statut Actif :</strong> Désactivez une slide sans la supprimer pour la masquer temporairement.
              </li>
            </ul>
          </div>

          <div
            style={{
              marginTop: '20px',
              padding: '14px',
              borderRadius: '8px',
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <i className="fas fa-check-circle" style={{ color: '#16A34A', fontSize: '1.2rem' }}></i>
            <span style={{ fontSize: '0.85rem', color: '#166534' }}>
              Toutes les modifications enregistrées ici s'affichent automatiquement en temps réel sur la page d'accueil !
            </span>
          </div>
        </div>
      </div>

      {/* Slide List & Management Section */}
      <div
        style={{
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden'
        }}
      >
        {/* Table / List Controls Bar */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '240px' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
              <i
                className="fas fa-search"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
              ></i>
              <input
                type="text"
                placeholder="Rechercher par titre, ville, badge..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 34px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  fontSize: '0.88rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                className={`btn btn-sm ${statusFilter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setStatusFilter('all')}
              >
                Toutes ({slides.length})
              </button>
              <button
                className={`btn btn-sm ${statusFilter === 'active' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setStatusFilter('active')}
              >
                Actives ({slides.filter((s) => s.isActive !== false).length})
              </button>
              <button
                className={`btn btn-sm ${statusFilter === 'inactive' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setStatusFilter('inactive')}
              >
                Inactives ({slides.filter((s) => s.isActive === false).length})
              </button>
            </div>
          </div>

          <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
            Affichage de <strong>{filteredSlides.length}</strong> slide(s)
          </span>
        </div>

        {/* Slides Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '2rem', color: '#0D9488' }}></i>
            <p style={{ marginTop: '12px', color: '#64748B' }}>Chargement des slides du hero slider...</p>
          </div>
        ) : filteredSlides.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <i className="fas fa-images" style={{ fontSize: '2.5rem', color: '#CBD5E1', marginBottom: '12px' }}></i>
            <h4 style={{ color: '#334155', margin: '0 0 6px' }}>Aucune slide trouvée</h4>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '16px' }}>
              {searchFilter ? 'Aucun résultat ne correspond à votre recherche.' : 'Le slider ne contient encore aucune slide.'}
            </p>
            <button onClick={handleOpenCreateModal} className="btn btn-primary btn-sm">
              <i className="fas fa-plus"></i> Ajouter la première slide
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 600 }}>
                  <th style={{ padding: '12px 16px', width: '70px', textAlign: 'center' }}>Ordre</th>
                  <th style={{ padding: '12px 16px', width: '120px' }}>Visuel</th>
                  <th style={{ padding: '12px 16px' }}>Titre & Texte Mis en Valeur</th>
                  <th style={{ padding: '12px 16px', width: '170px' }}>Badge</th>
                  <th style={{ padding: '12px 16px', width: '100px', textAlign: 'center' }}>Statut</th>
                  <th style={{ padding: '12px 16px', width: '160px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSlides.map((slide, idx) => {
                  const globalIndex = slides.findIndex((s) => s._id === slide._id);
                  const isSelected = selectedPreviewIndex === globalIndex;

                  return (
                    <tr
                      key={slide._id || idx}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        background: isSelected ? '#F0FDFA' : 'transparent',
                        transition: 'background 0.2s'
                      }}
                    >
                      {/* Order & Reordering buttons */}
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                          <button
                            onClick={() => handleMoveUp(globalIndex)}
                            disabled={globalIndex === 0}
                            style={{
                              border: 'none',
                              background: 'none',
                              color: globalIndex === 0 ? '#CBD5E1' : '#0D9488',
                              cursor: globalIndex === 0 ? 'not-allowed' : 'pointer',
                              padding: '2px 6px',
                              fontSize: '0.8rem'
                            }}
                            title="Monter"
                          >
                            <i className="fas fa-chevron-up"></i>
                          </button>
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              color: '#334155',
                              background: '#F1F5F9',
                              borderRadius: '4px',
                              padding: '1px 6px'
                            }}
                          >
                            #{globalIndex + 1}
                          </span>
                          <button
                            onClick={() => handleMoveDown(globalIndex)}
                            disabled={globalIndex === slides.length - 1}
                            style={{
                              border: 'none',
                              background: 'none',
                              color: globalIndex === slides.length - 1 ? '#CBD5E1' : '#0D9488',
                              cursor: globalIndex === slides.length - 1 ? 'not-allowed' : 'pointer',
                              padding: '2px 6px',
                              fontSize: '0.8rem'
                            }}
                            title="Descendre"
                          >
                            <i className="fas fa-chevron-down"></i>
                          </button>
                        </div>
                      </td>

                      {/* Image Thumbnail */}
                      <td style={{ padding: '12px 16px' }}>
                        <div
                          style={{
                            width: '100px',
                            height: '60px',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            position: 'relative',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                            cursor: 'pointer'
                          }}
                          onClick={() => setSelectedPreviewIndex(globalIndex)}
                          title="Cliquer pour prévisualiser"
                        >
                          <img
                            src={slide.image}
                            alt={slide.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.currentTarget.src = '/images/dest-rajasthan.jpg'; }}
                          />
                        </div>
                      </td>

                      {/* Title & Description */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.95rem' }}>
                            {slide.title}
                          </span>
                          {slide.titleHighlight && (
                            <span
                              style={{
                                background: '#E0F2FE',
                                color: '#0284C7',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontWeight: 700,
                                fontSize: '0.85rem'
                              }}
                            >
                              {slide.titleHighlight}
                            </span>
                          )}
                        </div>
                        <p
                          style={{
                            margin: '4px 0 0',
                            color: '#64748B',
                            fontSize: '0.8rem',
                            maxWidth: '480px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {slide.description}
                        </p>
                      </td>

                      {/* Badge */}
                      <td style={{ padding: '12px 16px' }}>
                        {slide.badge ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '3px 8px',
                              borderRadius: '12px',
                              background: '#FEF3C7',
                              color: '#92400E',
                              fontSize: '0.78rem',
                              fontWeight: 600
                            }}
                          >
                            <i className={`fas ${slide.badgeIcon || 'fa-star'}`}></i>
                            {slide.badge}
                          </span>
                        ) : (
                          <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>—</span>
                        )}
                      </td>

                      {/* Status Active toggle */}
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleToggleActive(slide)}
                          style={{
                            border: 'none',
                            background: slide.isActive !== false ? '#DCFCE7' : '#FEE2E2',
                            color: slide.isActive !== false ? '#15803D' : '#B91C1C',
                            padding: '4px 10px',
                            borderRadius: '16px',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <i className={`fas ${slide.isActive !== false ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                          {slide.isActive !== false ? 'Actif' : 'Masqué'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => setSelectedPreviewIndex(globalIndex)}
                            className="btn btn-sm"
                            style={{
                              padding: '5px 9px',
                              background: isSelected ? '#0D9488' : '#F1F5F9',
                              color: isSelected ? '#fff' : '#475569',
                              border: 'none',
                              borderRadius: '6px'
                            }}
                            title="Aperçu en direct"
                          >
                            <i className="fas fa-eye"></i>
                          </button>

                          <button
                            onClick={() => handleOpenEditModal(slide)}
                            className="btn btn-sm"
                            style={{
                              padding: '5px 9px',
                              background: '#F1F5F9',
                              color: '#0284C7',
                              border: 'none',
                              borderRadius: '6px'
                            }}
                            title="Modifier cette slide"
                          >
                            <i className="fas fa-pencil-alt"></i>
                          </button>

                          <button
                            onClick={() => handleDeleteSlide(slide)}
                            className="btn btn-sm"
                            style={{
                              padding: '5px 9px',
                              background: '#FEE2E2',
                              color: '#EF4444',
                              border: 'none',
                              borderRadius: '6px'
                            }}
                            title="Supprimer"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide Add / Edit Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px',
            backdropFilter: 'blur(3px)'
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              maxWidth: '720px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <h3 style={{ margin: 0, color: '#0F172A', fontSize: '1.25rem', fontWeight: 700 }}>
                  {editingId ? 'Modifier la Slide du Slider' : 'Ajouter une Nouvelle Slide au Slider'}
                </h3>
                <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: '0.85rem' }}>
                  Personnalisez l'image, le badge, le titre et le texte d'accroche.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  border: 'none',
                  background: '#F1F5F9',
                  color: '#64748B',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveSlide} style={{ padding: '24px' }}>
              {/* Image Section */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 600, color: '#1E293B', marginBottom: '8px', fontSize: '0.9rem' }}>
                  Photo de fond du Slider <span style={{ color: '#EF4444' }}>*</span>
                </label>
                
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px', alignItems: 'center' }}>
                  {/* Thumbnail preview */}
                  <div
                    style={{
                      height: '80px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: '#F1F5F9',
                      border: '1px solid #CBD5E1',
                      position: 'relative'
                    }}
                  >
                    <img
                      src={formData.image || '/images/dest-rajasthan.jpg'}
                      alt="Aperçu"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.src = '/images/dest-rajasthan.jpg'; }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="btn btn-sm btn-outline"
                        style={{ borderColor: '#0D9488', color: '#0D9488' }}
                      >
                        <i className={`fas ${uploading ? 'fa-spinner fa-spin' : 'fa-upload'}`}></i>{' '}
                        {uploading ? 'Téléchargement...' : 'Téléverser une image'}
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Ou collez l'URL (/images/image-7.jpg ou https://...)"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #CBD5E1',
                        borderRadius: '6px',
                        fontSize: '0.85rem'
                      }}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Title & Highlight Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: '#1E293B', marginBottom: '6px', fontSize: '0.9rem' }}>
                    Titre Principal <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Les Ghats de, Les Splendeurs du..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '6px',
                      fontSize: '0.9rem'
                    }}
                    required
                  />
                  <small style={{ color: '#64748B', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                    Texte blanc principal
                  </small>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: '#1E293B', marginBottom: '6px', fontSize: '0.9rem' }}>
                    Texte Mis en Valeur (Cyan / Bleu)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Varanasi, Rajasthan, Inde & Népal..."
                    value={formData.titleHighlight}
                    onChange={(e) => setFormData({ ...formData, titleHighlight: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: '#0284C7'
                    }}
                  />
                  <small style={{ color: '#64748B', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                    S'affiche en italique cyan brillant
                  </small>
                </div>
              </div>

              {/* Badge & Icon Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: '#1E293B', marginBottom: '6px', fontSize: '0.9rem' }}>
                    Texte du Badge (Optionnel)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Rituels Sacrés, Aventure & Sommets..."
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '6px',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: '#1E293B', marginBottom: '6px', fontSize: '0.9rem' }}>
                    Icône du Badge
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        background: '#F8FAFC',
                        border: '1px solid #CBD5E1',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#D97706'
                      }}
                    >
                      <i className={`fas ${formData.badgeIcon || 'fa-star'}`}></i>
                    </div>
                    <select
                      value={formData.badgeIcon}
                      onChange={(e) => setFormData({ ...formData, badgeIcon: e.target.value })}
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        border: '1px solid #CBD5E1',
                        borderRadius: '6px',
                        fontSize: '0.85rem'
                      }}
                    >
                      {COMMON_ICONS.map((icon) => (
                        <option key={icon.value} value={icon.value}>
                          {icon.label} ({icon.value})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Description Paragraph */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 600, color: '#1E293B', marginBottom: '6px', fontSize: '0.9rem' }}>
                  Texte de Description / Sous-titre
                </label>
                <textarea
                  rows={3}
                  placeholder="Assistez aux cérémonies de l'Aarti au bord du Gange sacré..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    fontSize: '0.88rem',
                    lineHeight: 1.5
                  }}
                ></textarea>
              </div>

              {/* Active Toggle Switch */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px',
                  background: '#F8FAFC',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  marginBottom: '24px'
                }}
              >
                <input
                  type="checkbox"
                  id="modalIsActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#0D9488', cursor: 'pointer' }}
                />
                <label htmlFor="modalIsActive" style={{ fontWeight: 600, color: '#1E293B', cursor: 'pointer', fontSize: '0.9rem' }}>
                  Activer cette slide sur le site public
                </label>
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-outline"
                  style={{ borderColor: '#CBD5E1', color: '#475569' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary"
                  style={{
                    background: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 24px',
                    fontWeight: 600
                  }}
                >
                  <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-check'}`}></i>{' '}
                  {saving ? 'Enregistrement...' : editingId ? 'Mettre à jour la Slide' : 'Créer la Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminHeroSlider;
