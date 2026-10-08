import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchTours, fetchDestinations, fetchMegaMenuConfig } from '../services/api';
import { loadCustomUrlMappings, getCustomPath } from '../utils/customUrlHelper';

const DEFAULT_DESTINATION_GROUPS = [
  {
    key: 'nord',
    title: 'Inde du Nord',
    icon: 'fas fa-gopuram',
    subcategories: [
      { name: 'Rajasthan', path: '/destinations/rajasthan', searchKey: 'rajasthan' },
      { name: 'Delhi & Agra (Taj Mahal)', path: '/destinations/delhi-agra', searchKey: 'delhi-agra' },
      { name: 'Varanasi (Bénarès)', path: '/destinations/varanasi', searchKey: 'varanasi' },
      { name: 'Amritsar & Punjab', path: '/destinations/amritsar-punjab', searchKey: 'amritsar-punjab' },
      { name: 'Dharamsala & Himachal', path: '/destinations/dharamsala-himachal', searchKey: 'dharamsala-himachal' },
      { name: 'Rishikesh & Uttarakhand', path: '/destinations/rishikesh-uttarakhand', searchKey: 'rishikesh-uttarakhand' },
      { name: 'Ladakh (Petit Tibet)', path: '/destinations/ladakh', searchKey: 'ladakh' }
    ]
  },
  {
    key: 'sud',
    title: 'Inde du Sud',
    icon: 'fas fa-tree',
    subcategories: [
      { name: 'Kerala & Backwaters', path: '/destinations/kerala', searchKey: 'kerala' },
      { name: 'Tamil Nadu & Temples', path: '/destinations/tamil-nadu', searchKey: 'tamil-nadu' },
      { name: 'Karnataka & Hampi', path: '/destinations/karnataka', searchKey: 'karnataka' },
      { name: 'Goa & Côte Tropicale', path: '/destinations/goa', searchKey: 'goa' },
      { name: 'Orissa & Konark', path: '/destinations/orissa', searchKey: 'orissa' }
    ]
  },
  {
    key: 'ouest',
    title: "Inde de l'Ouest",
    icon: 'fas fa-compass',
    subcategories: [
      { name: 'Gujarat & Kutch', path: '/destinations/gujarat', searchKey: 'gujarat' },
      { name: 'Désert du Rann de Kutch', path: '/destinations/gujarat', searchKey: 'kutch' },
      { name: 'Palitana & Shatrunjaya', path: '/destinations/gujarat', searchKey: 'palitana' }
    ]
  },
  {
    key: 'nepal',
    title: 'Népal',
    icon: 'fas fa-mountain',
    subcategories: [
      { name: 'Népal & Katmandou', path: '/destinations/nepal', searchKey: 'nepal' },
      { name: 'Vallée de Katmandou', path: '/destinations/nepal', searchKey: 'katmandou' },
      { name: 'Pokhara & Annapurnas', path: '/destinations/nepal', searchKey: 'pokhara' },
      { name: 'Parc National de Chitwan', path: '/destinations/nepal', searchKey: 'chitwan' }
    ]
  },
  {
    key: 'bhoutan',
    title: 'Bhoutan',
    icon: 'fas fa-place-of-worship',
    subcategories: [
      { name: 'Bhoutan – Royaume du Dragon', path: '/destinations/bhoutan', searchKey: 'bhoutan' },
      { name: 'Paro & Nid du Tigre', path: '/destinations/bhoutan', searchKey: 'paro' },
      { name: 'Punakha & Dzongs', path: '/destinations/bhoutan', searchKey: 'punakha' },
      { name: 'Thimphu Royale', path: '/destinations/bhoutan', searchKey: 'thimphu' }
    ]
  }
];

