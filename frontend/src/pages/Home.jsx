import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BookingModal from '../components/BookingModal';
import SEO from '../components/SEO';
import { fetchTours, fetchDestinations } from '../services/api';

const heroSlidesData = [
  {
    image: '/images/image-9.jpg',
    badge: 'Tour Opérateur Spécialisé',
    badgeIcon: 'fa-crown',
    title: 'Jodhpur Voyage',
    titleHighlight: 'Inde & Népal',
    description:
      'Spécialiste des voyages authentiques et sur mesure au Rajasthan, en Inde du Nord, Inde du Sud et au Népal. Découvrez la beauté séculaire de la cité dorée.'
  },
  {
    image: '/images/jaipur-travel.jpg',
    badge: 'Cités Fortifiées & Palais',
    badgeIcon: 'fa-fort-awesome',
    title: 'Les Splendeurs du',
    titleHighlight: 'Rajasthan',
    description:
      'Explorez la ville rose de Jaipur, les forts majestueux du désert et vivez une expérience royale au cœur de l\'histoire indienne.'
  },
  {
    image: '/images/image-8.jpg',
    badge: 'Culture & Spiritualité',
    badgeIcon: 'fa-om',
    title: 'Le Temple d\'Or &',
    titleHighlight: 'L\'Inde du Nord',
    description:
      'Un voyage spirituel fascinant d\'Amritsar aux contreforts de l\'Himalaya, à la rencontre des traditions d\'exception.'
  },
  {
    image: '/images/image-12.jpg',
    badge: 'Merveilles d\'Inde',
    badgeIcon: 'fa-heart',
    title: 'Voyages Émotion &',
    titleHighlight: 'Patrimoine',
    description:
      'Explorez les palais des Maharajas, le mythique Taj Mahal et les lieux d\'exception avec un chauffeur privé et des guides francophones passionnés.'
  },
  {
    image: '/images/image-6.jpg',
    badge: 'Aventure & Sommets',
    badgeIcon: 'fa-mountain',
    title: 'Des Vallées aux',
    titleHighlight: 'Sommets du Népal',
    description:
      'Des vallées sacrées de Katmandou aux sommets mythiques de l\'Himalaya, vivez une immersion culturelle et humaine inoubliable.'
  },
  {
    image: '/images/image-7.jpg',
    badge: 'Rituels Sacrés',
    badgeIcon: 'fa-water',
    title: 'Les Ghats de',
    titleHighlight: 'Varanasi',
    description:
      'Assistez aux cérémonies de l\'Aarti au bord du Gange sacré et plongez dans l\'atmosphère captivante des plus anciennes cités vivantes.'
  },
  {
    image: '/images/travel-to-india.jpg',
    badge: 'Voyage Sur Mesure',
    badgeIcon: 'fa-compass',
    title: 'Immersion Authentique',
    titleHighlight: 'en Inde',
    description:
      'Créez votre itinéraire personnalisé 100% sur mesure avec l\'aide de nos experts locaux franco-indiens.'
  },
  {
    image: '/images/image-2.jpg',
    badge: 'Aventure Désertique',
    badgeIcon: 'fa-sun',
    title: 'Caravanes & Dunes de',
    titleHighlight: 'Jaisalmer',
    description:
      'Randonnée à dos de chameau dans le désert du Thar et nuit magique sous les étoiles de la cité de grès jaune.'
  },
  {
    image: '/images/image-10.jpg',
    badge: 'Séjour Inoubliable',
    badgeIcon: 'fa-star',
    title: 'Les Cités Colorées du',
    titleHighlight: 'Désert',
    description:
      'Parcourez Jodhpur la ville bleue, Udaipur au bord des lacs et les ruelles intemporelles des havelis du Shekhawati.'
  },
  {
    image: '/images/image-5.jpg',
    badge: 'Himalaya & Culture',
    badgeIcon: 'fa-dharmachakra',
    title: 'Voyage Inde du Nord',
    titleHighlight: '& Népal',
    description:
      'Une combinaison parfaite entre la richesse architecturale de la plaine indo-gangétique et les royaumes bouddhistes du Népal.'
  },
  {
    image: '/images/image-1.jpg',
    badge: 'Nature & Sérénité',
    badgeIcon: 'fa-leaf',
    title: 'Douceur & Backwaters',
    titleHighlight: 'du Kerala',
    description:
      'Naviguez sur les canaux paisibles du Kerala à bord d\'un Kettuvallam traditionnel entre plantations d\'épices et cocoteraies.'
  },
  {
    image: '/images/image-3.jpg',
    badge: 'Art Mughal',
    badgeIcon: 'fa-gem',
    title: 'Le Joyau du',
    titleHighlight: 'Taj Mahal',
    description:
      'Laissez-vous émerveiller par le marbre blanc d\'Agra et l\'architecture majestueuse des empereurs moghols.'
  },
  {
    image: '/images/image-4.jpg',
    badge: 'Terres Sauvages',
    badgeIcon: 'fa-feather-alt',
    title: 'Rann of Kutch &',
    titleHighlight: 'Gujarat',
    description:
      'Rencontrez les communautés artisanales et découvrez les immensités du désert de sel blanc du Gujarat.'
  },
  {
    image: '/images/image-11.jpg',
    badge: 'Service d\'Exception',
    badgeIcon: 'fa-user-shield',
    title: 'Chauffeur Privé &',
    titleHighlight: 'Guide Francophone',
    description:
      'Voyagez en toute sérénité avec un accompagnement d\'excellence et une assistance locale 24h/24.'
  }
];

