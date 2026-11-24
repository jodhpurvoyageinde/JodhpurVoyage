import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { fetchPageContent } from '../services/api';

const DEFAULT_QUI_SOMMES_NOUS = {
  hero: {
    bgImage: '/images/image-12.jpg',
    badge: 'Notre Histoire & Nos Engagements',
    badgeIcon: 'fas fa-compass',
    title: 'Qui Sommes Nous ?',
    description: "Agence de voyage locale francophone en Inde et au Népal. Découvrez l'équipe passionnée et l'histoire qui anime Jodhpur Voyage depuis plus de 10 ans."
  },
  identity: {
    subtitle: 'Notre Identité',
    title: 'Une Agence Locale Francophone et Passionnée',
    paragraph1: "Jodhpur Voyage est une agence de voyage locale basée au Rajasthan en Inde. Experte dans le tourisme avec une parfaite connaissance du pays, nous souhaitons vous faire découvrir l’Inde et le Népal. Enregistrée au ministère du tourisme du Rajasthan, nous sommes en mesure de vous assurer toutes les prestations nécessaires dont vous aurez besoin durant votre séjour.",
    paragraph2: "Nous vous proposons des forfaits de voyages, mais nous sommes aussi à votre disposition pour élaborer des circuits personnalisés. Notre agence est spécialisée dans le voyage sur mesure et organise des voyages depuis plus de 20 ans. Nous sommes une agence locale donc disponible, réactive et à l’écoute de toutes les demandes des voyageurs.",
    paragraph3: "Une fois sur place, nous restons à votre disposition et nous nous assurons du bon déroulement de votre voyage. Nous avons à cœur de vous transmettre notre passion et de vous faire découvrir notre pays autrement.",
    image: '/images/image-9.jpg'
  },
  founder: {
    photo: '/images/mr-singh.jpg',
    name: 'Mr Singh',
    role: 'Fondateur & Interlocuteur Principal',
    subtitle: 'Le Mot du Fondateur',
    title: 'Notre Philosophie',
    quote: "« Passionné par mon pays et sa culture, j'ai obtenu mon master de tourisme à l’université de Jodhpur et j'ai débuté en tant que guide francophone pour les agences de voyages de Delhi. À la suite d’une rencontre avec une française et les liens d’amitié aidant, j'ai pu réaliser mon rêve et créer ma propre agence de voyage. Aujourd'hui, j'ai le plaisir de partager ce rêve avec mon équipe et mes clients. »",
    description1: "Le projet naît d'un désir de s'ouvrir au monde et de partager la culture et les paysages de l'Inde. Notre pays, mystérieux et paradoxal, fascine par sa culture, sa diversité, la coexistence entre ses multiples religions, ses centaines de langues et dialectes. Ses paysages très variés entre plaines, déserts, montagnes et océans continuent de nous fascinations tout autant que vous.",
    description2: "Nous savons que vous pourrez parfois être surpris, mais nous sommes persuadés que vous ne resterez pas indifférent. C’est avec une grande passion, un professionnalisme et un amour profond pour l'Inde que notre équipe vous fait découvrir ce pays."
  },
  pillars: {
    subtitle: 'Pourquoi Nous Choisir',
    title: 'Les Piliers de Notre Engagement',
    description: "Un service d'exception pour un voyage en toute sérénité.",
    items: [
      {
        icon: 'fas fa-tag',
        title: 'En Direct & Sans Intermédiaire',
        desc: 'Nous vous proposons des prix en direct, négociés et sans intermédiaires, vous garantissant le meilleur rapport qualité-prix.'
      },
      {
        icon: 'fas fa-hotel',
        title: 'Hébergements de Charme & Havelis',
        desc: "Nous vous conseillons les Havelis, traditionnelles maisons de maître restaurées en hôtels de charme pour préserver l'âme authentique d'antan."
      },
      {
        icon: 'fas fa-car-side',
        title: 'Transport & Chauffeurs Privés',
        desc: 'Véhicules récents et chauffeurs expérimentés pour vous permettre de garder toute votre quiétude et sécurité durant les trajets.'
      },
      {
        icon: 'fas fa-user-tie',
        title: 'Guides Francophones Certifiés',
        desc: "Guides francophones officiels qui assurent l'explication culturelle et vous protègent des abus commerciaux sur les sites."
      },
      {
        icon: 'fas fa-sliders-h',
        title: 'Circuits 100% Personnalisables',
        desc: 'Chaque voyageur est unique : nous ajustons le rythme, la durée et les étapes selon vos envies spécifiques.'
      },
      {
        icon: 'fas fa-headset',
        title: 'Assistance & Suivi 24h/7j',
        desc: 'Une équipe locale réceptive disponible à tout moment sur place en Inde pour répondre à la moindre demande.'
      }
    ]
  },
  cta: {
    bgImage: '/images/image-8.jpg',
    title: 'Envie de réaliser le voyage de vos rêves en Inde ?',
    buttonText: 'Demander un Devis Sur Mesure',
    buttonLink: '/voyage-sur-mesure'
  }
};

