import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { fetchPageContent, fetchTours } from '../services/api';

const DynamicPage = ({ defaultPageKey }) => {
  const { slug } = useParams();
  const location = useLocation();

  // Determine current page key from prop, slug param, or pathname
  const pathClean = location.pathname.replace(/^\/+|\/+$/g, '').replace(/\.html$/, '');
  const pageKey = defaultPageKey || slug || pathClean || 'qui-sommes-nous';

  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cultureSafariTours, setCultureSafariTours] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);

    fetchPageContent(pageKey)
      .then((res) => {
        if (res.data) {
          setPageData(res.data);
        }
      })
      .catch((err) => {
        console.error(`Error loading dynamic page ${pageKey}:`, err);
      })
      .finally(() => {
        setLoading(false);
      });

    // If on Culture & Safari page, load all tours tagged for Culture & Safari
    if (pageKey === 'culture-et-safari') {
      fetchTours({ cultureSafari: true })
        .then((res) => {
          const list = Array.isArray(res.data) ? res.data : [];
          setCultureSafariTours(list);
        })
        .catch((err) => console.error('Error fetching Culture & Safari tours:', err));
    }
  }, [pageKey]);

  if (loading && !pageData) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '2.5rem', color: 'var(--primary-color, #C58B39)' }}></i>
          <p style={{ marginTop: '16px', color: '#64748B' }}>Chargement de la page...</p>
        </div>
      </div>
    );
  }

  const hero = pageData?.hero || {};
  const identity = pageData?.identity || {};
  const founder = pageData?.founder;
  const pillars = pageData?.pillars || {};
  const members = pageData?.members;
  const intro = pageData?.intro;
  const cta = pageData?.cta || {};

  return (
    <>
      <SEO pageKey={pageKey} />

      {/* =========================================================================
          HERO BANNER
          ========================================================================= */}
      <section className="about-hero-section" id="hero">
        <img
          src={hero.bgImage || '/images/image-12.jpg'}
          alt={hero.title || pageData?.title || 'Page Banner'}
          className="about-hero-bg"
          onError={(e) => { e.target.src = '/images/image-12.jpg'; }}
        />
        <div className="container about-hero-content">
          {hero.badge && (
            <span className="hero-badge">
              <i className={hero.badgeIcon || 'fas fa-compass'}></i> {hero.badge}
            </span>
          )}
          <h1 className="about-hero-title">{hero.title || pageData?.title}</h1>
          {hero.description && (
            <p className="about-hero-desc">
              {hero.description}
            </p>
          )}
        </div>
      </section>

      {/* =========================================================================
          MAIN IDENTITY / PRESENTATION SECTION
          ========================================================================= */}
      {(identity.title || identity.paragraph1 || identity.image) && (
        <section className="section-padding bg-white" id="presentation">
          <div className="container">
            <div className="about-grid" id="identity">
              <div>
                {identity.subtitle && <span className="section-subtitle">{identity.subtitle}</span>}
                {identity.title && <h2 className="section-title about-title">{identity.title}</h2>}
                <div className="about-text">
                  {identity.paragraph1 && <p className="contact-lead-desc">{identity.paragraph1}</p>}
                  {identity.paragraph2 && <p className="contact-lead-desc">{identity.paragraph2}</p>}
                  {identity.paragraph3 && <p>{identity.paragraph3}</p>}
                </div>
              </div>

              {identity.image && (
                <div className="about-image-wrapper">
                  <img
                    src={identity.image}
                    alt={identity.title || 'Illustration'}
                    className="about-image"
                    onError={(e) => { e.target.src = '/images/image-9.jpg'; }}
                  />
                </div>
              )}
            </div>

            {/* =========================================================================
                FOUNDER / HIGHLIGHT NOTE SECTION (IF PRESENT)
                ========================================================================= */}
            {founder && (founder.quote || founder.name) && (
              <div className="founder-card" id="founder-note" style={{ marginTop: '50px' }}>
                <div className="founder-grid">
                  <div className="founder-img-col">
                    <img
                      src={founder.photo || '/images/mr-singh.jpg'}
                      alt={founder.name || 'Mr Singh'}
                      className="founder-img"
                      onError={(e) => { e.target.src = '/images/mr-singh.jpg'; }}
                    />
                    <h3 className="founder-name">{founder.name || 'Mr Singh'}</h3>
                    <span className="founder-role">{founder.role || 'Fondateur'}</span>
                  </div>

                  <div>
                    {founder.subtitle && (
                      <span className="section-subtitle">
                        <i className="fas fa-quote-left"></i> {founder.subtitle}
                      </span>
                    )}
                    {founder.title && <h2 className="section-title about-title">{founder.title}</h2>}

                    {founder.quote && (
                      <blockquote className="founder-quote">
                        {founder.quote}
                      </blockquote>
                    )}

                    {founder.description1 && (
                      <p className="founder-desc">
                        {founder.description1}
                      </p>
                    )}

                    {founder.description2 && (
                      <p className="founder-desc">
                        {founder.description2}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                PILLARS & COMMITMENT CARDS GRID
                ========================================================================= */}
            {pillars.items && pillars.items.length > 0 && (
              <div id="pillars" style={{ marginTop: '60px' }}>
                <div className="section-header">
                  {pillars.subtitle && <span className="section-subtitle">{pillars.subtitle}</span>}
                  {pillars.title && <h2 className="section-title">{pillars.title}</h2>}
                  {pillars.description && <p className="section-description">{pillars.description}</p>}
                </div>

                <div className="pillars-grid">
                  {pillars.items.map((pillar, idx) => (
                    <div key={idx} className="pillar-card">
                      <div className="pillar-icon-circle">
                        <i className={pillar.icon || 'fas fa-check'}></i>
                      </div>
                      <h3 className="pillar-title">{pillar.title}</h3>
                      <p className="pillar-desc">{pillar.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* =========================================================================
                TEAM MEMBERS SECTION (IF PRESENT)
                ========================================================================= */}
            {members && members.length > 0 && (
              <div id="team" style={{ marginTop: '60px' }}>
                {intro && (
                  <div className="section-header">
                    {intro.subtitle && <span className="section-subtitle">{intro.subtitle}</span>}
                    {intro.title && <h2 className="section-title">{intro.title}</h2>}
                    {intro.description && <p className="section-description">{intro.description}</p>}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                  {members.map((member, idx) => (
                    <div key={idx} style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                      <img src={member.image || '/images/image-12.jpg'} alt={member.name} style={{ width: '100%', height: '220px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/images/image-12.jpg'; }} />
                      <div style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '1.3rem', color: 'var(--secondary-color)', marginBottom: '6px' }}>{member.name}</h3>
                        <div style={{ color: 'var(--primary-color)', fontWeight: '600', fontSize: '0.88rem', marginBottom: '12px' }}>{member.role}</div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{member.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* =========================================================================
          CULTURE & SAFARI TOURS GRID
          ========================================================================= */}
      {pageKey === 'culture-et-safari' && cultureSafariTours.length > 0 && (
        <section className="section-padding bg-cream" id="circuits-safari">
          <div className="container">
            <div className="section-header text-center">
              <span className="section-subtitle">Circuits Sélectionnés</span>
              <h2 className="section-title">Nos Voyages Culture & Safari</h2>
              <p className="section-description">
                Découvrez nos itinéraires combinant les merveilles culturelles et l’observation de la faune sauvage en véhicule privatif.
              </p>
            </div>

            <div className="tours-grid">
              {cultureSafariTours.map((tour, idx) => (
                <div key={tour._id || tour.slug || idx} className="tour-card">
                  <Link to={`/${tour.slug}`} className="tour-card-image-wrap" title="Voir l'itinéraire du voyage">
                    <img src={tour.image || tour.coverImage || '/images/image-6.jpg'} alt={tour.title} onError={(e) => { e.target.src = '/images/image-6.jpg'; }} />
                    <span className="tour-card-badge">{tour.badge || 'Culture & Safari'}</span>
                    {tour.duration && (
                      <div className="tour-card-duration">
                        <i className="far fa-clock"></i> {tour.duration}
                      </div>
                    )}
                  </Link>
                  <div className="tour-card-body">
                    <div className="tour-card-location">
                      <i className="fas fa-map-marker-alt"></i> {tour.location || tour.category || 'Inde'}
                    </div>
                    <h3 className="tour-card-title">
                      <Link to={`/${tour.slug}`}>{tour.title}</Link>
                    </h3>
                    <p className="tour-card-excerpt">
                      {tour.subtitle || tour.excerpt || (tour.overview ? tour.overview.slice(0, 110) + '...' : '')}
                    </p>
                    <div className="tour-card-footer mt-auto">
                      <Link to={`/${tour.slug}`} className="btn btn-sm btn-outline">
                        Voir l'itinéraire
                      </Link>
                      <Link to={`/voyage-sur-mesure?tour=${encodeURIComponent(tour.title)}`} className="btn btn-sm btn-primary">
                        <i className="fas fa-paper-plane"></i> Devis Gratuit
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          CTA BANNER SECTION
          ========================================================================= */}
      {cta.title && (
        <section className="cta-banner-section" id="cta">
          <img
            src={cta.bgImage || '/images/image-8.jpg'}
            alt="CTA Background"
            className="cta-bg-image"
            onError={(e) => { e.target.src = '/images/image-8.jpg'; }}
          />
          <div className="container cta-content">
            <h2 className="cta-title">{cta.title}</h2>
            <Link to={cta.buttonLink || '/voyage-sur-mesure'} className="btn btn-primary btn-lg">
              {cta.buttonText || 'Demander un Devis'}
            </Link>
          </div>
        </section>
      )}

      {/* WhatsApp Quick Action */}
      <a
        href="https://wa.me/919650698669"
        target="_blank"
        rel="noreferrer"
        className="floating-whatsapp"
        aria-label="Contactez-nous sur WhatsApp"
      >
        <i className="fab fa-whatsapp"></i>
        <span className="whatsapp-tooltip">Contactez-nous sur WhatsApp</span>
      </a>
    </>
  );
};

export default DynamicPage;
