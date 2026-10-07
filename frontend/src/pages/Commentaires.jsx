import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchReviews } from '../services/api';
import ReviewModal from '../components/ReviewModal';
import SEO from '../components/SEO';

const Commentaires = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const loadReviewsData = () => {
    setLoading(true);
    fetchReviews({ category: 'all' })
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

  // Reset to page 1 whenever category or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Compute category counts for filter buttons
  const counts = {
    all: reviews.length,
    rajasthan: reviews.filter((r) => r.category === 'rajasthan').length,
    'inde-du-nord': reviews.filter((r) => r.category === 'inde-du-nord').length,
    ladakh: reviews.filter((r) => r.category === 'ladakh').length,
    'inde-du-sud': reviews.filter((r) => r.category === 'inde-du-sud').length,
    gujarat: reviews.filter((r) => r.category === 'gujarat' || r.category === 'nepal').length
  };

  // Compute average rating score dynamically
  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
    : '4.9';

  // Filter reviews by selected category and search input
  const filteredReviews = reviews.filter((item) => {
    const itemCat = (item.category || '').toLowerCase();
    const matchesCat = selectedCategory === 'all' 
      || itemCat === selectedCategory
      || (selectedCategory === 'gujarat' && (itemCat === 'gujarat' || itemCat === 'nepal'));

    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCat;

    const titleText = item.title || item.tourTitle || '';
    const bodyText = item.comment || item.excerpt || '';
    const author = item.authorName || '';
    const tagText = item.tag || '';
    const cityText = item.authorCity || '';

    const combinedText = `${titleText} ${bodyText} ${author} ${tagText} ${cityText} ${itemCat}`.toLowerCase();
    return matchesCat && combinedText.includes(q);
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
          <span className="hero-badge"><i className="fas fa-star"></i> Retours d'Expérience</span>
          <h1 className="reviews-hero-title">Vos Avis &amp; Commentaires</h1>
          <p className="reviews-hero-desc">
            La confiance et la satisfaction de nos voyageurs francophones sont notre plus grande fierté.
          </p>
        </div>
      </section>

      {/* RATING SUMMARY SCORECARD & TRUST BADGES */}
      <section className="section-padding bg-white pb-0">
        <div className="container">
          <div className="scorecard-wrapper">
            {/* Rating Score */}
            <div className="score-col">
              <span className="score-badge-label">Score de Satisfaction</span>
              <div className="score-number">{avgRating}<span>/5</span></div>
              <div className="score-stars">
                {[...Array(5)].map((_, i) => (
                  <i 
                    key={i} 
                    className={`fas ${i < Math.floor(Number(avgRating)) ? 'fa-star' : (i < Number(avgRating) ? 'fa-star-half-alt' : 'fa-star')}`}
                  ></i>
                ))}
              </div>
              <p className="score-text">
                Basé sur <strong>+{reviews.length > 0 ? `${reviews.length}` : '500'} témoignages</strong> de voyageurs francophones
              </p>
            </div>

            {/* Satisfaction Metrics */}
            <div className="metrics-col">
              <div className="metric-card">
                <div className="metric-value">99%</div>
                <div className="metric-label">Organisation &amp; Rigueur</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">98%</div>
                <div className="metric-label">Chauffeurs &amp; Ponctualité</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">97%</div>
                <div className="metric-label">Hôtels &amp; Charme Haveli</div>
              </div>
            </div>

            {/* External Verification Badges */}
            <div className="badges-col">
              <span className="badge-verify-text">Avis vérifiés indépendants</span>
              <a 
                href="https://www.tripadvisor.in/Attraction_Review-g297668-d26864310-Reviews-Jodhpur_Voyage_Pvt_Ltd-Jodhpur_Jodhpur_District_Rajasthan.html" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="badge-img-link"
              >
                <img src="/images/tripad-icon.png" alt="TripAdvisor Jodhpur Voyage" className="badge-img-tripad" />
              </a>
              <a 
                href="https://www.trustpilot.com/review/jodhpurvoyage.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="badge-img-link"
              >
                <img src="/images/trustpilot-icon.png" alt="Trustpilot Jodhpur Voyage" className="badge-img-trust" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH & FILTER BAR */}
      <section className="reviews-filter-section bg-white">
        <div className="container">
          <div className="reviews-filter-bar">
            {/* Category Filter Chips */}
            <div className="reviews-filter-chips" id="review-category-filters">
              <button 
                className={`review-filter-chip ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                Tous les avis ({counts.all > 0 ? counts.all : '...'})
              </button>
              <button 
                className={`review-filter-chip ${selectedCategory === 'rajasthan' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('rajasthan')}
              >
                Rajasthan {counts.rajasthan > 0 && `(${counts.rajasthan})`}
              </button>
              <button 
                className={`review-filter-chip ${selectedCategory === 'inde-du-nord' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('inde-du-nord')}
              >
                Inde du Nord {counts['inde-du-nord'] > 0 && `(${counts['inde-du-nord']})`}
              </button>
              <button 
                className={`review-filter-chip ${selectedCategory === 'ladakh' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('ladakh')}
              >
                Ladakh &amp; Himalaya {counts.ladakh > 0 && `(${counts.ladakh})`}
              </button>
              <button 
                className={`review-filter-chip ${selectedCategory === 'inde-du-sud' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('inde-du-sud')}
              >
                Inde du Sud &amp; Kerala {counts['inde-du-sud'] > 0 && `(${counts['inde-du-sud']})`}
              </button>
              <button 
                className={`review-filter-chip ${selectedCategory === 'gujarat' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('gujarat')}
              >
                Gujarat &amp; Népal {counts.gujarat > 0 && `(${counts.gujarat})`}
              </button>
            </div>

            {/* Search Input */}
            <div className="reviews-search-box">
              <i className="fas fa-search reviews-search-icon"></i>
              <input 
                type="text" 
                id="review-search-input" 
                placeholder="Rechercher un avis (ex: Chauffeur, Singh, Jaisalmer...)" 
                className="reviews-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
              <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '16px' }}></i>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Chargement des avis voyageurs...</p>
            </div>
          ) : (
            <>
              {/* Header Summary */}
              {filteredReviews.length > 0 && (
                <div className="reviews-count-header">
                  <div className="reviews-count-text">
                    Affichage de <strong>{startIndex + 1} à {endIndex}</strong> sur <strong>{filteredReviews.length}</strong> avis voyageurs vérifiés
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
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--secondary-color)', marginBottom: '8px' }}>Aucun avis ne correspond à votre recherche</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Essayez un autre mot-clé ou réinitialisez les filtres.</p>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                      style={{ marginTop: '16px' }}
                    >
                      Voir tous les avis
                    </button>
                  </div>
                ) : (
                  currentReviews.map((rev) => {
                    const revId = rev._id || rev.id;
                    const cardImg = rev.image || rev.img || '/images/image-8.jpg';
                    const fallbackImg = rev.fallbackImg || '/images/image-8.jpg';
                    const tagIcon = rev.tagIcon || 'fas fa-map-marker-alt';
                    const tagLabel = rev.tag || `${rev.tourTitle || 'Voyage'} • ${rev.authorCity || 'Avis Client'}`;
                    const targetLink = rev.link || (rev.category === 'rajasthan' ? '/tour-rajasthan' : '/tours');
                    const reviewTitle = rev.title || rev.tourTitle || 'Expérience Exceptionnelle';
                    const commentText = rev.excerpt || (rev.comment ? (rev.comment.startsWith('"') ? rev.comment : `"${rev.comment}"`) : '');
                    const avatarInitials = rev.authorAvatar || (rev.authorName ? rev.authorName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'JV');
                    const authorDisplayName = rev.authorName || 'Voyageur Francophone';
                    const dateDisplay = rev.reviewDate || `Avis Vérifié • ${rev.travelDate || 'Voyage Récent'}`;

                    return (
                      <Link 
                        key={revId} 
                        to={targetLink} 
                        className="review-card" 
                        data-category={rev.category}
                      >
                        <div className="review-card-img-wrap">
                          <img 
                            src={cardImg} 
                            onError={(e) => { e.currentTarget.src = fallbackImg; }}
                            alt={reviewTitle} 
                            className="review-card-img" 
                          />
                          <span className="review-tag-badge">
                            <i className={tagIcon}></i> {tagLabel}
                          </span>
                        </div>
                        <div className="review-card-body">
                          <div>
                            <div className="review-card-header">
                              <h3 className="review-card-heading">{reviewTitle}</h3>
                              <div className="review-stars">
                                {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                                  <i key={i} className="fas fa-star"></i>
                                ))}
                              </div>
                            </div>
                            <p className="review-excerpt">
                              {commentText}
                            </p>
                          </div>
                          <div className="review-author-info">
                            <div className="author-avatar">{avatarInitials}</div>
                            <div>
                              <span className="author-name">{authorDisplayName}</span>
                              <span className="review-date"><i className="fas fa-check-circle"></i> {dateDisplay}</span>
                            </div>
                          </div>
                          <div className="review-card-footer-link">
                            <span>Voir le circuit &amp; les détails</span>
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