const destinationCarouselData = [
  { name: 'Rajasthan', image: '/images/dest-rajasthan.jpg', link: '/destinations/rajasthan' },
  { name: 'Gujarat', image: '/images/dest-gujarat.jpg', link: '/destinations/gujarat' },
  { name: 'Karnataka', image: '/images/dest-karnataka.jpg', link: '/tours?search=Karnataka' },
  { name: 'Népal', image: '/images/dest-nepal.jpg', link: '/destinations/nepal' },
  { name: 'Orissa', image: '/images/dest-orissa.jpg', link: '/tours?search=Orissa' },
  { name: 'Ladakh', image: '/images/dest-ladakh.jpg', link: '/destinations/ladakh' },
  { name: 'Varanasi', image: '/images/dest-varanasi.jpg', link: '/destinations/varanasi' },
  { name: 'Kerala', image: '/images/dest-kerala.jpg', link: '/destinations/kerala' },
  { name: 'Taj Mahal & Agra', image: '/images/dest-tajmahal.jpg', link: '/tours?search=Agra' },
  { name: 'Himachal Pradesh', image: '/images/dest-himachal.jpg', link: '/tours?search=Himachal' },
  { name: 'Goa', image: '/images/dest-goa.jpg', link: '/tours?search=Goa' },
  { name: 'Jodhpur', image: '/images/dest-jodhpur.jpg', link: '/destinations/rajasthan' },
  { name: 'Amritsar & Punjab', image: '/images/image-8.jpg', link: '/tours?search=Amritsar' },
  { name: 'Bhoutan & Punakha', image: '/images/jaipur-travel.jpg', link: '/tours?region=bhoutan' },
  { name: 'Tamil Nadu', image: '/images/image-12.jpg', link: '/tours?search=Tamil' },
  { name: 'Rishikesh & Dharamsala', image: '/images/image-9.jpg', link: '/tours?search=Rishikesh' }
];

const popularToursData = [
  {
    title: 'Séjour au Rajasthan et Bénarès – Le Rajasthan et la rivière Gange',
    duration: '17 Jours / 16 Nuits',
    image: '/images/dest-rajasthan.jpg',
    location: 'Rajasthan & Rivière Gange',
    badge: 'Populaire',
    excerpt: 'Un voyage magique alliant la féerie des palais des Maharajas et la spiritualité profonde des cérémonies du Gange à Varanasi.',
    slug: 'sejour-au-rajasthan-et-benares'
  },
  {
    title: 'Voyage Inde du Nord – Amritsar, Dharamsala et Cachemire',
    duration: '18 Jours / 17 Nuits',
    image: '/images/dest-himachal.jpg',
    location: 'Amritsar, Dharamsala, Srinagar',
    badge: 'Incontournable',
    excerpt: 'Spiritualité sikhe, hauts plateaux de l\'Himalaya et lacs romantiques du Cachemire sur un Houseboat traditionnel.',
    slug: 'voyage-inde-du-nord-amritsar-dharamsala-cachemire'
  },
  {
    title: 'Circuit dans la Vallée de Spiti et du Kinnaur',
    duration: '18 Jours / 17 Nuits',
    image: '/images/dest-ladakh.jpg',
    location: 'Himalaya & Spiti Valley',
    badge: 'Hors Sentiers',
    excerpt: 'Route secrète de haute altitude, monastères millénaires et paysages lunaires de l\'Himalaya.',
    slug: 'circuit-vallee-de-spiti-et-kinnaur'
  },
  {
    title: 'Voyage spirituel en Inde : Delhi, Amritsar, Dharamsala et Rishikesh',
    duration: '12 Jours / 11 Nuits',
    image: '/images/image-8.jpg',
    location: 'Delhi, Amritsar, Dharamsala, Rishikesh',
    badge: 'Spirituel',
    excerpt: 'Une immersion spirituelle unique au Temple d\'Or d\'Amritsar, dans la résidence du Dalaï-Lama et la capitale mondiale du yoga.',
    slug: 'voyage-spirituel-en-inde'
  },
  {
    title: 'Séjour en Inde : Les Havélis et Palais du Rajasthan',
    duration: '13 Jours / 12 Nuits',
    image: '/images/image-12.jpg',
    location: 'Shekhawati, Jaisalmer, Udaipur',
    badge: 'Classique',
    excerpt: 'Le voyage idéal pour découvrir tous les trésors emblématiques du Rajasthan : havelis peints, citadelles désertiques et palais.',
    slug: 'sejour-en-inde-havelis-et-palais-du-rajasthan'
  },
  {
    title: 'Grand Tour du Gujarat & Désert de Sel',
    duration: '15 Jours / 14 Nuits',
    image: '/images/dest-gujarat.jpg',
    location: 'Gujarat & Rann of Kutch',
    badge: 'Authentique',
    excerpt: 'De l\'immensité blanche du Rann de Kutch aux temples sculptés d\'Adalaj, Modhera et communautés tribales.',
    slug: 'grand-tour-du-gujarat'
  }
];

