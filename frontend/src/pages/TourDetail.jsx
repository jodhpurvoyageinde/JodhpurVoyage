import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchTourBySlug } from '../services/api';
import BookingModal from '../components/BookingModal';
import SEO from '../components/SEO';
import TourImageSlider from '../components/TourImageSlider';

const cleanHtml = (rawStr) => {
  if (!rawStr || typeof rawStr !== 'string') return '';
  return rawStr
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/\[\/?vc_[^\]]*\]/gi, '')
    .replace(/\[\/?et_pb_[^\]]*\]/gi, '')
    .replace(/style="[^"]*"/gi, '')
    .replace(/style='[^']*'/gi, '')
    .replace(/<p>\s*(&nbsp;|\s)*\s*<\/p>/gi, '')
    .replace(/<div>\s*(&nbsp;|\s)*\s*<\/div>/gi, '')
    .replace(/<span>\s*(&nbsp;|\s)*\s*<\/span>/gi, '')
    .replace(/(<br\s*\/?>\s*){2,}/gi, '<br />')
    .trim();
};

const getCleanText = (str) => {
  if (!str || typeof str !== 'string') return '';
  return cleanHtml(str).replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();
};

const TourDetail = ({ overrideSlug, initialTour }) => {
  const { slug: paramSlug } = useParams();
  const slug = overrideSlug || paramSlug;
  const [tour, setTour] = useState(initialTour || null);
  const [loading, setLoading] = useState(!initialTour);
  const [openDay, setOpenDay] = useState(1);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!initialTour || (tour && tour.slug !== slug && tour.customUrl !== slug)) {
      setLoading(true);
      fetchTourBySlug(slug)
        .then((res) => {
          setTour(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else if (initialTour && !tour) {
      setTour(initialTour);
      setLoading(false);
    }
  }, [slug, initialTour]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 20px' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: 'var(--primary-color)' }}></i>
        <p style={{ marginTop: '16px' }}>Chargement de l'itinéraire...</p>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2>Circuit introuvable</h2>
        <p>Le circuit demandé n'existe pas ou a été déplacé.</p>
        <Link to="/tours" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Consulter tous nos circuits
        </Link>
      </div>
    );
  }

  const rawOverviewText = getCleanText(tour.overview);
  const rawSubtitleText = getCleanText(tour.subtitle);
  const rawExcerptText = getCleanText(tour.excerpt);

  let overviewTextToUse = '';
  if (rawOverviewText && rawOverviewText.length > 25) {
    overviewTextToUse = tour.overview;
  } else if (rawSubtitleText && rawSubtitleText.length > 25 && !rawSubtitleText.toLowerCase().includes('read')) {
    overviewTextToUse = `<p>Embarquez pour une expérience de voyage exceptionnelle avec cet itinéraire privatif à <strong>${tour.location || tour.title}</strong>. Ce circuit a été conçu sur mesure pour vous offrir une immersion complète entre monuments mythiques, traditions séculaires et paysages grandioses.</p>`;
  } else if (rawExcerptText && rawExcerptText.length > 25 && !rawExcerptText.toLowerCase().includes('read')) {
    overviewTextToUse = `<p>${tour.excerpt}</p><p>Voyagez en toute sérénité grâce à un véhicule privé climatisé avec chauffeur dédié, des hébergements de charme rigoureusement sélectionnés et une assistance francophone disponible 24h/24.</p>`;
  } else {
    overviewTextToUse = `<p>Embarquez pour une expérience de voyage exceptionnelle avec notre itinéraire <strong>${tour.title}</strong>. Ce circuit privatif de <strong>${tour.duration || 'plusieurs jours'}</strong> à travers <strong>${tour.location || 'l\'Inde'}</strong> a été conçu sur mesure pour vous offrir une immersion totale entre monuments incontournables, patrimoine séculaire et rencontres authentiques.</p><p>Voyagez en toute sérénité grâce à un véhicule privé climatisé avec chauffeur dédié, des hébergements de charme rigoureusement sélectionnés et une assistance locale francophone disponible 24h/24 tout au long de votre séjour.</p>`;
  }

  const cleanedOverviewHtml = cleanHtml(overviewTextToUse);

  const validHighlights = Array.isArray(tour.highlights) && tour.highlights.length > 0 && tour.highlights.some(h => typeof h === 'string' && getCleanText(h).length > 2)
    ? tour.highlights.filter(h => typeof h === 'string' && getCleanText(h).length > 1)
    : [
        `Circuit 100% privatif et personnalisable à ${tour.location || 'destination'}`,
        'Chauffeur privé expérimenté & véhicule climatisé tout confort',
        'Hébergements de charme & havelis de patrimoine avec petits-déjeuners',
        'Assistance locale francophone disponible 24h/24 et 7j/7'
      ];

  return (
    <div>
      <SEO
        pageKey="tour-detail"
        title={tour.seoTitle || `${tour.title} — Circuit ${tour.duration || ''} | Jodhpur Voyage`}
        description={tour.seoDescription || tour.subtitle || `Circuit ${tour.title} avec chauffeur privé.`}
        keywords={tour.seoKeywords || `${tour.title.toLowerCase()}, circuit ${tour.location?.toLowerCase() || 'inde'}, voyage sur mesure`}
        ogTitle={tour.seoTitle || tour.title}
        ogDescription={tour.seoDescription || tour.subtitle}
        ogImage={tour.image}
        structuredData={JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'TouristTrip',
          'name': tour.seoTitle || tour.title,
          'description': tour.seoDescription || tour.subtitle || tour.description,
          'touristType': 'Private Tour',
          'offers': {
            '@type': 'Offer',
            'priceCurrency': 'EUR',
            'availability': 'https://schema.org/InStock'
          }
        })}
      />
      {/* Tour Hero */}
      <section style={{ position: 'relative', background: 'transparent', padding: '70px 0', color: '#fff', overflow: 'hidden' }}>
        <img
          src={tour.image || '/images/dest-rajasthan.jpg'}
          alt={tour.title}
          onError={(e) => { e.currentTarget.src = "/images/dest-rajasthan.jpg"; }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 1 }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '900px', textShadow: '0 2px 10px rgba(0,0,0,0.85), 0 4px 20px rgba(0,0,0,0.95)' }}>
          <h1 style={{ fontSize: 'clamp(1.4rem, 2.6vw, 2.1rem)', color: '#fff', marginBottom: '12px', lineHeight: '1.25', fontWeight: '800' }}>{tour.title}</h1>
          {tour.location && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ color: '#ffffff', fontSize: '0.92rem', fontWeight: '600' }}>
                <i className="fas fa-map-marker-alt" style={{ marginRight: '6px', color: 'var(--gold-color, #ffb800)' }}></i> {tour.location}
              </span>
            </div>
          )}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: tour.location ? '0' : '20px' }}>
            <button className="btn btn-gold btn-lg" onClick={() => setIsBookingOpen(true)}>
              <i className="fas fa-paper-plane"></i> Demander un Devis Gratuit
            </button>
            <Link to="/voyage-sur-mesure" className="btn btn-outline-white btn-lg">
              <i className="fas fa-magic"></i> Personnaliser cet itinéraire
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid var(--border-color)', padding: '16px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '20px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>DURÉE</div>
            <div style={{ fontWeight: '700', color: 'var(--secondary-color)' }}><i className="far fa-clock"></i> {tour.duration}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TARIF</div>
            <div style={{ fontWeight: '700', color: 'var(--primary-color)' }}>Sur Devis Personnalisé</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TYPE DE VOYAGE</div>
            <div style={{ fontWeight: '700', color: 'var(--secondary-color)' }}>Privé avec chauffeur</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>AVIS VOYAGEURS</div>
            <div style={{ fontWeight: '700', color: '#ffb800' }}>⭐ {tour.rating || 4.9} / 5 ({tour.reviewCount || 35} avis)</div>
          </div>
        </div>
      </div>

      {/* Main Content & Sidebar */}
      <div className="section-padding bg-cream">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)', gap: '40px', alignItems: 'start' }}>
          {/* Main Column */}
          <div>
            {/* Tour Image Slider */}
            <TourImageSlider tour={tour} />

            {/* Overview */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '30px', marginBottom: '30px', boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '16px', color: 'var(--secondary-color)' }}>Aperçu du Circuit</h2>
              
              {tour.subtitle && (
                <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-main)', marginBottom: '16px', fontWeight: '500' }}>
                  {tour.subtitle}
                </p>
              )}

              {cleanedOverviewHtml && (
                cleanedOverviewHtml.includes('<') ? (
                  <div
                    className="tour-overview-content"
                    style={{ lineHeight: '1.8', color: 'var(--text-main)' }}
                    dangerouslySetInnerHTML={{ __html: cleanedOverviewHtml }}
                  />
                ) : (
                  <p style={{ lineHeight: '1.8', color: 'var(--text-main)', whiteSpace: 'pre-line' }}>
                    {cleanedOverviewHtml}
                  </p>
                )
              )}

              {validHighlights && validHighlights.length > 0 && (
                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #F1F5F9' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '14px', color: 'var(--primary-color)' }}>
                    <i className="fas fa-star" style={{ color: 'var(--gold-color)' }}></i> Les Points Forts du Voyage
                  </h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {validHighlights.map((highlight, idx) => (
                      <li key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <i className="fas fa-check-circle" style={{ color: 'var(--accent-color)', marginTop: '4px' }}></i>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Connected Cities Tags */}
              {Array.isArray(tour.cities) && tour.cities.length > 0 && (
                <div style={{ marginTop: '24px', padding: '16px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--secondary-color)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-route" style={{ color: 'var(--primary-color)' }}></i> Villes & Étapes de ce Circuit :
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {tour.cities.map((city, idx) => (
                      <Link
                        key={idx}
                        to={`/circuits?city=${encodeURIComponent(city.slug || city.name.toLowerCase())}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: '#FFFFFF',
                          color: 'var(--primary-color)',
                          border: '1px solid #CBD5E1',
                          padding: '5px 12px',
                          borderRadius: '20px',
                          fontSize: '0.84rem',
                          fontWeight: '600',
                          textDecoration: 'none',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <i className="fas fa-map-marker-alt" style={{ fontSize: '0.78rem' }}></i>
                        {city.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Day by Day Itinerary */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <div style={{ background: '#fff', borderRadius: '12px', padding: '30px', marginBottom: '30px', boxShadow: 'var(--shadow-sm)' }}>
                <h2 style={{ fontSize: '1.6rem', marginBottom: '20px', color: 'var(--secondary-color)' }}>
                  <i className="fas fa-map-marked-alt" style={{ color: 'var(--primary-color)' }}></i> Itinéraire Détaillé Jour par Jour
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {tour.itinerary.map((item) => (
                    <div
                      key={item.day}
                      style={{
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        transition: 'var(--transition)'
                      }}
                    >
                      <div
                        onClick={() => setOpenDay(openDay === item.day ? null : item.day)}
                        style={{
                          background: openDay === item.day ? 'var(--secondary-color)' : '#f8fafc',
                          color: openDay === item.day ? '#fff' : 'var(--secondary-color)',
                          padding: '14px 20px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                          fontWeight: '700',
                          fontSize: '1rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span
                            style={{
                              background: openDay === item.day ? 'var(--gold-color)' : 'var(--primary-color)',
                              color: openDay === item.day ? '#0b2545' : '#fff',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.8rem'
                            }}
                          >
                            Jour {item.day}
                          </span>
                          <span>{item.title}</span>
                        </div>
                        <i className={`fas fa-chevron-${openDay === item.day ? 'up' : 'down'}`}></i>
                      </div>

                      {openDay === item.day && (
                        <div style={{ padding: '20px', background: '#ffffff' }}>
                          <p style={{ lineHeight: '1.7', color: 'var(--text-main)', marginBottom: '14px' }}>
                            {item.description}
                          </p>
                          <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                            {item.meals && <span><i className="fas fa-utensils" style={{ color: 'var(--primary-color)' }}></i> {item.meals}</span>}
                            {item.accommodation && <span><i className="fas fa-hotel" style={{ color: 'var(--primary-color)' }}></i> {item.accommodation}</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions & Exclusions */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '30px', boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '20px', color: 'var(--secondary-color)' }}>
                Ce Que Comprend Votre Voyage
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <h4 style={{ color: '#15803d', fontSize: '1.1rem', marginBottom: '12px' }}>
                    <i className="fas fa-check"></i> Le prix comprend :
                  </h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                    {tour.inclusions && tour.inclusions.length > 0 ? (
                      tour.inclusions.map((inc, i) => (
                        <li key={i} style={{ display: 'flex', gap: '8px' }}>
                          <i className="fas fa-check" style={{ color: '#15803d', marginTop: '4px' }}></i>
                          <span>{inc}</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <li><i className="fas fa-check" style={{ color: '#15803d' }}></i> Véhicule privé climatisé & chauffeur</li>
                        <li><i className="fas fa-check" style={{ color: '#15803d' }}></i> Hébergements de charme & petits-déjeuners</li>
                        <li><i className="fas fa-check" style={{ color: '#15803d' }}></i> Assistance francophone 24h/24</li>
                      </>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 style={{ color: '#b91c1c', fontSize: '1.1rem', marginBottom: '12px' }}>
                    <i className="fas fa-times"></i> Le prix ne comprend pas :
                  </h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                    {tour.exclusions && tour.exclusions.length > 0 ? (
                      tour.exclusions.map((exc, i) => (
                        <li key={i} style={{ display: 'flex', gap: '8px' }}>
                          <i className="fas fa-times" style={{ color: '#b91c1c', marginTop: '4px' }}></i>
                          <span>{exc}</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <li><i className="fas fa-times" style={{ color: '#b91c1c' }}></i> Vols internationaux</li>
                        <li><i className="fas fa-times" style={{ color: '#b91c1c' }}></i> Frais de visa électronique pour l'Inde</li>
                        <li><i className="fas fa-times" style={{ color: '#b91c1c' }}></i> Pourboires et dépenses personnelles</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <aside style={{ position: 'sticky', top: '95px', alignSelf: 'start', zIndex: 10 }}>
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '28px', boxShadow: 'var(--shadow-md)', border: '2px solid var(--gold-light)' }}>
              <span className="badge-gold" style={{ marginBottom: '10px', display: 'inline-block' }}>Devis 100% Personnalisé</span>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--secondary-color)', margin: '8px 0', fontFamily: 'var(--font-heading)' }}>
                Sur Devis Gratuit
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Circuit privatif sur-mesure avec chauffeur dédié, adaptable selon vos envies, votre rythme et le niveau d’hébergement souhaité.
              </p>

              <button className="btn btn-primary btn-lg btn-full" onClick={() => setIsBookingOpen(true)} style={{ marginBottom: '12px' }}>
                <i className="fas fa-paper-plane"></i> Demander un Devis
              </button>
              <Link to="/voyage-sur-mesure" className="btn btn-outline btn-full" style={{ marginBottom: '20px' }}>
                <i className="fas fa-sliders-h"></i> Adapter ce circuit
              </Link>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <i className="fas fa-shield-alt" style={{ color: 'var(--accent-color)' }}></i>
                  <span>Aucun paiement en ligne requis</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <i className="fas fa-clock" style={{ color: 'var(--primary-color)' }}></i>
                  <span>Réponse détaillée sous 24h</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fab fa-whatsapp" style={{ color: '#25D366' }}></i>
                  <span>Conseiller francophone à votre écoute</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} tour={tour} />
    </div>
  );
};

export default TourDetail;
