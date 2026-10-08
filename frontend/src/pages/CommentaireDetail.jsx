import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchReviewBySlug, fetchReviews } from '../services/api';
import SEO from '../components/SEO';

const CommentaireDetail = () => {
  const { slug } = useParams();
  const [review, setReview] = useState(null);
  const [relatedReviews, setRelatedReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);

    fetchReviewBySlug(slug)
      .then((res) => {
        setReview(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Direct slug fetch error, attempting fallback list search:', err);
        // Fallback: fetch list and find by slug or ID
        fetchReviews()
          .then((listRes) => {
            const list = Array.isArray(listRes.data) ? listRes.data : (listRes.data?.reviews || []);
            const found = list.find(
              (r) =>
                r.slug === slug ||
                r._id === slug ||
                String(r.id) === slug ||
                (r.heading && r.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') === slug)
            );
            if (found) {
              setReview(found);
            } else {
              setError('Commentaire introuvable');
            }
            setLoading(false);
          })
          .catch((fallbackErr) => {
            console.error('Fallback fetch error:', fallbackErr);
            setError('Commentaire introuvable');
            setLoading(false);
          });
      });

    // Also fetch other reviews for recommendations
    fetchReviews({ limit: 4 })
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : (res.data?.reviews || []);
        setRelatedReviews(list);
      })
      .catch(() => {});
  }, [slug]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '140px 20px', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '3rem', color: 'var(--color-primary)', marginBottom: '20px' }}></i>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.15rem', fontWeight: 500 }}>Chargement du témoignage...</p>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '120px 20px', minHeight: '60vh' }}>
        <i className="fas fa-comment-slash" style={{ fontSize: '3.5rem', color: '#94A3B8', marginBottom: '20px' }}></i>
        <h2 style={{ fontSize: '2rem', color: 'var(--color-dark)', marginBottom: '12px' }}>Avis non trouvé</h2>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '500px', margin: '0 auto 24px auto' }}>
          Le témoignage que vous recherchez n'est pas disponible ou a été déplacé.
        </p>
        <Link to="/commentaires" className="btn btn-primary">
          <i className="fas fa-arrow-left"></i> Voir tous les commentaires
        </Link>
      </div>
    );
  }

  const headingText = review.heading || review.title || review.tourTitle || 'Commentaire Voyageur';
  const imgUrl = review.image || review.img || '/images/image-8.jpg';
  const fullContent = review.longDescription || review.comment || review.shortDescription || '';
  const excerptText = review.shortDescription || review.excerpt || '';
  const author = review.authorName || 'Voyageur Francophone';

  // Format content paragraphs
  const paragraphs = fullContent
    .split(/\n\s*\n|\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const filteredRelated = relatedReviews.filter((r) => String(r._id || r.id) !== String(review._id || review.id)).slice(0, 3);

  return (
    <div className="commentaire-detail-page">
      <SEO
        title={`${headingText} - Avis Voyageurs | Jodhpur Voyage`}
        description={excerptText || fullContent.substring(0, 160) || `Découvrez le témoignage de voyage : ${headingText}`}
        ogImage={imgUrl}
      />

      {/* HERO SECTION */}
      <section className="commentaire-detail-hero">
        <img
          src={imgUrl}
          alt={headingText}
          className="commentaire-detail-hero-bg"
          onError={(e) => { e.currentTarget.src = '/images/image-8.jpg'; }}
        />
        <div className="commentaire-detail-hero-overlay"></div>
        <div className="container commentaire-detail-hero-content">
          <div className="breadcrumb-nav" style={{ marginBottom: '14px', fontSize: '0.85rem' }}>
            <Link to="/" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Accueil</Link>
            <span style={{ margin: '0 8px', color: 'rgba(255,255,255,0.6)' }}>/</span>
            <Link to="/commentaires" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Commentaires</Link>
            <span style={{ margin: '0 8px', color: 'rgba(255,255,255,0.6)' }}>/</span>
            <span style={{ color: 'var(--color-gold)', fontWeight: 600 }}>Témoignage</span>
          </div>

          <span className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <i className="fas fa-quote-left"></i> Avis Voyageur Vérifié
          </span>
          <h1 className="commentaire-detail-title">{headingText}</h1>
          <div className="commentaire-detail-meta">
            <span><i className="fas fa-user-check"></i> {author}</span>
            <span><i className="fas fa-star" style={{ color: 'var(--color-gold)' }}></i> 5/5 Expérience Recommandée</span>
            <span><i className="fas fa-shield-alt"></i> Agence Francophone Directe</span>
          </div>
        </div>
      </section>

      {/* MAIN TWO-COLUMN CONTENT */}
      <section className="commentaire-detail-body-section section-padding bg-cream">
        <div className="container">
          <div className="commentaire-layout-grid">
            
            {/* LEFT / MAIN POST CONTENT */}
            <main className="commentaire-main-content">
              {/* Top Quick Actions Bar */}
              <div className="commentaire-action-bar">
                <Link to="/voyage-sur-mesure" className="btn btn-primary btn-sm">
                  <i className="fas fa-envelope-open-text"></i> Demande de devis gratuit
                </Link>
                <Link to="/commentaires" className="btn btn-outline-dark btn-sm">
                  <i className="fas fa-arrow-left"></i> Retour aux avis
                </Link>
              </div>

              {/* Main Content Article */}
              <article className="commentaire-article-card">
                <div className="commentaire-article-header">
                  <div className="quote-mark">
                    <i className="fas fa-quote-left"></i>
                  </div>
                  <div>
                    <h2 className="commentaire-article-heading">{headingText}</h2>
                    <p className="commentaire-author-sub">Récit d'expérience de nos voyageurs</p>
                  </div>
                </div>

                <div className="commentaire-article-text">
                  {paragraphs.length > 0 ? (
                    paragraphs.map((p, idx) => (
                      <p key={idx} className="commentaire-paragraph">
                        {p}
                      </p>
                    ))
                  ) : (
                    <p className="commentaire-paragraph">
                      {fullContent || 'Magnifique voyage organisé par l\'agence Jodhpur Voyage en Inde.'}
                    </p>
                  )}
                </div>

                {/* Article Footer Verification */}
                <div className="commentaire-article-footer">
                  <div className="verified-badge">
                    <i className="fas fa-check-circle"></i>
                    <span>Témoignage authentique recueilli auprès de nos clients francophones.</span>
                  </div>
                </div>
              </article>

              {/* Bottom In-Content CTA Card */}
              <div className="commentaire-cta-card">
                <div className="commentaire-cta-inner">
                  <h3>Envie d'un voyage similaire en Inde ?</h3>
                  <p>
                    Parlez-nous de vos envies, de vos dates et du rythme de voyage souhaité. Notre équipe locale basée à Jodhpur élabore votre circuit personnalisé sans engagement.
                  </p>
                  <div className="commentaire-cta-btns">
                    <Link to="/voyage-sur-mesure" className="btn btn-primary">
                      <i className="fas fa-route"></i> Concevoir mon voyage sur mesure
                    </Link>
                    <Link to="/contact" className="btn btn-secondary">
                      <i className="fas fa-comments"></i> Contactez nos experts
                    </Link>
                  </div>
                </div>
              </div>
            </main>

            {/* RIGHT SIDEBAR */}
            <aside className="commentaire-sidebar">
              {/* Featured Image Card */}
              <div className="sidebar-widget sidebar-photo-card">
                <div className="sidebar-photo-wrap">
                  <img
                    src={imgUrl}
                    alt={headingText}
                    className="sidebar-photo-img"
                    onError={(e) => { e.currentTarget.src = '/images/image-8.jpg'; }}
                  />
                  <span className="sidebar-photo-badge">
                    <i className="fas fa-camera"></i> Photo du Voyage
                  </span>
                </div>
                <div className="sidebar-photo-info">
                  <h4>{headingText}</h4>
                  <p>Circuit privé avec véhicule climatisé, chauffeur attitré et hôtels sélectionnés.</p>
                </div>
              </div>

              {/* Trust & Guarantee Widget */}
              <div className="sidebar-widget sidebar-trust-widget">
                <h4 className="widget-title">
                  <i className="fas fa-award"></i> Pourquoi Jodhpur Voyage ?
                </h4>
                <ul className="trust-points-list">
                  <li>
                    <i className="fas fa-check"></i>
                    <div>
                      <strong>Agence locale directe</strong>
                      <span>Aucun intermédiaire, prix au plus juste et réactivité maximale.</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-check"></i>
                    <div>
                      <strong>Équipe 100% francophone</strong>
                      <span>Conseils et suivi en français avant et pendant tout le voyage.</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-check"></i>
                    <div>
                      <strong>Chauffeurs professionnels</strong>
                      <span>Véhicules confortables, sécurité assurée et ponctualité rigoureuse.</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-check"></i>
                    <div>
                      <strong>Assistance 24h/24 & 7j/7</strong>
                      <span>Notre équipe sur place reste joignable en permanence.</span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Direct Enquiry Box */}
              <div className="sidebar-widget sidebar-enquiry-widget">
                <h4>Un projet de voyage ?</h4>
                <p>Recevez un itinéraire détaillé et un devis personnalisé sous 24 à 48 heures.</p>
                <Link to="/voyage-sur-mesure" className="btn btn-primary btn-block" style={{ width: '100%', textAlign: 'center' }}>
                  Demander un devis
                </Link>
                <a href="tel:+919650698869" className="sidebar-phone-link">
                  <i className="fas fa-phone-alt"></i> +91 96 50 69 88 69
                </a>
              </div>
            </aside>

          </div>
        </div>
      </section>

      {/* RELATED TESTIMONIALS SECTION */}
      {filteredRelated.length > 0 && (
        <section className="section-padding bg-white" style={{ borderTop: '1px solid #E2E8F0' }}>
          <div className="container">
            <div className="section-header text-center" style={{ marginBottom: '2.5rem' }}>
              <span className="section-subtitle">Retours d'Expérience</span>
              <h2 className="section-title">Autres Témoignages de Voyageurs</h2>
            </div>

            <div className="reviews-grid-related" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {filteredRelated.map((rel) => {
                const relSlug = rel.slug || rel._id || rel.id;
                const relImg = rel.image || rel.img || '/images/image-8.jpg';
                const relHeading = rel.heading || rel.title || rel.tourTitle || 'Commentaire';
                const relExcerpt = rel.shortDescription || rel.excerpt || '';

                return (
                  <Link
                    key={rel._id || rel.id}
                    to={`/commentaire/${relSlug}`}
                    className="review-card"
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="review-card-img-wrap">
                      <img
                        src={relImg}
                        alt={relHeading}
                        className="review-card-img"
                        onError={(e) => { e.currentTarget.src = '/images/image-8.jpg'; }}
                      />
                    </div>
                    <div className="review-card-body">
                      <div>
                        <h3 className="review-card-heading">{relHeading}</h3>
                        <p className="review-excerpt">"{relExcerpt}"</p>
                      </div>
                      <div className="review-card-footer-link">
                        <span>Lire le témoignage complet</span>
                        <i className="fas fa-arrow-right"></i>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link to="/commentaires" className="btn btn-secondary">
                <i className="fas fa-comments"></i> Découvrir tous les avis voyageurs
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default CommentaireDetail;
