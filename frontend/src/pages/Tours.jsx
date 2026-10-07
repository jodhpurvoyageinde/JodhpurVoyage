import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { fetchTours, fetchDestinations } from '../services/api';
import BookingModal from '../components/BookingModal';
import SEO from '../components/SEO';

const CATEGORY_META = {
  'inde-du-nord': {
    title: 'Circuits & Voyages en Inde du Nord',
    desc: 'Découvrez nos itinéraires phares en Inde du Nord : du Rajasthan royal à Varanasi, en passant par le Cachemire, Spiti, Amritsar et les contreforts de l’Himalaya.',
    badge: 'Inde du Nord',
    bg: '/images/dest-himachal.jpg'
  },
  'rajasthan': {
    title: 'Circuits au Rajasthan & Cités Royales',
    desc: 'Explorez la terre des Maharajas, les forteresses millénaires de Jodhpur et Jaipur, et le désert magique du Thar.',
    badge: 'Rajasthan',
    bg: '/images/dest-rajasthan.jpg'
  },
  'inde-du-sud': {
    title: 'Circuits en Inde du Sud & Kerala',
    desc: 'Croisières en Houseboat sur les Backwaters, temples millénaires du Tamil Nadu et plantations d’épices.',
    badge: 'Inde du Sud',
    bg: '/images/dest-kerala.jpg'
  },
  'ladakh': {
    title: 'Circuits en Himalaya & Ladakh',
    desc: 'Le Petit Tibet, monastères perchés, cols vertigineux et paysages lunaires grandioses.',
    badge: 'Himalaya & Ladakh',
    bg: '/images/dest-ladakh.jpg'
  },
  'gujarat': {
    title: 'Circuits au Gujarat & Faune Sauvage',
    desc: 'Le désert blanc du Rann de Kutch, les derniers lions d’Asie sauvages et les temples sacrés de Palitana.',
    badge: 'Gujarat',
    bg: '/images/dest-gujarat.jpg'
  },
  'nepal': {
    title: 'Voyages au Népal & Cités Royales',
    desc: 'Katmandou, la vallée de Pokhara face aux Annapurnas et les safaris dans la jungle de Chitwan.',
    badge: 'Népal',
    bg: '/images/dest-nepal.jpg'
  },
  'bhoutan': {
    title: 'Circuits & Voyages au Bhoutan & Punakha',
    desc: 'Le Royaume du Dragon du Tonnerre, la majestueuse forteresse de Punakha Dzong, la capitale Thimphu et le Nid du Tigre à Paro.',
    badge: 'Bhoutan',
    bg: '/images/jaipur-travel.jpg'
  }
};

const PRESET_CITIES = [
  { slug: 'jodhpur', label: 'Jodhpur (Cité Bleue)' },
  { slug: 'jaipur', label: 'Jaipur (Cité Rose)' },
  { slug: 'udaipur', label: 'Udaipur (Cité des Lacs)' },
  { slug: 'jaisalmer', label: 'Jaisalmer (Désert du Thar)' },
  { slug: 'varanasi', label: 'Varanasi / Bénarès' },
  { slug: 'delhi', label: 'Delhi' },
  { slug: 'agra', label: 'Agra (Taj Mahal)' },
  { slug: 'amritsar', label: 'Amritsar (Temple d\'Or)' },
  { slug: 'dharamsala', label: 'Dharamsala' },
  { slug: 'rishikesh', label: 'Rishikesh' },
  { slug: 'ladakh', label: 'Leh / Ladakh' },
  { slug: 'kerala', label: 'Kerala / Cochin' },
  { slug: 'kathmandu', label: 'Katmandou (Népal)' },
  { slug: 'punakha', label: 'Punakha (Bhoutan)' },
  { slug: 'kutch', label: 'Rann de Kutch (Gujarat)' }
];