const recentUpdatesData = [
  {
    title: 'Grand Tour du Gujarat',
    image: '/images/dest-gujarat.jpg',
    location: 'Circuit Vedette',
    icon: 'fa-star',
    excerpt: 'De l\'immensité blanche du Rann de Kutch aux temples sculptés d\'Adalaj et Modhera.',
    slug: 'grand-tour-du-gujarat'
  },
  {
    title: 'Spiti / Kinnaur Valley Circuit',
    image: '/images/dest-himachal.jpg',
    location: 'Himalaya Trans-himalayen',
    icon: 'fa-mountain',
    excerpt: 'Traversée spectaculaire des vallées reculées aux monastères bouddhistes millénaires.',
    slug: 'spiti-kinnaur-valley'
  },
  {
    title: 'Motorcycle tour in the Himalayas',
    image: '/images/dest-ladakh.jpg',
    location: 'Moto & Liberté',
    icon: 'fa-motorcycle',
    excerpt: 'Une aventure à moto légendaire Royal Enfield sur les plus hautes routes du monde.',
    slug: 'motorcycle-tour-himalayas'
  }
];

const regionCardsData = [
  {
    category: 'nord',
    title: 'Inde du Nord',
    image: '/images/image-9.jpg',
    link: '/destinations',
    desc: 'Le côtoiement des cultures par ses temples et ses mosquées. Les différents paysages, les provinces de l\'Himalaya avec ses glaciers scintillants...'
  },
  {
    category: 'sud',
    title: 'Inde du Sud',
    image: '/images/dest-kerala.jpg',
    link: '/destinations/kerala',
    desc: 'Traversée du Sud de l\'Inde de Chennai à Cochin. Au programme : les temples pyramidaux et colorés, l\'ancien comptoir français de Pondichéry...'
  },
  {
    category: 'rajasthan',
    title: 'Rajasthan',
    image: '/images/dest-rajasthan.jpg',
    link: '/destinations/rajasthan',
    desc: 'Le Rajasthan est le second État le plus touristique de l\'Inde. Découvrez les splendeurs du Rajasthan, ses puissantes forteresses et ses palais.'
  },
  {
    category: 'nord',
    title: 'Gujarat',
    image: '/images/dest-gujarat.jpg',
    link: '/destinations/gujarat',
    desc: 'Séjour au Rajasthan et Gujarat, Voyage au Gujarat, Circuit au Gujarat, Vacances Gujarat, Circuit des villages Gujarat.'
  },
  {
    category: 'sud',
    title: 'Karnataka',
    image: '/images/dest-karnataka.jpg',
    link: '/destinations',
    desc: 'Sa côte de sable blanc étincelant, les ruines saisissantes d\'Hampi et l\'opulence du palais de Mysore comptent parmi ses atouts.'
  },
  {
    category: 'ladakh',
    title: 'Ladakh',
    image: '/images/dest-ladakh.jpg',
    link: '/destinations/ladakh',
    desc: 'Ancien royaume bouddhiste situé sur les hauteurs de l\'Himalaya offrant quelques-uns des paysages les plus impressionnants de l\'Inde.'
  }
];

