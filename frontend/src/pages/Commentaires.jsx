import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchReviews } from '../services/api';
import ReviewModal from '../components/ReviewModal';
import SEO from '../components/SEO';

const Commentaires = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const loadReviewsData = () => {
    setLoading(true);
    fetchReviews()
      .then((res) => {
        if (res.data?.reviews && Array.isArray(res.data.reviews)) {
          setReviews(res.data.reviews);
        } else if (Array.isArray(res.data)) {
          setReviews(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur chargement avis:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadReviewsData();
  }, []);

  // Reset to page 1 whenever search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Filter reviews by search query on the 4 fields
  const filteredReviews = reviews.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;

    const headingText = (item.heading || item.title || item.tourTitle || '').toLowerCase();
    const shortText = (item.shortDescription || item.excerpt || '').toLowerCase();
    const longText = (item.longDescription || item.comment || '').toLowerCase();

    return headingText.includes(q) || shortText.includes(q) || longText.includes(q);
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredReviews.length);
  const currentReviews = filteredReviews.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      const section = document.getElementById('reviews-listing-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div>
      <SEO pageKey="commentaires" />

      {/* HERO BANNER */}
      <section className="reviews-hero-section">
        <img 
          src="https://www.jodhpurvoyage.com/wp-content/uploads/2025/08/image-8.jpg" 
          onError={(e) => { e.currentTarget.src = "/images/image-8.jpg"; }}
          alt="Reviews Banner" 
          className="reviews-hero-bg" 
        />
        <div className="container reviews-hero-content">
          <span className="hero-badge"><i className="fas fa-comment-dots"></i> Retours d'Expérience</span>
          <h1 className="reviews-hero-title">Vos Avis &amp; Commentaires</h1>
          <p className="reviews-hero-desc">
            Découvrez les retours et récits d'expérience de nos voyageurs francophones partis avec Jodhpur Voyage.
          </p>
        </div>
      </section>

      {/* SEARCH BAR & HEADER ACTIONS */}
      <section className="reviews-filter-section bg-white">
        <div className="container">
          <div className="reviews-filter-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div className="reviews-count-text" style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-dark)' }}>
              <i className="fas fa-comments" style={{ color: 'var(--color-primary)', marginRight: '8px' }}></i>
              <span>{filteredReviews.length} {filteredReviews.length > 1 ? 'Commentaires Voyageurs' : 'Commentaire Voyageur'}</span>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', flex: '1', maxWidth: '560px', justifyContent: 'flex-end' }}>
              <div className="reviews-search-box" style={{ margin: 0, flex: '1', minWidth: '240px' }}>
                <i className="fas fa-search reviews-search-icon"></i>
                <input 
                  type="text" 
                  id="review-search-input" 
                  placeholder="Rechercher dans les commentaires..." 
                  className="reviews-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={() => setIsReviewModalOpen(true)}
                style={{ padding: '0.6rem 1.2rem', whiteSpace: 'nowrap' }}
              >
                <i className="fas fa-pen"></i> Laisser un avis
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN REVIEWS LISTING SECTION */}
      <section id="reviews-listing-section" className="section-padding bg-cream pt-0">
        <div className="container">
          {/* Loading Indicator */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '16px', margin: '20px 0' }}>
              <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '16px' }}></i>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Chargement des commentaires...</p>
            </div>
          ) : (
            <>
              {/* Header Summary */}
              {filteredReviews.length > 0 && (
                <div className="reviews-count-header">
                  <div className="reviews-count-text">
                    Affichage de <strong>{startIndex + 1} à {endIndex}</strong> sur <strong>{filteredReviews.length}</strong> commentaires
                  </div>
                  {totalPages > 1 && (
                    <div className="reviews-page-indicator">
                      Page {currentPage} / {totalPages}
                    </div>
                  )}
                </div>
              )}

              <div id="reviews-grid">
                {filteredReviews.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '16px' }}>
                    <i className="fas fa-comment-slash" style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '16px' }}></i>
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--secondary-color)', marginBottom: '8px' }}>Aucun commentaire trouvé</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Essayez un autre mot-clé ou réinitialisez votre recherche.</p>
                    {searchQuery && (
                      <button 
                        className="btn btn-primary" 
                        onClick={() => setSearchQuery('')}
                        style={{ marginTop: '16px' }}
                      >
                        Voir tous les commentaires
                      </button>
                    )}
                  </div>
                ) : (
                  currentReviews.map((rev) => {
                    const revId = rev._id || rev.id;
                    const slugifyText = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    const revSlug = rev.slug || slugifyText(rev.heading || rev.title || rev.tourTitle) || revId;
                    const cardImg = rev.image || rev.img || '/images/image-8.jpg';
                    const headingText = rev.heading || rev.title || rev.tourTitle || 'Commentaire Voyageur';
                    const shortDescText = rev.shortDescription || rev.excerpt || rev.comment || '';

                    return (
                      <Link 
                        key={revId} 
                        to={`/commentaire/${revSlug}`}
                        className="review-card"
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <div className="review-card-img-wrap">
                          <img 
                            src={cardImg} 
                            onError={(e) => { e.currentTarget.src = '/images/image-8.jpg'; }}
                            alt={headingText} 
                            className="review-card-img" 
                          />
                        </div>
                        <div className="review-card-body">
                          <div>
                            <h3 className="review-card-heading">{headingText}</h3>
                            <p className="review-excerpt">
                              "{shortDescText}"
                            </p>
                          </div>
                          <div className="review-card-footer-link">
                            <span>Lire le témoignage complet</span>
                            <i className="fas fa-arrow-right"></i>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>

              {/* Luxury Pagination Bar */}
              {totalPages > 1 && (
                <div className="luxury-pagination" aria-label="Pagination des avis">
                  <button
                    type="button"
                    className="pagination-btn pagination-nav-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    title="Page précédente"
                  >
                    <i className="fas fa-chevron-left"></i>
                    <span>Précédent</span>
                  </button>

                  {getPageNumbers().map((page, index) => {
                    if (page === '...') {
                      return (
                        <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                          •••
                        </span>
                      );
                    }
                    return (
                      <button
                        key={`page-${page}`}
                        type="button"
                        className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                        title={`Aller à la page ${page}`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    className="pagination-btn pagination-nav-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    title="Page suivante"
                  >
                    <span>Suivant</span>
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* FULL TESTIMONIAL DETAIL MODAL (Displays Heading, Image, Short Description, and Full Long Description) */}
      {selectedReview && (
        <div className="modal-backdrop" onClick={() => setSelectedReview(null)}>
          <div 
            className="modal-dialog review-detail-modal" 
            onClick={(e) => e.stopPropagation()} 
            style={{ maxWidth: '720px', maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          >
            <div className="modal-header">
              <h3 className="modal-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem' }}>
                {selectedReview.heading || selectedReview.title || 'Témoignage Voyageur'}
              </h3>
              <button type="button" className="modal-close" onClick={() => setSelectedReview(null)} title="Fermer">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body" style={{ overflowY: 'auto', padding: '1.8rem 2rem' }}>
              {(selectedReview.image || selectedReview.img) && (
                <div style={{ width: '100%', height: '280px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
                  <img 
                    src={selectedReview.image || selectedReview.img} 
                    alt={selectedReview.heading || 'Voyage'} 
                    onError={(e) => { e.currentTarget.src = '/images/image-8.jpg'; }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}

              {(selectedReview.shortDescription || selectedReview.excerpt) && (
                <blockquote style={{ 
                  fontSize: '1.05rem', 
                  fontStyle: 'italic', 
                  color: 'var(--color-primary)', 
                  borderLeft: '4px solid var(--color-primary)', 
                  paddingLeft: '1rem', 
                  margin: '0 0 1.5rem 0',
                  lineHeight: '1.6',
                  background: 'rgba(12, 118, 138, 0.04)',
                  padding: '0.9rem 1.2rem',
                  borderRadius: '0 8px 8px 0'
                }}>
                  "{selectedReview.shortDescription || selectedReview.excerpt}"
                </blockquote>
              )}

              <div style={{ fontSize: '0.98rem', color: '#334155', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                {selectedReview.longDescription || selectedReview.comment || selectedReview.shortDescription || selectedReview.excerpt}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => setSelectedReview(null)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CTA INVITATION TO WRITE A REVIEW OR PLAN A TRIP */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="reviews-cta-card">
            <img 
              src="https://www.jodhpurvoyage.com/wp-content/uploads/2024/07/jaipur-travel.jpg" 
              onError={(e) => { e.currentTarget.src = "/images/jaipur-travel.jpg"; }}
              alt="Jodhpur Voyage Banner" 
              className="reviews-cta-bg" 
            />
            <div className="reviews-cta-content">
              <span className="reviews-cta-subtitle">Prêt pour votre propre aventure ?</span>
              <h2 className="reviews-cta-title">Inspiré par les témoignages de nos voyageurs ?</h2>
              <p className="reviews-cta-desc">
                Contactez notre agence réceptive locale francophone et créez un itinéraire sur mesure adapté à vos dates, votre rythme et votre budget.
              </p>
              <div className="cta-buttons">
                <Link to="/voyage-sur-mesure" className="btn btn-primary btn-lg">
                  <i className="fas fa-magic"></i> Devis Gratuit Sur Mesure
                </Link>
                <Link to="/contact" className="btn btn-outline-white btn-lg">
                  <i className="fas fa-envelope"></i> Nous Contacter
                </Link>
                <button 
                  type="button" 
                  className="btn btn-gold btn-lg" 
                  onClick={() => setIsReviewModalOpen(true)}
                >
                  <i className="fas fa-pen"></i> Laisser un Avis
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp */}
      <a href="https://wa.me/919650698669" target="_blank" rel="noopener noreferrer" className="floating-whatsapp" aria-label="Contactez-nous sur WhatsApp">
        <i className="fab fa-whatsapp"></i>
        <span className="whatsapp-tooltip">Contactez-nous sur WhatsApp</span>
      </a>

      {/* Modal for Submitting New Review */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewSubmitted={() => {
          loadReviewsData();
        }}
      />
    </div>
  );
};

export default Commentaires;