const Tours = () => {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlRegion = category || searchParams.get('region') || searchParams.get('category') || 'all';
  const urlCity = searchParams.get('city') || searchParams.get('destination') || 'all';
  const urlSearch = searchParams.get('search') || searchParams.get('q') || '';
  
  const [activeRegion, setActiveRegion] = useState(urlRegion);
  const [activeCity, setActiveCity] = useState(urlCity);
  const [destinationsList, setDestinationsList] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(urlSearch);
  const [selectedTour, setSelectedTour] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  // Fetch available destinations/cities from API
  useEffect(() => {
    fetchDestinations()
      .then((res) => {
        if (Array.isArray(res.data)) {
          setDestinationsList(res.data);
        }
      })
      .catch((err) => console.error('Erreur chargement villes:', err));
  }, []);

  // Sync state if URL param changes
  useEffect(() => {
    const q = searchParams.get('search') || searchParams.get('q') || '';
    setSearch(q);

    if (category) {
      setActiveRegion(category);
    } else if (searchParams.get('region')) {
      setActiveRegion(searchParams.get('region'));
    } else {
      setActiveRegion('all');
    }

    const c = searchParams.get('city') || searchParams.get('destination') || 'all';
    setActiveCity(c);
  }, [category, searchParams]);

  useEffect(() => {
    setLoading(true);
    fetchTours({ region: activeRegion, city: activeCity, search: search })
      .then((res) => {
        setTours(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [activeRegion, activeCity, search]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeRegion, activeCity, search]);

  const filteredTours = tours.filter((tour) => {
    // Region category check
    if (activeRegion && activeRegion !== 'all') {
      const regNorm = activeRegion.toLowerCase();
      const tourReg = (tour.region || tour.category || tour.location || '').toLowerCase();
      const tourTitle = (tour.title || '').toLowerCase();
      const tourExcerpt = (tour.subtitle || tour.excerpt || tour.overview || '').toLowerCase();

      let matchRegion = false;
      if (regNorm === 'inde-du-nord' || regNorm === 'nord') {
        matchRegion = tourReg.includes('nord') || tourReg.includes('rajasthan') || tourReg.includes('delhi') || tourReg.includes('varanasi') || tourReg.includes('amritsar') || tourReg.includes('dharamsala') || tourReg.includes('rishikesh') || tourReg.includes('ladakh') || tourReg.includes('himachal') || tourReg.includes('punjab') || tourTitle.includes('nord') || tourTitle.includes('rajasthan');
      } else if (regNorm === 'inde-du-sud' || regNorm === 'sud') {
        matchRegion = tourReg.includes('sud') || tourReg.includes('kerala') || tourReg.includes('tamil') || tourReg.includes('karnataka') || tourReg.includes('gujarat') || tourReg.includes('goa') || tourReg.includes('orissa') || tourTitle.includes('sud') || tourTitle.includes('kerala');
      } else if (regNorm === 'rajasthan') {
        matchRegion = tourReg.includes('rajasthan') || tourTitle.includes('rajasthan') || tourExcerpt.includes('rajasthan');
      } else if (regNorm === 'ladakh' || regNorm === 'himalaya') {
        matchRegion = tourReg.includes('ladakh') || tourReg.includes('himalaya') || tourReg.includes('spiti') || tourTitle.includes('ladakh') || tourTitle.includes('himalaya');
      } else if (regNorm === 'gujarat') {
        matchRegion = tourReg.includes('gujarat') || tourTitle.includes('gujarat');
      } else if (regNorm === 'nepal') {
        matchRegion = tourReg.includes('nepal') || tourReg.includes('népal') || tourTitle.includes('nepal') || tourTitle.includes('népal');
      } else if (regNorm === 'bhoutan') {
        matchRegion = tourReg.includes('bhoutan') || tourTitle.includes('bhoutan');
      } else {
        matchRegion = tourReg.includes(regNorm) || tourTitle.includes(regNorm);
      }
      if (!matchRegion) return false;
    }

    // City filter check (matches connected cities array & tags)
    if (activeCity && activeCity !== 'all') {
      const cityTerm = activeCity.toLowerCase().replace(/-/g, ' ');
      const matchCities = Array.isArray(tour.cities) && tour.cities.some(c => 
        (c.name || '').toLowerCase().includes(cityTerm) ||
        (c.slug || '').toLowerCase() === activeCity.toLowerCase()
      );
      const matchLoc = tour.location?.toLowerCase().includes(cityTerm);
      const matchTitle = tour.title?.toLowerCase().includes(cityTerm);
      const matchCat = tour.category?.toLowerCase().includes(cityTerm) || tour.region?.toLowerCase().includes(cityTerm);
      const matchOverview = tour.overview?.toLowerCase().includes(cityTerm) || tour.subtitle?.toLowerCase().includes(cityTerm);
      const matchHighlights = Array.isArray(tour.highlights) && tour.highlights.some(h => typeof h === 'string' && h.toLowerCase().includes(cityTerm));
      const matchItinerary = Array.isArray(tour.itinerary) && tour.itinerary.some(day => 
        day.title?.toLowerCase().includes(cityTerm) || day.description?.toLowerCase().includes(cityTerm)
      );
      if (!matchCities && !matchLoc && !matchTitle && !matchCat && !matchOverview && !matchHighlights && !matchItinerary) {
        return false;
      }
    }

    // Search query check
    if (!search || !search.trim()) return true;
    const term = search.trim().toLowerCase();
    const matchTitle = tour.title?.toLowerCase().includes(term);
    const matchSubtitle = tour.subtitle?.toLowerCase().includes(term) || tour.excerpt?.toLowerCase().includes(term);
    const matchOverview = tour.overview?.toLowerCase().includes(term) || tour.content?.toLowerCase().includes(term);
    const matchLocation = tour.location?.toLowerCase().includes(term) || tour.region?.toLowerCase().includes(term);
    const matchTheme = tour.theme?.toLowerCase().includes(term);
    const matchBadge = tour.badge?.toLowerCase().includes(term);
    const matchHighlights = Array.isArray(tour.highlights) && tour.highlights.some(h => typeof h === 'string' && h.toLowerCase().includes(term));
    const matchItinerary = Array.isArray(tour.itinerary) && tour.itinerary.some(day => 
      day.title?.toLowerCase().includes(term) || day.description?.toLowerCase().includes(term)
    );
    return matchTitle || matchSubtitle || matchOverview || matchLocation || matchTheme || matchBadge || matchHighlights || matchItinerary;
  });

  const totalPages = Math.ceil(filteredTours.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredTours.length);
  const currentTours = filteredTours.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      const section = document.getElementById('tours-listing-section');
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

  const handleOpenBooking = (tour) => {
    setSelectedTour(tour);
    setIsBookingOpen(true);
  };

  const updateUrlParams = (regionVal, cityVal, searchVal) => {
    const params = {};
    if (regionVal && regionVal !== 'all') params.region = regionVal;
    if (cityVal && cityVal !== 'all') params.city = cityVal;
    if (searchVal && searchVal.trim()) params.search = searchVal.trim();
    setSearchParams(params);
  };

  const handleRegionChange = (newRegion) => {
    setActiveRegion(newRegion);
    updateUrlParams(newRegion, activeCity, search);
  };

  const handleCityChange = (newCity) => {
    setActiveCity(newCity);
    updateUrlParams(activeRegion, newCity, search);
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    updateUrlParams(activeRegion, activeCity, val);
  };

  const clearCity = () => {
    handleCityChange('all');
  };

  const clearSearch = () => {
    setSearch('');
    updateUrlParams(activeRegion, activeCity, '');
  };

  const clearAllFilters = () => {
    setActiveRegion('all');
    setActiveCity('all');
    setSearch('');
    setSearchParams({});
  };

  // Build combined city list for dropdown
  const combinedCityOptions = [...PRESET_CITIES];
  destinationsList.forEach((d) => {
    const slug = d.slug || (d.name ? d.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-') : '');
    if (slug && !combinedCityOptions.some(c => c.slug === slug)) {
      combinedCityOptions.push({ slug: slug, label: d.name || d.title });
    }
  });

  let currentMeta = CATEGORY_META[activeRegion] || {
    title: 'Nos Offres de Voyage en Inde & Népal',
    desc: 'Consultez nos itinéraires recommandés avec chauffeur privé ou demandez-nous une personnalisation totale de votre séjour.',
    badge: 'Circuits Thématiques',
    bg: '/images/dest-rajasthan.jpg'
  };

  if (activeCity && activeCity !== 'all') {
    const foundCity = combinedCityOptions.find(c => c.slug === activeCity)?.label || activeCity;
    currentMeta = {
      title: `Circuits & Voyages à ${foundCity}`,
      desc: `Découvrez tous nos circuits et forfaits de voyage passant par ${foundCity} avec chauffeur privé et guide local.`,
      badge: `Ville : ${foundCity}`,
      bg: currentMeta.bg
    };
  } else if (search && search.trim()) {
    currentMeta = {
      title: `Circuits & Voyages : ${search.trim()}`,
      desc: `Itinéraires sélectionnés passant par ${search.trim()} avec chauffeur privé et assistance locale francophone.`,
      badge: `Destination : ${search.trim()}`,
      bg: currentMeta.bg
    };
  }

  const hasActiveFilters = (activeRegion !== 'all') || (activeCity !== 'all') || (search && search.trim());

  return (
    <div>
      <SEO 
        pageKey={!hasActiveFilters ? "tours" : undefined}
        title={hasActiveFilters ? `${currentMeta.title} | Jodhpur Voyage` : undefined}
        description={hasActiveFilters ? currentMeta.desc : undefined}
        keywords={hasActiveFilters ? `${currentMeta.title.toLowerCase()}, circuit inde, voyage sur mesure inde` : undefined}
      />
      {/* Hero Banner */}
      <section className="reviews-hero-section">
        <img src={currentMeta.bg} alt={currentMeta.title} className="reviews-hero-bg" />
        <div className="container reviews-hero-content">
          <span className="hero-badge"><i className="fas fa-route"></i> {currentMeta.badge}</span>
          <h1 className="reviews-hero-title">{currentMeta.title}</h1>
          <p className="reviews-hero-desc">
            {currentMeta.desc}
          </p>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="tours-filter-section">
        <div className="container">
          <div className="tours-filter-card">
            <div className="tours-filter-main">
              {/* Category Region Filter Chips */}
              <div className="tours-chips-wrapper">
                <button
                  className={`tours-chip ${activeRegion === 'all' && activeCity === 'all' && !search ? 'active' : ''}`}
                  onClick={() => handleRegionChange('all')}
                >
                  Tous les circuits
                  <span className="tours-chip-count">{filteredTours.length}</span>
                </button>

                <button
                  className={`tours-chip ${activeRegion === 'inde-du-nord' ? 'active' : ''}`}
                  onClick={() => handleRegionChange('inde-du-nord')}
                >
                  Inde du Nord
                </button>

                <button
                  className={`tours-chip ${activeRegion === 'rajasthan' ? 'active' : ''}`}
                  onClick={() => handleRegionChange('rajasthan')}
                >
                  Rajasthan
                </button>

                <button
                  className={`tours-chip ${activeRegion === 'inde-du-sud' ? 'active' : ''}`}
                  onClick={() => handleRegionChange('inde-du-sud')}
                >
                  Inde du Sud & Kerala
                </button>

                <button
                  className={`tours-chip ${activeRegion === 'ladakh' ? 'active' : ''}`}
                  onClick={() => handleRegionChange('ladakh')}
                >
                  Himalaya & Ladakh
                </button>

                <button
                  className={`tours-chip ${activeRegion === 'gujarat' ? 'active' : ''}`}
                  onClick={() => handleRegionChange('gujarat')}
                >
                  Gujarat
                </button>

                <button
                  className={`tours-chip ${activeRegion === 'nepal' ? 'active' : ''}`}
                  onClick={() => handleRegionChange('nepal')}
                >
                  Népal
                </button>

                <button
                  className={`tours-chip ${activeRegion === 'bhoutan' ? 'active' : ''}`}
                  onClick={() => handleRegionChange('bhoutan')}
                >
                  Bhoutan & Punakha
                </button>
              </div>

              {/* City Filter Dropdown */}
              <div className="tours-city-wrapper">
                <i className="fas fa-city tours-city-icon"></i>
                <select
                  className="tours-city-select"
                  value={activeCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  title="Filtrer les circuits par ville"
                >
                  <option value="all">📍 Toutes les Villes (City Filter)</option>
                  {combinedCityOptions.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Bar */}
              <div className="tours-search-wrapper">
                <i className="fas fa-search tours-search-icon"></i>
                <input
                  type="text"
                  placeholder="Rechercher (ex: Jodhpur, Taj Mahal...)"
                  className="tours-search-input"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
                {search && (
                  <button
                    type="button"
                    className="tours-search-clear"
                    onClick={clearSearch}
                    title="Effacer la recherche"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Quick City Chips Bar */}
            <div className="tours-quick-cities">
              <span className="tours-quick-label"><i className="fas fa-map-marker-alt"></i> Villes phares :</span>
              {['jodhpur', 'jaipur', 'udaipur', 'varanasi', 'agra', 'jaisalmer', 'ladakh', 'kerala'].map((cSlug) => {
                const label = cSlug.charAt(0).toUpperCase() + cSlug.slice(1);
                const isActive = activeCity === cSlug;
                return (
                  <button
                    key={cSlug}
                    type="button"
                    className={`tours-city-chip ${isActive ? 'active' : ''}`}
                    onClick={() => handleCityChange(isActive ? 'all' : cSlug)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Active Search & Filter Feedback Banner */}
            {hasActiveFilters && (
              <div className="tours-active-filter-banner">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span className="tours-tag-label" style={{ fontWeight: 600 }}>
                    <i className="fas fa-filter" style={{ marginRight: '4px', opacity: 0.8 }}></i> Filtres actifs :
                  </span>

                  {activeRegion !== 'all' && (
                    <div className="tours-active-tag">
                      <span className="tours-tag-label">Région :</span>
                      <span className="tours-tag-value">{activeRegion}</span>
                      <button type="button" onClick={() => handleRegionChange('all')} className="tours-tag-close" title="Retirer le filtre région">
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}

                  {activeCity !== 'all' && (
                    <div className="tours-active-tag">
                      <span className="tours-tag-label">Ville :</span>
                      <span className="tours-tag-value">{combinedCityOptions.find(c => c.slug === activeCity)?.label || activeCity}</span>
                      <button type="button" onClick={clearCity} className="tours-tag-close" title="Retirer le filtre ville">
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}

                  {search && search.trim() && (
                    <div className="tours-active-tag">
                      <span className="tours-tag-label">Recherche :</span>
                      <span className="tours-tag-value">"{search.trim()}"</span>
                      <button type="button" onClick={clearSearch} className="tours-tag-close" title="Supprimer la recherche">
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}
                </div>

                <button type="button" onClick={clearAllFilters} className="tours-clear-all-btn">
                  <i className="fas fa-undo"></i> Réinitialiser tous les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section id="tours-listing-section" className="section-padding bg-cream">
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }}></i>
              <p style={{ marginTop: '16px' }}>Chargement des offres de voyage...</p>
            </div>
          ) : tours.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '12px' }}>
              <i className="fas fa-compass" style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '16px' }}></i>
              <h3>Aucun circuit trouvé</h3>
              <p style={{ color: 'var(--text-muted)' }}>Essayez un autre filtre ou créez directement votre voyage sur mesure.</p>
              <Link to="/voyage-sur-mesure" className="btn btn-primary" style={{ marginTop: '16px' }}>
                Créer mon voyage sur mesure
              </Link>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                  Affichage de <strong style={{ color: 'var(--color-primary)' }}>{startIndex + 1} à {endIndex}</strong> sur <strong style={{ color: 'var(--color-primary)' }}>{tours.length}</strong> circuit(s) disponible(s)
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {totalPages > 1 && (
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                      Page {currentPage} / {totalPages}
                    </span>
                  )}
                  <Link to="/voyage-sur-mesure" className="btn btn-sm btn-outline">
                    <i className="fas fa-sliders-h"></i> Voyage 100% sur mesure
                  </Link>
                </div>
              </div>

              <div className="tours-grid">
                {currentTours.map((tour) => {
                  const rawLocation = tour.location || tour.category || 'Inde';
                  const cleanLocation = rawLocation.replace(/^Inde\s*,\s*(.+)/i, '$1').trim() || rawLocation;

                  return (
                    <div key={tour._id || tour.slug} className="tour-card">
                      <Link to={`/${tour.slug}`} className="tour-card-image-wrap">
                        <img src={tour.image || '/images/dest-rajasthan.jpg'} alt={tour.title} />
                        <span className="tour-card-badge">{tour.badge || 'Populaire'}</span>
                        <div className="tour-card-duration"><i className="far fa-clock"></i> {tour.duration}</div>
                      </Link>
                      <div className="tour-card-body">
                        <div className="tour-card-location"><i className="fas fa-map-marker-alt"></i> {cleanLocation}</div>
                        <h3 className="tour-card-title">
                          <Link to={`/${tour.slug}`}>{tour.title}</Link>
                        </h3>
                      <p className="tour-card-excerpt">{tour.subtitle || (tour.overview ? tour.overview.slice(0, 110) + '...' : '')}</p>
                      <div className="tour-card-footer">
                        <span style={{ fontSize: '0.82rem', color: 'var(--color-primary)', fontWeight: '600' }}>
                          <i className="fas fa-check-circle" style={{ marginRight: '4px' }}></i> Sur Devis Personnalisé
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Link to={`/${tour.slug}`} className="btn btn-sm btn-outline">
                            Détails
                          </Link>
                          <button className="btn btn-sm btn-primary" onClick={() => handleOpenBooking(tour)}>
                            <i className="fas fa-paper-plane"></i> Devis
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>

              {/* Pagination Bar */}
              {totalPages > 1 && (
                <div className="luxury-pagination" aria-label="Pagination des circuits" style={{ marginTop: '40px' }}>
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

      {/* Booking Modal */}
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} tour={selectedTour} />
    </div>
  );
};

export default Tours;