const testimonialsData = [
  {
    text: '« Notre voyage de 15 jours au Rajasthan avec Jodhpur Voyage a été tout simplement magique. Chauffeur ponctuel, voiture très confortable et des conseils d\'une valeur inestimable ! »',
    name: 'Jean-Marc & Sophie D.',
    trip: 'Circuit Rajasthan & Varanasi (Octobre)'
  },
  {
    text: '« Une organisation parfaite de A à Z. L\'équipe a su s\'adapter à toutes nos demandes de dernière minute. Nous repasserons par Jodhpur Voyage sans hésitation ! »',
    name: 'Claire & Antoine P.',
    trip: 'Voyage sur mesure au Népal'
  }
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState({ title: 'Circuit sur Mesure', duration: '' });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [dynamicTours, setDynamicTours] = useState([]);

  const carouselTrackRef = useRef(null);
  const navigate = useNavigate();

  const [dynamicDestinations, setDynamicDestinations] = useState([]);

  // Fetch dynamic tour packages and destinations from backend
  useEffect(() => {
    let isMounted = true;
    fetchTours()
      .then((res) => {
        if (!isMounted) return;
        const tourList = Array.isArray(res.data) ? res.data : (res.data?.tours || res.data?.data || []);
        if (tourList && tourList.length > 0) {
          setDynamicTours(tourList);
        }
      })
      .catch((err) => console.error('Erreur chargement circuits dynamiques:', err));

    fetchDestinations()
      .then((res) => {
        if (!isMounted) return;
        const destList = Array.isArray(res.data) ? res.data : [];
        if (destList && destList.length > 0) {
          setDynamicDestinations(destList);
        }
      })
      .catch((err) => console.error('Erreur chargement destinations dynamiques:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredDynamicTours = dynamicTours.filter((tour) => tour.featured === true && tour.published !== false);

  let displayPopularTours = [];
  if (dynamicTours.length > 0) {
    if (featuredDynamicTours.length >= 6) {
      displayPopularTours = featuredDynamicTours.slice(0, 6);
    } else {
      const otherPublished = dynamicTours.filter(
        (t) => t.published !== false && !featuredDynamicTours.some((ft) => (ft._id || ft.slug) === (t._id || t.slug))
      );
      displayPopularTours = [...featuredDynamicTours, ...otherPublished].slice(0, 6);
    }
  } else {
    displayPopularTours = popularToursData;
  }

  const displayRecentTours = dynamicTours.length > 6 ? dynamicTours.slice(6, 9) : (dynamicTours.length > 3 ? dynamicTours.slice(3, 6) : []);

  const displayCarouselData = dynamicDestinations.length > 0
    ? dynamicDestinations.map((d) => ({
        name: d.name || d.title,
        image: d.image || '/images/dest-rajasthan.jpg',
        link: d.customUrl || `/destinations/${d.slug}`
      }))
    : destinationCarouselData;

  // Hero auto-slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlidesData.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlidesData.length) % heroSlidesData.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlidesData.length);
  };

  const [isCarouselHovered, setIsCarouselHovered] = useState(false);

  const handleCarouselScroll = useCallback((direction) => {
    const container = carouselTrackRef.current;
    if (container) {
      const firstCard = container.querySelector('.destination-card');
      const scrollStep = firstCard ? firstCard.offsetWidth + 12 : 240;
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (direction === 'next') {
        if (container.scrollLeft >= maxScroll - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: scrollStep, behavior: 'smooth' });
        }
      } else {
        if (container.scrollLeft <= 10) {
          container.scrollTo({ left: maxScroll, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: -scrollStep, behavior: 'smooth' });
        }
      }
    }
  }, []);

  // Auto-slide destinations carousel one by one
  useEffect(() => {
    if (isCarouselHovered) return;
    const interval = setInterval(() => {
      handleCarouselScroll('next');
    }, 3200);

    return () => clearInterval(interval);
  }, [isCarouselHovered, handleCarouselScroll]);

  const handlePrevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
  };

  const handleNextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonialsData.length);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tours?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleOpenBookingModal = (tourTitle = 'Circuit sur Mesure', tourDuration = '') => {
    setSelectedTour({ title: tourTitle, duration: tourDuration });
    setModalOpen(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const displayRegionCards = dynamicDestinations.length > 0
    ? dynamicDestinations.map((d) => {
        const slug = (d.slug || '').toLowerCase();
        const reg = (d.region || '').toLowerCase();
        const nameLower = (d.name || d.title || '').toLowerCase();

        let category = 'nord';
        if (reg === 'nepal' || slug === 'nepal' || nameLower.includes('népal') || nameLower.includes('nepal')) {
          category = 'nepal';
        } else if (reg === 'bhoutan' || slug === 'bhoutan' || nameLower.includes('bhoutan')) {
          category = 'bhoutan';
        } else if (reg === 'gujarat' || slug === 'gujarat' || nameLower.includes('gujarat')) {
          category = 'gujarat';
        } else if (
          reg === 'ladakh' || 
          reg === 'himalaya' || 
          slug === 'ladakh' || 
          slug === 'dharamsala-himachal' || 
          slug === 'darjeeling-sikkim' || 
          nameLower.includes('ladakh') ||
          nameLower.includes('himalaya')
        ) {
          category = 'ladakh';
        } else if (
          slug === 'rajasthan' || 
          slug === 'jodhpur' || 
          reg === 'rajasthan' || 
          nameLower.includes('rajasthan')
        ) {
          category = 'rajasthan';
        } else if (
          reg === 'inde-du-sud' || 
          reg === 'sud' || 
          slug === 'kerala' || 
          slug === 'tamil-nadu' || 
          slug === 'karnataka' || 
          slug === 'goa' || 
          slug === 'orissa' ||
          nameLower.includes('kerala') ||
          nameLower.includes('tamil') ||
          nameLower.includes('karnataka')
        ) {
          category = 'sud';
        } else {
          category = 'nord';
        }

        return {
          id: d._id || slug,
          category,
          title: d.name || d.title,
          image: d.image || '/images/dest-rajasthan.jpg',
          link: d.customUrl || `/destinations/${slug}`,
          desc: d.shortDescription || d.tagline || d.excerpt || 'Découvrez cette magnifique destination avec Jodhpur Voyage.'
        };
      })
    : regionCardsData;

  const filteredRegions = displayRegionCards.filter((r) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'nord') return r.category === 'nord' || r.category === 'rajasthan';
    if (activeFilter === 'sud') return r.category === 'sud' || r.category === 'gujarat';
    return r.category === activeFilter;
  });

  return (
    <>
      <SEO pageKey="home" />
      {/* =========================================================================
          1. HERO SLIDER SECTION
          ========================================================================= */}
      <section className="hero-slider-section">
        <div className="hero-slider-wrapper">
          {heroSlidesData.map((slide, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            >
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="hero-slide-bg" 
                onError={(e) => { e.currentTarget.src = '/images/dest-rajasthan.jpg'; }}
              />
              <div className="hero-slide-overlay"></div>
              <div className="container hero-slide-content">
                <span className="hero-badge">
                  <i className={`fas ${slide.badgeIcon}`}></i> {slide.badge}
                </span>
                <h1 className="hero-title">
                  {slide.title} <span>{slide.titleHighlight}</span>
                </h1>
                <p className="hero-description">{slide.description}</p>

                {/* Hero Search Box */}
                <form onSubmit={handleSearchSubmit} className="hero-search-box-container hero-inspired-search">
                  <div className="inspired-search-bar">
                    <i className="fas fa-search search-icon"></i>
                    <input
                      type="text"
                      className="hero-search-input"
                      placeholder="Laissez-vous inspirer (ex: Rajasthan, Taj Mahal, Népal...)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoComplete="off"
                    />
                    <button type="submit" className="inspired-search-btn">
                      <span>Rechercher</span> <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>

                </form>
              </div>
            </div>
          ))}
        </div>

        {/* Slider Controls */}
        <div className="hero-controls">
          <button className="hero-arrow hero-prev" onClick={handlePrevSlide} aria-label="Slide précédent">
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="hero-dots">
            {heroSlidesData.map((_, idx) => (
              <span
                key={idx}
                className={`hero-dot ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
              ></span>
            ))}
          </div>
          <button className="hero-arrow hero-next" onClick={handleNextSlide} aria-label="Slide suivant">
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </section>

      {/* =========================================================================
          2. DESTINATIONS CAROUSEL TRACK
          ========================================================================= */}
      <section className="destinations-section">
        <div className="container">
          <div className="carousel-header-controls">
            <div>
              <span className="section-subtitle">Explorer</span>
              <h2 className="section-title">Destinations Populaires</h2>
            </div>
            <div className="carousel-arrows">
              <button
                className="carousel-btn carousel-prev"
                onClick={() => handleCarouselScroll('prev')}
                aria-label="Précédent"
              >
                <i className="fas fa-arrow-left"></i>
              </button>
              <button
                className="carousel-btn carousel-next"
                onClick={() => handleCarouselScroll('next')}
                aria-label="Suivant"
              >
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>

          <div 
            className="destinations-carousel-container" 
            ref={carouselTrackRef}
            onMouseEnter={() => setIsCarouselHovered(true)}
            onMouseLeave={() => setIsCarouselHovered(false)}
          >
            <div className="destinations-track">
              {displayCarouselData.map((dest, idx) => (
                <Link key={idx} to={dest.link} className="destination-card">
                  <img 
                    src={dest.image || '/images/dest-rajasthan.jpg'} 
                    alt={dest.name} 
                    onError={(e) => { e.currentTarget.src = '/images/dest-rajasthan.jpg'; }}
                  />
                  <div className="destination-card-overlay">
                    <h3 className="destination-card-title">{dest.name}</h3>
                    <span className="destination-card-link">
                      Découvrir <i className="fas fa-arrow-right"></i>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. WELCOME SECTION (JODHPUR VOYAGE INTRO)
          ========================================================================= */}
      <section className="welcome-section">
        <div className="container welcome-grid">
          <div className="welcome-content">
            <div className="welcome-content-tag">
              <span className="tag-icon">🙏</span>
              <span className="tag-text">Namasté !!!</span>
            </div>

            <h2 className="welcome-title">
              Bonjour dans le langage Hindi.<br />
              <span className="title-highlight">Bienvenus sur notre site.</span>
            </h2>

            <div className="welcome-lead-banner">
              <i className="fas fa-gem"></i>
              <span>Agence locale franco-indienne basée au Rajasthan – INDE</span>
            </div>

            <div className="welcome-text">
              <p className="lead-p">
                Experts dans le tourisme avec une parfaite connaissance du pays, nous souhaitons vous faire découvrir l'Inde : un pays mystérieux et paradoxal par sa culture, sa diversité, la coexistence entre ses multiples religions avec ses 330 millions de dieux et de déesses et sa philosophie. Un système de castes, classement dans la société, ainsi que les différentes langues et dialectes. Et bien sûr ses paysages très variés : plaines, déserts, montagnes et mers.
              </p>
              <p>
                <strong>Jodhpur Voyage</strong> est une agence spécialisée vers l'Inde et le Népal, enregistrée au ministère du tourisme du Rajasthan. Disponible, réactive et à l'écoute de toutes les demandes des voyageurs, notre équipe vous proposera des forfaits de voyages sur-mesure et élaborera les meilleurs circuits, y compris hors des sentiers battus, pour réaliser vos plus beaux rêves.
              </p>
            </div>

            <div className="welcome-highlights">
              <div className="welcome-feature-card">
                <div className="feature-icon-wrapper">
                  <i className="fas fa-car-side"></i>
                </div>
                <div className="feature-info">
                  <h4>Chauffeurs Privés</h4>
                  <p>Expérimentés & Attentionnés</p>
                </div>
              </div>

              <div className="welcome-feature-card">
                <div className="feature-icon-wrapper">
                  <i className="fas fa-user-tie"></i>
                </div>
                <div className="feature-info">
                  <h4>Guides Francophones</h4>
                  <p>Locaux & Passionnés</p>
                </div>
              </div>

              <div className="welcome-feature-card">
                <div className="feature-icon-wrapper">
                  <i className="fas fa-headset"></i>
                </div>
                <div className="feature-info">
                  <h4>Assistance 24/7</h4>
                  <p>Disponibilité constante en Inde</p>
                </div>
              </div>

              <div className="welcome-feature-card">
                <div className="feature-icon-wrapper">
                  <i className="fas fa-sliders-h"></i>
                </div>
                <div className="feature-info">
                  <h4>100% Sur Mesure</h4>
                  <p>Circuits adaptés à vos envies</p>
                </div>
              </div>
            </div>

            <div className="welcome-actions">
              <Link to="/qui-sommes-nous" className="btn btn-primary btn-lg">
                En savoir plus sur nous <i className="fas fa-arrow-right"></i>
              </Link>
              <Link to="/voyage-sur-mesure" className="btn btn-outline-dark btn-lg">
                <i className="far fa-paper-plane"></i> Planifier mon voyage
              </Link>
            </div>
          </div>

          <div className="welcome-collage-wrap">
            <div className="welcome-collage">
              <div className="collage-main-frame">
                <img src="/images/image-12.jpg" alt="Rajasthan Architecture" className="collage-img-main" />
                <div className="collage-img-overlay"></div>
              </div>

              <div className="collage-secondary-frame">
                <img src="/images/image-8.jpg" alt="Ganges Culture" className="collage-img-secondary" />
              </div>

              <div className="collage-badge-experience">
                <div className="collage-badge-number">20+</div>
                <div className="badge-info-wrap">
                  <div className="collage-badge-text">Ans d'Expérience</div>
                  <div className="badge-subtext">en Inde & Népal</div>
                </div>
              </div>

              <div className="collage-badge-floating-tag">
                <i className="fas fa-award"></i>
                <span>Créateur d'Expériences</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. POPULAR TOURS
          ========================================================================= */}
      <section className="tours-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Circuits Incontournables</span>
            <h2 className="section-title">Nos vacances les plus populaires</h2>
            <p className="section-description">Des itinéraires soigneusement conçus pour vivre le meilleur de l'Inde et du Népal.</p>
          </div>

          {displayPopularTours.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B', background: '#F8FAFC', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
              <i className="fas fa-compass" style={{ fontSize: '2rem', marginBottom: '12px', color: '#94A3B8' }}></i>
              <p style={{ margin: 0, fontWeight: 500, fontSize: '0.95rem' }}>Aucun circuit mis en avant sur la page d'accueil pour le moment.</p>
            </div>
          ) : (
            <div className="tours-grid">
              {displayPopularTours.map((tour, idx) => {
                const tourSlug = tour.slug || tour.customUrl || tour._id;
                const tourImage = tour.image || '/images/image-6.jpg';
                const tourBadge = tour.badge || 'Populaire';
                const tourDuration = tour.duration || '14 Jours / 13 Nuits';
                const tourLocation = tour.location || tour.region || 'Rajasthan';
                const tourTitle = tour.title || 'Circuit sur Mesure';
                const tourExcerpt = tour.excerpt || tour.subtitle || (tour.overview ? tour.overview.replace(/<[^>]*>?/gm, '').slice(0, 140) + '...' : 'Découvrez cet itinéraire unique...');

                return (
                  <div key={tour._id || tourSlug || idx} className="tour-card">
                    <Link to={`/${tourSlug}`} className="tour-card-image-wrap" title="Voir l'itinéraire">
                      <img 
                        src={tourImage} 
                        alt={tourTitle} 
                        onError={(e) => { e.currentTarget.src = '/images/dest-rajasthan.jpg'; }}
                      />
                      <span className="tour-card-badge">{tourBadge}</span>
                      <div className="tour-card-duration">
                        <i className="far fa-clock"></i> {tourDuration}
                      </div>
                    </Link>
                    <div className="tour-card-body">
                      <div className="tour-card-location">
                        <i className="fas fa-map-marker-alt"></i> {tourLocation}
                      </div>
                      <h3 className="tour-card-title">
                        <Link to={`/${tourSlug}`}>{tourTitle}</Link>
                      </h3>
                      <p className="tour-card-excerpt">{tourExcerpt}</p>
                      <div className="tour-card-footer">
                        <span style={{ fontSize: '0.84rem', color: 'var(--primary-color)', fontWeight: '600' }}>
                          <i className="fas fa-compass" style={{ marginRight: '5px' }}></i> Circuit 100% Personnalisable
                        </span>
                        <Link to={`/${tourSlug}`} className="btn btn-sm btn-outline">
                          En savoir +
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          5. DESTINATIONS EN INDE (EDITORIAL GRID)
          ========================================================================= */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Variété de paysages</span>
            <h2 className="section-title">Destinations en Inde</h2>
            <p className="section-description">Du désert majestueux aux montagnes sacrées de l'Himalaya.</p>
          </div>

          <div className="editorial-grid">
            <div className="editorial-card grid-col-8">
              <img 
                src="/images/image-9.jpg" 
                alt="Rajasthan Grid" 
                onError={(e) => { e.currentTarget.src = '/images/dest-rajasthan.jpg'; }}
              />
              <div className="editorial-card-overlay">
                <h3 className="editorial-card-title">Rajasthan</h3>
                <p className="editorial-card-text">Terre des forts et des Maharajas</p>
              </div>
            </div>

            <div className="editorial-card grid-col-4">
              <img 
                src="/images/dest-gujarat.jpg" 
                alt="Gujarat Grid" 
                onError={(e) => { e.currentTarget.src = '/images/dest-rajasthan.jpg'; }}
              />
              <div className="editorial-card-overlay">
                <h3 className="editorial-card-title">Gujarat</h3>
                <p className="editorial-card-text">Architecture & Faune sauvage</p>
              </div>
            </div>

            <div className="editorial-card grid-col-4">
              <img 
                src="/images/dest-karnataka.jpg" 
                alt="Karnataka Grid" 
                onError={(e) => { e.currentTarget.src = '/images/dest-rajasthan.jpg'; }}
              />
              <div className="editorial-card-overlay">
                <h3 className="editorial-card-title">Karnataka</h3>
                <p className="editorial-card-text">Temples royaux de Hampi</p>
              </div>
            </div>

            <div className="editorial-card grid-col-4">
              <img 
                src="/images/dest-ladakh.jpg" 
                alt="Ladakh Grid" 
                onError={(e) => { e.currentTarget.src = '/images/dest-rajasthan.jpg'; }}
              />
              <div className="editorial-card-overlay">
                <h3 className="editorial-card-title">Ladakh</h3>
                <p className="editorial-card-text">Le Petit Tibet indien</p>
              </div>
            </div>

            <div className="editorial-card grid-col-4">
              <img 
                src="/images/dest-kerala.jpg" 
                alt="Inde du Sud Grid" 
                onError={(e) => { e.currentTarget.src = '/images/dest-rajasthan.jpg'; }}
              />
              <div className="editorial-card-overlay">
                <h3 className="editorial-card-title">Inde du Sud</h3>
                <p className="editorial-card-text">Kerala, Backwaters & Épices</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. MISES À JOUR RÉCENTES & FEATURED TRAVEL
          ========================================================================= */}
      <section className="section-padding bg-cream">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Nouveautés</span>
            <h2 className="section-title">Mises à jour récentes</h2>
            <p className="section-description">Découvrez nos derniers programmes de voyage et circuits thématiques.</p>
          </div>

          {displayRecentTours.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B', background: '#F8FAFC', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
              <i className="fas fa-layer-group" style={{ fontSize: '2rem', marginBottom: '12px', color: '#94A3B8' }}></i>
              <p style={{ margin: 0, fontWeight: 500, fontSize: '0.95rem' }}>Aucune nouveauté mise en avant pour le moment.</p>
            </div>
          ) : (
            <div className="tours-grid">
              {displayRecentTours.map((item, idx) => {
                const itemSlug = item.slug || item.customUrl || item._id;
                const itemImage = item.image || '/images/dest-gujarat.jpg';
                const itemLocation = item.location || item.region || 'Circuit Vedette';
                const itemIcon = item.icon || 'fa-star';
                const itemTitle = item.title || 'Circuit Spécial';
                const itemExcerpt = item.excerpt || item.subtitle || (item.overview ? item.overview.replace(/<[^>]*>?/gm, '').slice(0, 120) + '...' : '');

                return (
                  <div key={item._id || itemSlug || idx} className="tour-card">
                    <Link to={`/${itemSlug}`} className="tour-card-image-wrap" title="Voir l'itinéraire">
                      <img 
                        src={itemImage} 
                        alt={itemTitle} 
                        onError={(e) => { e.currentTarget.src = '/images/dest-gujarat.jpg'; }}
                      />
                    </Link>
                    <div className="tour-card-body">
                      <div className="tour-card-location">
                        <i className={`fas ${itemIcon}`}></i> {itemLocation}
                      </div>
                      <h3 className="tour-card-title">
                        <Link to={`/${itemSlug}`}>{itemTitle}</Link>
                      </h3>
                      <p className="tour-card-excerpt">{itemExcerpt}</p>
                      <Link to={`/${itemSlug}`} className="btn btn-sm btn-outline tour-card-btn">
                        En savoir +
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          7. BLOG FEATURE SECTION
          ========================================================================= */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Récits & Conseils</span>
            <h2 className="section-title">Notre Blog de Voyage</h2>
          </div>

          <div className="home-blog-grid">
            <div className="editorial-card blog-featured-card">
              <img src="/images/Voyage-Jaisalmer.jpg" alt="Jaisalmer ville doree" />
              <div className="editorial-card-overlay">
                <span className="badge badge-primary blog-featured-badge">Article Vedette</span>
                <h3 className="editorial-card-title">Jaisalmer, la ville dorée</h3>
                <p className="blog-featured-text">
                  Plongez dans la magie des ruelles en grès jaune et de la citadelle vivante du désert.
                </p>
                <Link to="/blog/jaisalmer-la-ville-doree-du-rajasthan" className="btn btn-sm btn-primary blog-featured-btn">
                  Lire l'article
                </Link>
              </div>
            </div>

            <div className="tour-card">
              <div className="tour-card-image-wrap tour-card-image-sm">
                <img src="/images/image-8.jpg" alt="Varanasi Blog" />
              </div>
              <div className="tour-card-body">
                <div className="mega-blog-meta">Spiritualité</div>
                <h3 className="tour-card-title tour-card-title-sm">
                  Comprendre la cérémonie de l'Aarti à Varanasi
                </h3>
                <Link to="/blog/comprendre-la-ceremonie-de-laarti-a-varanasi" className="btn btn-sm btn-outline mt-auto">
                  En savoir +
                </Link>
              </div>
            </div>

            <div className="tour-card">
              <div className="tour-card-image-wrap tour-card-image-sm">
                <img src="/images/slide8-300x176.jpg" alt="Nepal Blog" />
              </div>
              <div className="tour-card-body">
                <div className="mega-blog-meta">Conseils Pratiques</div>
                <h3 className="tour-card-title tour-card-title-sm">
                  Comment préparer son premier voyage en Inde
                </h3>
                <Link to="/blog/comment-preparer-son-premier-voyage-en-inde" className="btn btn-sm btn-outline mt-auto">
                  En savoir +
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. TESTIMONIALS SECTION
          ========================================================================= */}
      <section className="testimonials-section">
        <div className="container testimonial-container">
          <div className="quote-icon">
            <i className="fas fa-quote-left"></i>
          </div>

          <div className="testimonial-slider">
            {testimonialsData.map((testi, idx) => (
              <div
                key={idx}
                className={`testimonial-item ${idx === currentTestimonial ? 'active' : ''}`}
              >
                <p className="testimonial-text">{testi.text}</p>
                <div className="testimonial-author">
                  <div className="author-info">
                    <div className="author-name">{testi.name}</div>
                    <div className="author-trip">{testi.trip}</div>
                    <div className="rating-stars">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="testimonial-controls">
            <button className="carousel-btn testimonial-prev" onClick={handlePrevTestimonial} aria-label="Précédent">
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="carousel-btn testimonial-next" onClick={handleNextTestimonial} aria-label="Suivant">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. REGIONS DIRECTORY & INTERACTIVE FILTER TABS
          ========================================================================= */}
      <section className="section-padding bg-cream">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Guide des Régions</span>
            <h2 className="section-title">Découvrez l'Inde & Népal</h2>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="filter-tabs">
            <button
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              Tous Les Circuits
            </button>
            <button
              className={`filter-btn ${activeFilter === 'nord' ? 'active' : ''}`}
              onClick={() => setActiveFilter('nord')}
            >
              Inde du Nord
            </button>
            <button
              className={`filter-btn ${activeFilter === 'sud' ? 'active' : ''}`}
              onClick={() => setActiveFilter('sud')}
            >
              Inde du Sud
            </button>
            <button
              className={`filter-btn ${activeFilter === 'nepal' ? 'active' : ''}`}
              onClick={() => setActiveFilter('nepal')}
            >
              Népal
            </button>
            <button
              className={`filter-btn ${activeFilter === 'bhoutan' ? 'active' : ''}`}
              onClick={() => setActiveFilter('bhoutan')}
            >
              Bhoutan
            </button>
          </div>

          <div className="editorial-grid">
            {filteredRegions.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px', color: '#64748B', background: '#FFFFFF', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
                <i className="fas fa-map-marked-alt" style={{ fontSize: '2rem', marginBottom: '12px', color: '#94A3B8' }}></i>
                <p style={{ margin: 0, fontWeight: 500, fontSize: '0.95rem' }}>Aucune destination dans cette catégorie pour le moment.</p>
              </div>
            ) : (
              filteredRegions.map((region, idx) => (
                <Link 
                  key={region.id || idx} 
                  to={region.link} 
                  className="editorial-card grid-col-4 region-card"
                  style={{ textDecoration: 'none' }}
                >
                  <img 
                    src={region.image || '/images/dest-rajasthan.jpg'} 
                    alt={region.title} 
                    onError={(e) => { e.currentTarget.src = '/images/dest-rajasthan.jpg'; }}
                  />
                  <div className="editorial-card-overlay">
                    <h3 className="editorial-card-title region-card-title">{region.title}</h3>
                    <span className="destination-card-link">
                      Découvrir <i className="fas fa-arrow-right"></i>
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          10. CALL TO ACTION BANNER
          ========================================================================= */}
      <section className="cta-banner-section">
        <img src="/images/image-9.jpg" alt="CTA Background" className="cta-bg-image" />
        <div className="container cta-content">
          <h2 className="cta-title">Votre voyage en Inde commence ici</h2>
          <p className="cta-description">
            Contactez nos experts locaux dès aujourd'hui pour concevoir le voyage sur mesure de vos rêves.
          </p>
          <div className="cta-buttons">
            <Link to="/voyage-sur-mesure" className="btn btn-primary btn-lg">
              Voyage sur mesure
            </Link>
            <Link to="/contact" className="btn btn-secondary btn-lg">
              Contactez Nous
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          11. FLOATING WIDGETS
          ========================================================================= */}
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

      {/* =========================================================================
          12. PACKAGE BOOKING MODAL
          ========================================================================= */}
      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        tourTitle={selectedTour.title}
        tourDuration={selectedTour.duration}
      />
    </>
  );
};

export default Home;