const DEFAULT_MEGA_CONFIG = {
  topBar: {
    email: 'Info@jodhpurvoyage.com',
    phone: '+91-96 50 69 86 69',
    announcementPrefix: 'Voyager en confiance :',
    announcementText: 'devis gratuit & conseils sur mesure',
    announcementLink: '/voyage-sur-mesure',
    tripAdvisorUrl: 'https://www.tripadvisor.in/Attraction_Review-g297668-d26864310-Reviews-Jodhpur_Voyage_Pvt_Ltd-Jodhpur_Jodhpur_District_Rajasthan.html',
    trustpilotUrl: 'https://www.trustpilot.com/review/jodhpurvoyage.com',
    googleReviewsUrl: 'https://www.google.com/search?q=Jodhpur+Voyage',
    facebookUrl: 'https://www.facebook.com/jodhpurvoyage/',
    instagramUrl: 'https://www.instagram.com/jodhpur_voyage/',
    twitterUrl: 'https://twitter.com'
  },
  aboutMenu: {
    headerText: 'CRÉATEUR DES PLUS BEAUX',
    headerHighlight: 'VOYAGES DEPUIS 20+ ANS',
    items: [
      { title: 'Qui sommes-nous', link: '/qui-sommes-nous', image: '/images/image-12.jpg', order: 1 },
      { title: 'Notre valeur ajoutée', link: '/qui-sommes-nous#notre-philosophie', image: '/images/image-9.jpg', order: 2 },
      { title: 'Notre engagement responsable', link: '/qui-sommes-nous#notre-engagement-responsable', image: '/images/image-6.jpg', order: 3 },
      { title: 'Notre Équipe', link: '/notre-equipe', image: '/images/image-8.jpg', order: 4 }
    ]
  },
  destinationsMenu: {
    useDynamicFromDb: true,
    featuredCard: {
      image: '/images/Voyage-Jaisalmer.jpg',
      tag: 'Incontournable',
      title: 'Le Rajasthan Doré',
      buttonText: 'Explorer',
      buttonLink: '/destination-rajasthan.html'
    }
  },
  surMesureMenu: {
    title: 'Créez Votre Voyage Personnalisé',
    icon: 'fas fa-sliders-h',
    description: 'Exprimez vos envies et nous concevrons un itinéraire unique, adapté à vos dates, votre rythme et votre budget.',
    links: [
      { label: 'Créer votre voyage', path: '/voyage-sur-mesure', icon: 'fas fa-magic' },
      { label: 'Rajasthan sur mesure', path: '/destinations/rajasthan', icon: 'fas fa-crown' },
      { label: 'Inde du Nord', path: '/destinations', icon: 'fas fa-compass' },
      { label: 'Inde du Sud', path: '/destinations/kerala', icon: 'fas fa-water' },
      { label: 'Népal', path: '/destinations/nepal', icon: 'fas fa-hiking' },
      { label: 'Voyage aventure', path: '/tours', icon: 'fas fa-route' },
      { label: 'Voyage culturel', path: '/tours', icon: 'fas fa-landmark' }
    ],
    featuredCard: {
      image: '/images/jaipur-travel.jpg',
      tag: 'Service Exclusif',
      title: 'Itinéraires 100% Personnalisés',
      buttonText: 'Commencer',
      buttonLink: '/voyage-sur-mesure'
    }
  },
  infosMenu: {
    columns: [
      {
        title: 'Formalités & Climat',
        icon: 'fas fa-passport',
        links: [
          { label: "Visa pour l'Inde & Népal", path: '/infos-pratiques#visas-formalites', icon: 'fas fa-id-card' },
          { label: 'Quand partir & Climat', path: '/infos-pratiques#climat-geographie', icon: 'fas fa-calendar-alt' },
          { label: 'Patrimoine UNESCO', path: '/infos-pratiques#patrimoine-unesco', icon: 'fas fa-sun' }
        ]
      },
      {
        title: 'Santé & Budget',
        icon: 'fas fa-heartbeat',
        links: [
          { label: 'Santé & Vaccins', path: '/infos-pratiques#sante-vaccins', icon: 'fas fa-first-aid' },
          { label: 'Monnaie & Change (Rupee)', path: '/infos-pratiques#monnaie-change', icon: 'fas fa-coins' },
          { label: 'Transports & Chauffeur', path: '/infos-pratiques#transports-chauffeur', icon: 'fas fa-car-side' }
        ]
      },
      {
        title: 'Culture & Lexique',
        icon: 'fas fa-question-circle',
        links: [
          { label: 'Lexique Hindi de Survie', path: '/infos-pratiques#vocabulaire-hindi', icon: 'fas fa-language' },
          { label: 'Calendrier des Festivals', path: '/infos-pratiques#festivals-fetes', icon: 'fas fa-glass-cheers' },
          { label: 'Religions & Castes', path: '/infos-pratiques#religions-castes', icon: 'fas fa-om' }
        ]
      }
    ],
    helpCard: {
      title: 'Des questions ?',
      description: 'Nos conseillers francophones répondent à toutes vos interrogations.',
      buttonText: 'Nous contacter',
      buttonLink: '/contact'
    }
  },
  inspirationMenu: {
    headerText: 'LE VOYAGE SELON',
    headerHighlight: 'VOS ENVIES',
    items: [
      { title: 'Voyage sur mesure', link: '/voyage-sur-mesure', image: '/images/image-12.jpg', order: 1 },
      { title: 'Circuit accompagné', link: '/circuit-accompagne', image: '/images/image-9.jpg', order: 2 },
      { title: 'Culture & Safari', link: '/culture-et-safari', image: '/images/image-6.jpg', order: 3 },
      { title: '+ de 10 personnes', link: '/plus-de-10-personnes', image: '/images/slide4-300x176.jpg', order: 4 },
      { title: 'Toutes les inspirations', link: '/inspirations', image: '/images/slide8-300x176.jpg', order: 5 }
    ]
  }
};

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileMega, setOpenMobileMega] = useState(null);
  const [packageNavGroups, setPackageNavGroups] = useState(DEFAULT_DESTINATION_GROUPS);
  const [forceCloseMega, setForceCloseMega] = useState(false);
  const [megaConfig, setMegaConfig] = useState(DEFAULT_MEGA_CONFIG);
  const location = useLocation();

  // Fetch mega menu CMS configuration & destinations from backend
  useEffect(() => {
    loadCustomUrlMappings().catch(() => {});

    // Fetch dynamic Mega Menu CMS settings
    fetchMegaMenuConfig()
      .then((res) => {
        if (res.data) {
          setMegaConfig(prev => ({
            ...prev,
            ...res.data,
            topBar: { ...prev.topBar, ...(res.data.topBar || {}) },
            aboutMenu: { ...prev.aboutMenu, ...(res.data.aboutMenu || {}) },
            inspirationMenu: { ...prev.inspirationMenu, ...(res.data.inspirationMenu || {}) },
            surMesureMenu: { ...prev.surMesureMenu, ...(res.data.surMesureMenu || {}) },
            infosMenu: { ...prev.infosMenu, ...(res.data.infosMenu || {}) },
            destinationsMenu: { ...prev.destinationsMenu, ...(res.data.destinationsMenu || {}) }
          }));
        }
      })
      .catch((err) => console.error('Error fetching mega menu config:', err));

    fetchDestinations()
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        if (!list || list.length === 0) return;

        const groupMap = {
          nord: {
            key: 'nord',
            title: 'Inde du Nord',
            icon: 'fas fa-gopuram',
            subcategories: [...DEFAULT_DESTINATION_GROUPS[0].subcategories]
          },
          sud: {
            key: 'sud',
            title: 'Inde du Sud',
            icon: 'fas fa-tree',
            subcategories: [...DEFAULT_DESTINATION_GROUPS[1].subcategories]
          },
          ouest: {
            key: 'ouest',
            title: "Inde de l'Ouest",
            icon: 'fas fa-compass',
            subcategories: [...DEFAULT_DESTINATION_GROUPS[2].subcategories]
          },
          nepal: {
            key: 'nepal',
            title: 'Népal',
            icon: 'fas fa-mountain',
            subcategories: [...DEFAULT_DESTINATION_GROUPS[3].subcategories]
          },
          bhoutan: {
            key: 'bhoutan',
            title: 'Bhoutan',
            icon: 'fas fa-place-of-worship',
            subcategories: [...DEFAULT_DESTINATION_GROUPS[4].subcategories]
          }
        };

        list.forEach((d) => {
          if (d.published === false) return;
          const reg = (d.region || 'inde-du-nord').toLowerCase();

          let colKey = 'nord';
          if (reg === 'nepal' || reg.includes('nepal')) colKey = 'nepal';
          else if (reg === 'bhoutan' || reg.includes('bhoutan')) colKey = 'bhoutan';
          else if (reg === 'inde-de-louest' || reg === 'inde-du-ouest' || reg === 'ouest' || reg.includes('ouest') || reg === 'gujarat') colKey = 'ouest';
          else if (reg === 'inde-du-sud' || reg === 'sud' || reg === 'kerala' || reg === 'karnataka' || reg === 'goa' || reg === 'orissa') colKey = 'sud';
          else colKey = 'nord';

          const name = d.name || d.title;
          const path = d.customUrl || `/destinations/${d.slug}`;

          const existingIdx = groupMap[colKey].subcategories.findIndex(
            (s) => s.name.toLowerCase() === name.toLowerCase() || s.path === path
          );
          if (existingIdx !== -1) {
            groupMap[colKey].subcategories[existingIdx] = { name, path };
          } else {
            groupMap[colKey].subcategories.push({ name, path });
          }
        });

        const dynamicGroups = Object.values(groupMap).filter((g) => g.subcategories.length > 0);
        if (dynamicGroups.length > 0) {
          setPackageNavGroups(dynamicGroups);
        }
      })
      .catch((err) => console.error('Error fetching navbar destinations:', err));
  }, []);

  // Close mobile drawer & force close mega menu on route/location changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenMobileMega(null);
    setForceCloseMega(true);

    const timer = setTimeout(() => {
      setForceCloseMega(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const [hoveredMega, setHoveredMega] = useState(null);
  const megaCloseTimeoutRef = useRef(null);

  const handleMegaMouseEnter = (megaKey) => {
    if (megaCloseTimeoutRef.current) {
      clearTimeout(megaCloseTimeoutRef.current);
      megaCloseTimeoutRef.current = null;
    }
    setForceCloseMega(false);
    setHoveredMega(megaKey);
  };

  const handleMegaMouseLeave = () => {
    if (megaCloseTimeoutRef.current) {
      clearTimeout(megaCloseTimeoutRef.current);
    }
    megaCloseTimeoutRef.current = setTimeout(() => {
      setHoveredMega(null);
    }, 120);
  };

  const handleNonMegaMouseEnter = () => {
    if (megaCloseTimeoutRef.current) {
      clearTimeout(megaCloseTimeoutRef.current);
      megaCloseTimeoutRef.current = null;
    }
    setHoveredMega(null);
  };

  useEffect(() => {
    return () => {
      if (megaCloseTimeoutRef.current) {
        clearTimeout(megaCloseTimeoutRef.current);
      }
    };
  }, []);

  const closeMobileMenu = () => {
    if (megaCloseTimeoutRef.current) {
      clearTimeout(megaCloseTimeoutRef.current);
      megaCloseTimeoutRef.current = null;
    }
    setHoveredMega(null);
    setMobileMenuOpen(false);
    setOpenMobileMega(null);
    setForceCloseMega(true);
    setTimeout(() => setForceCloseMega(false), 200);
  };

  const handleHeaderMouseLeave = () => {
    if (megaCloseTimeoutRef.current) {
      clearTimeout(megaCloseTimeoutRef.current);
      megaCloseTimeoutRef.current = null;
    }
    setHoveredMega(null);
  };

  const handleNavMouseEnter = () => {
    setForceCloseMega(false);
  };

  const toggleMobileMega = (megaName) => {
    setOpenMobileMega(prev => (prev === megaName ? null : megaName));
  };

  const handleParentNavClick = (e, megaKey) => {
    setForceCloseMega(false);
    if (window.innerWidth <= 991) {
      e.preventDefault();
      toggleMobileMega(megaKey);
    }
  };

  const handleMegaItemClick = (e, targetUrl) => {
    if (megaCloseTimeoutRef.current) {
      clearTimeout(megaCloseTimeoutRef.current);
      megaCloseTimeoutRef.current = null;
    }
    setHoveredMega(null);
    closeMobileMenu();
    if (!targetUrl) return;

    let resolvedTarget = targetUrl;
    if (targetUrl === '/notre-valeur-ajoutee' || targetUrl === '/notre-valeur-ajoutee.html') {
      resolvedTarget = '/qui-sommes-nous#notre-philosophie';
    } else if (targetUrl === '/notre-engagement-responsable' || targetUrl === '/notre-engagement-responsable.html') {
      resolvedTarget = '/qui-sommes-nous#notre-engagement-responsable';
    }

    const lowerTarget = targetUrl.toLowerCase();
    if (lowerTarget.includes('climat') || lowerTarget.includes('quand-partir')) {
      resolvedTarget = '/infos-pratiques#climat-geographie';
    } else if (lowerTarget.includes('transport')) {
      resolvedTarget = '/infos-pratiques#transports-chauffeur';
    } else if (lowerTarget.includes('conseil') || lowerTarget.includes('faq') || lowerTarget.includes('question')) {
      resolvedTarget = '/infos-pratiques#conseils-pratiques';
    } else if (lowerTarget.includes('visa')) {
      resolvedTarget = '/infos-pratiques#visas-formalites';
    } else if (lowerTarget.includes('sante') || lowerTarget.includes('vaccin')) {
      resolvedTarget = '/infos-pratiques#sante-vaccins';
    } else if (lowerTarget.includes('monnaie') || lowerTarget.includes('rupee')) {
      resolvedTarget = '/infos-pratiques#monnaie-change';
    }

    const [path, hash] = resolvedTarget.split('#');
    const resolvedPath = getCustomPath(path || '/');

    if (hash && location.pathname === resolvedPath) {
      e.preventDefault();
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        const altId = hash.split('-')[0];
        const altElement = document.getElementById(altId);
        if (altElement) altElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (!hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isActive = (path) => {
    if (location.pathname === path) return true;
    const custom = getCustomPath(path);
    return Boolean(custom && location.pathname === custom);
  };

  const { topBar, aboutMenu, inspirationMenu, surMesureMenu, infosMenu, destinationsMenu } = megaConfig;

  // Filter aboutMenu items to ensure only the 4 main items (without /commentaires) are present and links map properly
  const filteredAboutItems = (aboutMenu?.items || [])
    .filter(item => item.link !== '/commentaires')
    .map(item => {
      if (item.title === 'Notre valeur ajoutée' || item.link === '/notre-valeur-ajoutee' || item.link === '/notre-valeur-ajoutee.html') {
        return { ...item, link: '/qui-sommes-nous#notre-philosophie' };
      }
      if (item.title === 'Notre engagement responsable' || item.link === '/notre-engagement-responsable' || item.link === '/notre-engagement-responsable.html') {
        return { ...item, link: '/qui-sommes-nous#notre-engagement-responsable' };
      }
      return item;
    })
    .slice(0, 4);

  // Process infosMenu columns to ensure all links map to valid hashes on /infos-pratiques
  const processedInfosColumns = (infosMenu?.columns || []).map(col => ({
    ...col,
    links: (col.links || []).map(lnk => {
      let resolvedPath = lnk.path || '/infos-pratiques';
      const p = (lnk.path || '').toLowerCase();
      const l = (lnk.label || '').toLowerCase();

      if (p.includes('climat') || p.includes('quand-partir') || l.includes('climat') || l.includes('quand partir')) {
        resolvedPath = '/infos-pratiques#climat-geographie';
      } else if (p.includes('transport') || l.includes('transport')) {
        resolvedPath = '/infos-pratiques#transports-chauffeur';
      } else if (p.includes('conseil') || p.includes('faq') || p.includes('question') || l.includes('conseil') || l.includes('faq') || l.includes('question')) {
        resolvedPath = '/infos-pratiques#conseils-pratiques';
      } else if (p.includes('visa') || l.includes('visa')) {
        resolvedPath = '/infos-pratiques#visas-formalites';
      } else if (p.includes('sante') || p.includes('vaccin') || l.includes('santé') || l.includes('sante')) {
        resolvedPath = '/infos-pratiques#sante-vaccins';
      } else if (p.includes('monnaie') || p.includes('change') || p.includes('rupee') || l.includes('monnaie')) {
        resolvedPath = '/infos-pratiques#monnaie-change';
      } else if (p.includes('vocabulaire') || p.includes('hindi') || l.includes('hindi') || l.includes('lexique')) {
        resolvedPath = '/infos-pratiques#vocabulaire-hindi';
      } else if (p.includes('festival') || p.includes('fete') || l.includes('festival') || l.includes('fête')) {
        resolvedPath = '/infos-pratiques#festivals-fetes';
      } else if (p.includes('religion') || p.includes('caste') || l.includes('religion')) {
        resolvedPath = '/infos-pratiques#religions-castes';
      } else if (p.includes('unesco') || p.includes('patrimoine') || l.includes('unesco')) {
        resolvedPath = '/infos-pratiques#patrimoine-unesco';
      }

      return { ...lnk, path: resolvedPath };
    })
  }));

  return (
    <>
      <header className="site-header" onMouseLeave={handleHeaderMouseLeave}>
        {/* Top Bar */}
        <div className="top-bar">
          <div className="container top-bar-container">
            <div className="top-bar-contact">
              <div className="top-bar-item">
                <i className="fas fa-envelope"></i>
                <a href={`mailto:${topBar.email || 'Info@jodhpurvoyage.com'}`}>{topBar.email || 'Info@jodhpurvoyage.com'}</a>
              </div>
              <div className="top-bar-item">
                <i className="fas fa-phone-alt"></i>
                <a href={`tel:${(topBar.phone || '+919650698669').replace(/\s+/g, '')}`}>{topBar.phone || '+91-96 50 69 86 69'}</a>
              </div>
            </div>
            <div className="top-bar-announcement">
              <span>{topBar.announcementPrefix || 'Voyager en confiance :'}</span>{' '}
              <Link to={getCustomPath(topBar.announcementLink || '/voyage-sur-mesure')}>{topBar.announcementText || 'devis gratuit & conseils sur mesure'}</Link>
            </div>
            <div className="top-bar-social">
              {topBar.tripAdvisorUrl && (
                <a href={topBar.tripAdvisorUrl} target="_blank" rel="noreferrer" title="TripAdvisor" aria-label="TripAdvisor">
                  <img src="/images/tripad-icon.png" alt="TripAdvisor" className="top-bar-social-img" />
                </a>
              )}
              {topBar.trustpilotUrl && (
                <a href={topBar.trustpilotUrl} target="_blank" rel="noreferrer" title="Trustpilot" aria-label="Trustpilot">
                  <img src="/images/trustpilot-icon.png" alt="Trustpilot" className="top-bar-social-img" />
                </a>
              )}
              {topBar.googleReviewsUrl && (
                <a href={topBar.googleReviewsUrl} target="_blank" rel="noreferrer" title="Google Reviews" aria-label="Google Reviews">
                  <i className="fab fa-google"></i>
                </a>
              )}
              {topBar.facebookUrl && (
                <a href={topBar.facebookUrl} target="_blank" rel="noreferrer" title="Facebook" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
              )}
              {topBar.instagramUrl && (
                <a href={topBar.instagramUrl} target="_blank" rel="noreferrer" title="Instagram" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
              )}
              {topBar.twitterUrl && (
                <a href={topBar.twitterUrl} target="_blank" rel="noreferrer" title="Twitter" aria-label="Twitter">
                  <i className="fab fa-x-twitter"></i>
                </a>
              )}
              <Link to="/admin/login" title="Accès Administration" aria-label="Admin" style={{ color: 'var(--color-secondary, #C58B39)', marginLeft: '4px' }}>
                <i className="fas fa-lock"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="main-nav-bar">
          <div className="container nav-container">
            {/* Logo */}
            <Link to="/" className="brand-logo" onClick={closeMobileMenu} onMouseEnter={handleNonMegaMouseEnter}>
              <img src="/images/logo-transprent.png" alt="Jodhpur Voyage Logo" className="brand-logo-img" />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <div className="mobile-nav-toggle" onClick={toggleMobileMenu} aria-label="Toggle navigation menu" role="button" tabIndex={0}>
              <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
            </div>

            {/* Navigation Menu */}
            <nav className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
              <div className="mobile-nav-close" onClick={closeMobileMenu} aria-label="Close menu">
                <i className="fas fa-times"></i>
              </div>

              {/* Accueil */}
              <div className={`nav-item ${isActive('/') ? 'active' : ''}`} onMouseEnter={handleNonMegaMouseEnter}>
                <Link to="/" className="nav-link" onClick={closeMobileMenu}>Accueil</Link>
              </div>

              {/* QUI SOMMES NOUS MEGA MENU */}
              <div
                className={`nav-item has-mega ${openMobileMega === 'about' ? 'mobile-open' : ''} ${hoveredMega === 'about' ? 'mega-active' : ''}`}
                onMouseEnter={() => handleMegaMouseEnter('about')}
                onMouseLeave={handleMegaMouseLeave}
              >
                <a href="#about" className="nav-link" onClick={(e) => handleParentNavClick(e, 'about')}>
                  Qui sommes nous <i className={`fas fa-chevron-down mega-chevron ${openMobileMega === 'about' ? 'rotate' : ''}`}></i>
                </a>
                <div
                  className={`mega-menu mega-menu-about ${forceCloseMega ? 'force-closed' : ''}`}
                  onMouseEnter={() => handleMegaMouseEnter('about')}
                  onMouseLeave={handleMegaMouseLeave}
                >
                  <div className="mega-inspirations-header text-center">
                    {aboutMenu.headerText || 'CRÉATEUR DES PLUS BEAUX'} <span>{aboutMenu.headerHighlight || 'VOYAGES DEPUIS 20+ ANS'}</span>
                  </div>
                  <div className="mega-inspirations-grid">
                    {filteredAboutItems.map((item, idx) => (
                      <Link
                        key={idx}
                        to={getCustomPath(item.link || '/qui-sommes-nous')}
                        className="mega-inspiration-card"
                        onClick={(e) => handleMegaItemClick(e, item.link)}
                      >
                        <div className="inspiration-img-wrap">
                          <img src={item.image || '/images/image-12.jpg'} alt={item.title} onError={(e) => { e.target.src = '/images/slide4-300x176.jpg'; }} />
                        </div>
                        <span className="inspiration-card-title">{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* DESTINATION MEGA MENU */}
              <div
                className={`nav-item has-mega ${openMobileMega === 'destinations' ? 'mobile-open' : ''} ${isActive('/destinations') ? 'active' : ''} ${hoveredMega === 'destinations' ? 'mega-active' : ''}`}
                onMouseEnter={() => handleMegaMouseEnter('destinations')}
                onMouseLeave={handleMegaMouseLeave}
              >
                <Link to="/destinations" className="nav-link" onClick={(e) => handleParentNavClick(e, 'destinations')}>
                  Destination <i className={`fas fa-chevron-down mega-chevron ${openMobileMega === 'destinations' ? 'rotate' : ''}`}></i>
                </Link>
                <div
                  className={`mega-menu mega-menu-destinations ${forceCloseMega ? 'force-closed' : ''}`}
                  onMouseEnter={() => handleMegaMouseEnter('destinations')}
                  onMouseLeave={handleMegaMouseLeave}
                >
                  <div className="mega-grid-destinations">
                    {packageNavGroups.map((group) => (
                      <div key={group.key}>
                        <div className="mega-column-title"><i className={group.icon}></i> {group.title}</div>
                        <ul className="mega-link-list">
                          {group.subcategories.map((sub) => (
                            <li key={sub.name}>
                              <Link to={getCustomPath(sub.path)} className="mega-link-item" onClick={(e) => handleMegaItemClick(e, sub.path)}>
                                <i className="fas fa-chevron-right"></i> {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}


                  </div>
                </div>
              </div>

              {/* VOYAGE SUR MESURE DIRECT LINK */}
              <div className={`nav-item ${isActive('/voyage-sur-mesure') ? 'active' : ''}`} onMouseEnter={handleNonMegaMouseEnter}>
                <Link to={getCustomPath('/voyage-sur-mesure')} className="nav-link" onClick={closeMobileMenu}>
                  Voyage sur mesure
                </Link>
              </div>

              {/* INFOS PRATIQUES MEGA MENU */}
              <div
                className={`nav-item has-mega ${openMobileMega === 'infos' ? 'mobile-open' : ''} ${isActive('/infos-pratiques') ? 'active' : ''} ${hoveredMega === 'infos' ? 'mega-active' : ''}`}
                onMouseEnter={() => handleMegaMouseEnter('infos')}
                onMouseLeave={handleMegaMouseLeave}
              >
                <Link to="/infos-pratiques" className="nav-link" onClick={(e) => handleParentNavClick(e, 'infos')}>
                  Infos pratiques <i className={`fas fa-chevron-down mega-chevron ${openMobileMega === 'infos' ? 'rotate' : ''}`}></i>
                </Link>
                <div
                  className={`mega-menu ${forceCloseMega ? 'force-closed' : ''}`}
                  onMouseEnter={() => handleMegaMouseEnter('infos')}
                  onMouseLeave={handleMegaMouseLeave}
                >
                  <div className="mega-grid-3col">
                    {processedInfosColumns.map((col, cIdx) => (
                      <div key={cIdx}>
                        <div className="mega-column-title"><i className={col.icon || 'fas fa-info-circle'}></i> {col.title}</div>
                        <ul className="mega-link-list">
                          {(col.links || []).map((lnk, lIdx) => (
                            <li key={lIdx}>
                              <Link to={getCustomPath(lnk.path)} className="mega-link-item" onClick={(e) => handleMegaItemClick(e, lnk.path)}>
                                <i className={lnk.icon || 'fas fa-chevron-right'}></i> {lnk.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {infosMenu?.helpCard && (
                      <div className="mega-help-card">
                        <h4 className="mega-help-title"><i className="fas fa-headset"></i> {infosMenu.helpCard.title || 'Des questions ?'}</h4>
                        <p className="mega-help-desc">{infosMenu.helpCard.description || 'Nos conseillers francophones répondent à toutes vos interrogations.'}</p>
                        <Link to={getCustomPath(infosMenu.helpCard.buttonLink || '/contact')} className="btn btn-sm btn-primary btn-full" onClick={(e) => handleMegaItemClick(e, infosMenu.helpCard.buttonLink)}>
                          {infosMenu.helpCard.buttonText || 'Nous contacter'}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* INSPIRATION MEGA MENU */}
              <div
                className={`nav-item has-mega ${openMobileMega === 'inspiration' ? 'mobile-open' : ''} ${isActive('/inspiration') ? 'active' : ''} ${hoveredMega === 'inspiration' ? 'mega-active' : ''}`}
                onMouseEnter={() => handleMegaMouseEnter('inspiration')}
                onMouseLeave={handleMegaMouseLeave}
              >
                <a href="#inspiration" className="nav-link" onClick={(e) => handleParentNavClick(e, 'inspiration')}>
                  Inspiration <i className={`fas fa-chevron-down mega-chevron ${openMobileMega === 'inspiration' ? 'rotate' : ''}`}></i>
                </a>
                <div
                  className={`mega-menu mega-menu-inspirations ${forceCloseMega ? 'force-closed' : ''}`}
                  onMouseEnter={() => handleMegaMouseEnter('inspiration')}
                  onMouseLeave={handleMegaMouseLeave}
                >
                  <div className="mega-inspirations-header text-center">
                    {inspirationMenu.headerText || 'LE VOYAGE SELON'} <span>{inspirationMenu.headerHighlight || 'VOS ENVIES'}</span>
                  </div>
                  <div className="mega-inspirations-grid">
                    {(inspirationMenu.items || []).map((item, idx) => (
                      <Link key={idx} to={getCustomPath(item.link || '/voyage-sur-mesure')} className="mega-inspiration-card" onClick={(e) => handleMegaItemClick(e, item.link)}>
                        <div className="inspiration-img-wrap">
                          <img src={item.image || '/images/image-12.jpg'} alt={item.title} onError={(e) => { e.target.src = '/images/slide4-300x176.jpg'; }} />
                        </div>
                        <span className="inspiration-card-title">{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>



              <div className={`nav-item ${isActive('/commentaires') ? 'active' : ''}`} onMouseEnter={handleNonMegaMouseEnter}>
                <Link to={getCustomPath('/commentaires')} className="nav-link" onClick={closeMobileMenu}>commentaires</Link>
              </div>

              <div className={`nav-item ${isActive('/contact') ? 'active' : ''}`} onMouseEnter={handleNonMegaMouseEnter}>
                <Link to={getCustomPath('/contact')} className="nav-link" onClick={closeMobileMenu}>Contactez Nous</Link>
              </div>
            </nav>
          </div>
        </div>
      </header>
      <div className={`mobile-overlay ${mobileMenuOpen ? 'active' : ''}`} onClick={closeMobileMenu}></div>
    </>
  );
};

export default Navbar;