const QuiNousSommes = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [content, setContent] = useState(DEFAULT_QUI_SOMMES_NOUS);

  useEffect(() => {
    fetchPageContent('qui-sommes-nous')
      .then((res) => {
        if (res.data) {
          setContent(prev => ({
            ...prev,
            ...res.data,
            hero: { ...prev.hero, ...(res.data.hero || {}) },
            identity: { ...prev.identity, ...(res.data.identity || {}) },
            founder: { ...prev.founder, ...(res.data.founder || {}) },
            pillars: {
              ...prev.pillars,
              ...(res.data.pillars || {}),
              items: res.data.pillars?.items || prev.pillars.items
            },
            cta: { ...prev.cta, ...(res.data.cta || {}) }
          }));
        }
      })
      .catch((err) => console.error('Error loading qui-sommes-nous content:', err));

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);

    const checkAndScrollToHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const targetId = hash.replace('#', '');
        const elem = document.getElementById(targetId);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return true;
        }
      }
      return false;
    };

    checkAndScrollToHash();
    const t1 = setTimeout(checkAndScrollToHash, 150);
    const t2 = setTimeout(checkAndScrollToHash, 400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { hero, identity, founder, pillars, cta } = content;

  return (
    <>
      <SEO pageKey="qui-nous-sommes" />
      
      {/* =========================================================================
          HERO BANNER
          ========================================================================= */}
      <section className="about-hero-section" id="hero">
        <img src={hero.bgImage || '/images/image-12.jpg'} alt="Qui Sommes Nous Banner" className="about-hero-bg" onError={(e) => { e.target.src = '/images/image-12.jpg'; }} />
        <div className="container about-hero-content">
          <span className="hero-badge">
            <i className={hero.badgeIcon || 'fas fa-compass'}></i> {hero.badge || 'Notre Histoire & Nos Engagements'}
          </span>
          <h1 className="about-hero-title">{hero.title || 'Qui Sommes Nous ?'}</h1>
          <p className="about-hero-desc">
            {hero.description}
          </p>
        </div>
      </section>

      {/* =========================================================================
          MAIN ABOUT CONTENT SECTION (NOTRE IDENTITE)
          ========================================================================= */}
      <section className="section-padding bg-white" id="valeurs">
        <div className="container">
          <div className="about-grid" id="identity">
            <div>
              <span className="section-subtitle">{identity.subtitle || 'Notre Identité'}</span>
              <h2 className="section-title about-title">{identity.title || 'Une Agence Locale Francophone et Passionnée'}</h2>
              <div className="about-text">
                {identity.paragraph1 && <p className="contact-lead-desc">{identity.paragraph1}</p>}
                {identity.paragraph2 && <p className="contact-lead-desc">{identity.paragraph2}</p>}
                {identity.paragraph3 && <p>{identity.paragraph3}</p>}
              </div>
            </div>

            <div className="about-image-wrapper">
              <img src={identity.image || '/images/image-9.jpg'} alt="Jodhpur Voyage Architecture" className="about-image" onError={(e) => { e.target.src = '/images/image-9.jpg'; }} />
            </div>
          </div>

          {/* =========================================================================
              FOUNDER'S NOTE SECTION (MR SINGH / NOTRE PHILOSOPHIE)
              ========================================================================= */}
          <div className="founder-card" id="notre-philosophie">
            <div className="founder-grid">
              <div className="founder-img-col">
                <img src={founder.photo || '/images/mr-singh.jpg'} alt={founder.name || 'Mr Singh'} className="founder-img" onError={(e) => { e.target.src = '/images/mr-singh.jpg'; }} />
                <h3 className="founder-name">{founder.name || 'Mr Singh'}</h3>
                <span className="founder-role">{founder.role || 'Fondateur & Interlocuteur Principal'}</span>
              </div>

              <div>
                <span className="section-subtitle">
                  <i className="fas fa-quote-left"></i> {founder.subtitle || 'Le Mot du Fondateur'}
                </span>
                <h2 className="section-title about-title" id="philosophie">{founder.title || 'Notre Philosophie'}</h2>

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

          {/* =========================================================================
              PILLARS OF COMMITMENT GRID (NOTRE ENGAGEMENT RESPONSABLE)
              ========================================================================= */}
          <div id="notre-engagement-responsable">
            <div id="pillars">
              <div className="section-header">
                <span className="section-subtitle">{pillars.subtitle || 'Pourquoi Nous Choisir'}</span>
                <h2 className="section-title" id="engagement-responsable">{pillars.title || 'Les Piliers de Notre Engagement'}</h2>
                <p className="section-description">{pillars.description || "Un service d'exception pour un voyage en toute sérénité."}</p>
              </div>

            <div className="pillars-grid">
              {(pillars.items || []).map((pillar, idx) => (
                <div key={idx} className="pillar-card">
                  <div className="pillar-icon-circle">
                    <i className={pillar.icon || 'fas fa-tag'}></i>
                  </div>
                  <h3 className="pillar-title">{pillar.title}</h3>
                  <p className="pillar-desc">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* =========================================================================
          CTA BANNER
          ========================================================================= */}
      <section className="cta-banner-section">
        <img src={cta.bgImage || '/images/image-8.jpg'} alt="CTA Background" className="cta-bg-image" onError={(e) => { e.target.src = '/images/image-8.jpg'; }} />
        <div className="container cta-content">
          <h2 className="cta-title">{cta.title || 'Envie de réaliser le voyage de vos rêves en Inde ?'}</h2>
          <Link to={cta.buttonLink || '/voyage-sur-mesure'} className="btn btn-primary btn-lg">
            {cta.buttonText || 'Demander un Devis Sur Mesure'}
          </Link>
        </div>
      </section>

      {/* =========================================================================
          FLOATING WIDGETS
          ========================================================================= */}
      <a
        href="https://wa.me/919650698869"
        target="_blank"
        rel="noreferrer"
        className="floating-whatsapp"
        aria-label="Contactez-nous sur WhatsApp"
      >
        <i className="fab fa-whatsapp"></i>
        <span className="whatsapp-tooltip">Contactez-nous sur WhatsApp</span>
      </a>

      {showScrollTop && (
        <button
          className="scroll-to-top show"
          onClick={scrollToTop}
          aria-label="Retour en haut de page"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <i className="fas fa-chevron-up"></i>
        </button>
      )}
    </>
  );
};

export default QuiNousSommes;
