import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { fetchBlogs } from '../services/api';
import SEO from '../components/SEO';

const Blog = () => {
  const { category: routeCategory, page: routePage } = useParams();
  const [searchParams] = useSearchParams();

  // Normalize category from URL params or search params
  const getInitialCategory = () => {
    const raw = (routeCategory || searchParams.get('category') || 'all').toLowerCase().trim();
    if (raw === 'nepal-2' || raw === 'nepal' || raw === 'népal') return 'nepal';
    if (raw === 'inde') return 'inde';
    return raw;
  };

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(getInitialCategory());
  const [currentPage, setCurrentPage] = useState(routePage ? parseInt(routePage, 10) : 1);
  const ITEMS_PER_PAGE = 9;

  // Sync category if URL routeParam changes
  useEffect(() => {
    setSelectedCategory(getInitialCategory());
  }, [routeCategory, searchParams]);

  useEffect(() => {
    setLoading(true);
    fetchBlogs({ search, category: selectedCategory })
      .then((res) => {
        setBlogs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [search, selectedCategory]);

  // Reset page when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, blogs.length);
  const currentBlogs = blogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      const section = document.getElementById('blog-listing-section');
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

  // Dynamic titles based on category
  const getHeroTitle = () => {
    if (selectedCategory === 'inde') return 'Carnet de Voyage – Tous les Articles sur l’Inde';
    if (selectedCategory === 'nepal' || selectedCategory === 'nepal-2') return 'Carnet de Voyage – Articles & Récits sur le Népal';
    return 'Conseils & Récits de Voyage en Inde et Népal';
  };

  return (
    <div>
      <SEO pageKey="blog" />
      {/* Hero */}
      <section className="reviews-hero-section">
        <img src="/images/dest-tajmahal.jpg" alt="Blog Jodhpur Voyage" className="reviews-hero-bg" />
        <div className="container reviews-hero-content">
          <span className="hero-badge"><i className="fas fa-newspaper"></i> Carnet de Voyage</span>
          <h1 className="reviews-hero-title">{getHeroTitle()}</h1>
          <p className="reviews-hero-desc">
            Retrouvez tous nos guides pratiques, conseils culturels, météo et recommandations d'experts pour préparer votre séjour.
          </p>
        </div>
      </section>

      {/* Modern Luxury Filter & Search Bar */}
      <section className="tours-filter-section">
        <div className="container">
          <div className="tours-filter-card">
            <div className="tours-filter-main">
              {/* Category Filter Chips */}
              <div className="tours-chips-wrapper">
                <button
                  className={`tours-chip ${selectedCategory === 'all' && !search ? 'active' : ''}`}
                  onClick={() => { setSelectedCategory('all'); setSearch(''); }}
                >
                  Tous les articles
                  <span className="tours-chip-count">{blogs.length}</span>
                </button>
                <button
                  className={`tours-chip ${selectedCategory === 'inde' ? 'active' : ''}`}
                  onClick={() => { setSelectedCategory('inde'); setSearch(''); }}
                >
                  <i className="fas fa-flag"></i> Inde
                </button>
                <button
                  className={`tours-chip ${selectedCategory === 'nepal' ? 'active' : ''}`}
                  onClick={() => { setSelectedCategory('nepal'); setSearch(''); }}
                >
                  <i className="fas fa-mountain"></i> Népal
                </button>
                <button
                  className={`tours-chip ${selectedCategory === 'Rajasthan' ? 'active' : ''}`}
                  onClick={() => { setSelectedCategory('Rajasthan'); setSearch(''); }}
                >
                  Rajasthan
                </button>
                <button
                  className={`tours-chip ${selectedCategory === 'Ladakh' ? 'active' : ''}`}
                  onClick={() => { setSelectedCategory('Ladakh'); setSearch(''); }}
                >
                  Ladakh
                </button>
              </div>

              {/* Search Bar */}
              <div className="tours-search-wrapper">
                <i className="fas fa-search tours-search-icon"></i>
                <input
                  type="text"
                  placeholder="Rechercher un article..."
                  className="tours-search-input"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    type="button"
                    className="tours-search-clear"
                    onClick={() => setSearch('')}
                    title="Effacer la recherche"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Active search filter feedback */}
            {search && search.trim() && (
              <div className="tours-active-filter-banner">
                <div className="tours-active-tag">
                  <i className="fas fa-filter" style={{ fontSize: '0.8rem', opacity: 0.8 }}></i>
                  <span className="tours-tag-label">Filtre actif :</span>
                  <span className="tours-tag-value">"{search.trim()}"</span>
                  <button type="button" onClick={() => setSearch('')} className="tours-tag-close" title="Supprimer ce filtre">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <button type="button" onClick={() => setSearch('')} className="tours-clear-all-btn">
                  <i className="fas fa-undo"></i> Réinitialiser la recherche
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section id="blog-listing-section" className="section-padding bg-cream">
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }}></i>
            </div>
          ) : blogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '12px' }}>
              <h3>Aucun article trouvé</h3>
              <p style={{ color: 'var(--text-muted)' }}>Essayez un autre mot-clé ou réinitialisez les filtres.</p>
              <button 
                className="btn btn-primary" 
                onClick={() => { setSelectedCategory('all'); setSearch(''); }}
                style={{ marginTop: '16px' }}
              >
                Voir tous les articles
              </button>
            </div>
          ) : (
            <>
              {blogs.length > 0 && (
                <div className="reviews-count-header">
                  <div className="reviews-count-text">
                    Affichage de <strong>{startIndex + 1} à {endIndex}</strong> sur <strong>{blogs.length}</strong> articles
                  </div>
                  {totalPages > 1 && (
                    <div className="reviews-page-indicator">
                      Page {currentPage} / {totalPages}
                    </div>
                  )}
                </div>
              )}

              <div className="blog-grid">
                {currentBlogs.map((post) => (
                  <div key={post._id || post.slug} className="tour-card">
                    <Link to={`/blog/${post.slug}`} className="tour-card-image-wrap">
                      <img 
                        src={post.coverImage || post.image || '/images/dest-rajasthan.jpg'} 
                        alt={post.title} 
                        onError={(e) => { e.currentTarget.src = "/images/dest-rajasthan.jpg"; }}
                      />
                    </Link>
                    <div className="tour-card-body">
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        <i className="far fa-clock"></i> {post.readTime || '5 min de lecture'} • {new Date(post.createdAt || Date.now()).toLocaleDateString('fr-FR')}
                      </div>
                      <h3 className="tour-card-title">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="tour-card-excerpt">{post.excerpt}</p>
                      <div className="tour-card-footer">
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          Par <strong>{post.author?.name || 'Jodhpur Voyage'}</strong>
                        </span>
                        <Link to={`/blog/${post.slug}`} className="btn btn-sm btn-outline">
                          Lire l'article <i className="fas fa-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Bar */}
              {totalPages > 1 && (
                <div className="luxury-pagination" aria-label="Pagination des articles">
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
    </div>
  );
};

export default Blog;

