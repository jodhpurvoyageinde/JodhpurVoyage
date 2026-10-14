import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { fetchDestinations } from '../services/api';

const allDestinationsData = [
  // 1. Rajasthan
  {
    category: 'rajasthan',
    title: 'Rajasthan',
    slug: 'rajasthan',
    image: '/images/dest-rajasthan.jpg',
    excerpt: 'Cités royales, désert du Thar, forteresses imprenables, palais des Mille et Une Nuits et havelis du Shekhawati.',
    btnText: 'Explorer le Rajasthan',
    link: '/destinations/rajasthan'
  },
  // 2. Delhi & Agra
  {
    category: 'nord',
    title: 'Delhi & Taj Mahal d\'Agra',
    slug: 'delhi-agra',
    image: '/images/dest-tajmahal.jpg',
    excerpt: 'De la capitale millénaire aux ruelles de Chandni Chowk jusqu\'à la féerie immaculée du Taj Mahal et du Fort Rouge.',
    btnText: 'Découvrir Delhi & Agra',
    link: '/destinations/delhi-agra'
  },
  // 3. Varanasi & Gange
  {
    category: 'nord',
    title: 'Varanasi & Vallée du Gange',
    slug: 'varanasi',
    image: '/images/dest-varanasi.jpg',
    excerpt: 'La capitale spirituelle de l\'Inde, les rituels sacrés sur les Ghats du Gange, les cérémonies Aarti et Sarnath.',
    btnText: 'Découvrir Varanasi',
    link: '/destinations/varanasi'
  },
  // 4. Amritsar & Punjab
  {
    category: 'nord',
    title: 'Amritsar & Le Punjab',
    slug: 'amritsar-punjab',
    image: '/images/dest-jodhpur.jpg',
    excerpt: 'Le Temple d\'Or scintillant, la ferveur et l\'hospitalité légendaire du peuple Sikh, et la cérémonie de la frontière de Wagah.',
    btnText: 'Découvrir le Punjab',
    link: '/destinations/amritsar-punjab'
  },
  // 5. Dharamsala & Himachal Pradesh
  {
    category: 'ladakh',
    title: 'Dharamsala & Himachal Pradesh',
    slug: 'dharamsala-himachal',
    image: '/images/dest-himachal.jpg',
    excerpt: 'Résidence du Dalaï-Lama au pied de l\'Himalaya, vallées verdoyantes de Kangra, Shimla et routes d\'altitude de Manali.',
    btnText: 'Découvrir l\'Himachal',
    link: '/destinations/dharamsala-himachal'
  },
  // 6. Rishikesh & Haridwar
  {
    category: 'nord',
    title: 'Rishikesh & Haridwar (Uttarakhand)',
    slug: 'rishikesh-uttarakhand',
    image: '/images/image-12.jpg',
    excerpt: 'Capitale mondiale du Yoga, ashrams légendaires et eaux pures du Gange sauvage aux portes de l\'Himalaya.',
    btnText: 'Découvrir Rishikesh',
    link: '/destinations/rishikesh-uttarakhand'
  },
  // 7. Ladakh & Zanskar
  {
    category: 'ladakh',
    title: 'Ladakh & Spiti – Le Petit Tibet',
    slug: 'ladakh',
    image: '/images/dest-ladakh.jpg',
    excerpt: 'Paysages lunaires, monastères bouddhistes de Thiksey et Hemis, lac Pangong turquoise et cols à plus de 5 000 m.',
    btnText: 'Découvrir le Ladakh',
    link: '/destinations/ladakh'
  },
  // 8. Kerala
  {
    category: 'sud',
    title: 'Kerala & Backwaters',
    slug: 'kerala',
    image: '/images/dest-kerala.jpg',
    excerpt: 'Croisières en Houseboat traditionnel sur les canaux tropicaux d\'Alleppey, collines de thé de Munnar et Ayurveda.',
    btnText: 'Découvrir le Kerala',
    link: '/destinations/kerala'
  },
  // 9. Tamil Nadu
  {
    category: 'sud',
    title: 'Tamil Nadu & Temples Dravidiens',
    slug: 'tamil-nadu',
    image: '/images/dest-karnataka.jpg',
    excerpt: 'Gopurams sculptés de Madurai et Tanjore, anciens comptoirs français de Pondichéry et sanctuaires de Mahabalipuram.',
    btnText: 'Découvrir le Tamil Nadu',
    link: '/destinations/tamil-nadu'
  },
  // 10. Karnataka
  {
    category: 'sud',
    title: 'Karnataka & Palais de Mysore',
    slug: 'karnataka',
    image: '/images/image-6.jpg',
    excerpt: 'Les ruines grandioses de l\'empire de Vijayanagara à Hampi (UNESCO), les temples de Belur et le faste des Maharajas à Mysore.',
    btnText: 'Découvrir le Karnataka',
    link: '/destinations/karnataka'
  },
  // 11. Gujarat
  {
    category: 'gujarat',
    title: 'Gujarat & Désert de Kutch',
    slug: 'gujarat',
    image: '/images/dest-gujarat.jpg',
    excerpt: 'Le désert de sel blanc du Grand Rann de Kutch, artisanat textile des tribus, temples jaïns de Palitana et lions d\'Asie.',
    btnText: 'Découvrir le Gujarat',
    link: '/destinations/gujarat'
  },
  // 12. Goa
  {
    category: 'sud',
    title: 'Goa & Côte Tropicale',
    slug: 'goa',
    image: '/images/dest-goa.jpg',
    excerpt: 'Plages bordées de cocotiers, architecture coloniale portugaise, églises classées UNESCO et douceur de vivre au bord de l\'Océan.',
    btnText: 'Découvrir Goa',
    link: '/destinations/goa'
  },
  // 13. Orissa
  {
    category: 'sud',
    title: 'Orissa / Odisha & Temple du Soleil',
    slug: 'orissa',
    image: '/images/dest-orissa.jpg',
    excerpt: 'Le colossal char de pierre du Temple du Soleil de Konark, les sanctuaires de Puri et les marchés tribaux authentiques.',
    btnText: 'Découvrir l\'Orissa',
    link: '/destinations/orissa'
  },
  // 14. Centre de l'Inde & Madhya Pradesh
  {
    category: 'nord',
    title: 'Centre de l\'Inde & Madhya Pradesh',
    slug: 'madhya-pradesh',
    image: '/images/image-8.jpg',
    excerpt: 'Les temples aux sculptures érotiques de Khajuraho (UNESCO), les palais oubliés d\'Orccha et les safaris tigres du Bengale.',
    btnText: 'Découvrir le Madhya Pradesh',
    link: '/destinations/madhya-pradesh'
  },
  // 15. Darjeeling & Sikkim
  {
    category: 'ladakh',
    title: 'Darjeeling & Sikkim',
    slug: 'darjeeling-sikkim',
    image: '/images/slide8-300x176.jpg',
    excerpt: 'Plantations de thé d\'exception, train à vapeur historique, monastères bouddhistes et vue majestueuse sur le Kanchenjunga.',
    btnText: 'Découvrir Darjeeling',
    link: '/destinations/darjeeling-sikkim'
  },
  // 16. Népal
  {
    category: 'nepal',
    title: 'Népal & Cités Royales',
    slug: 'nepal',
    image: '/images/dest-nepal.jpg',
    excerpt: 'La vallée sacrée de Katmandou, la cité médiévale de Bhaktapur, les lacs de Pokhara et les safaris rhinocéros de Chitwan.',
    btnText: 'Découvrir le Népal',
    link: '/destinations/nepal'
  },
  // 17. Bhoutan
  {
    category: 'bhoutan',
    title: 'Bhoutan',
    slug: 'bhoutan',
    image: '/images/jaipur-travel.jpg',
    excerpt: 'Le monastère suspendu du Nid du Tigre (Taktshang), les forteresses Dzongs de Paro et Punakha, et le pays du Bonheur National Brut.',
    btnText: 'Découvrir le Bhoutan',
    link: '/destinations/bhoutan'
  }
];

const Destinations = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [dynamicDestinations, setDynamicDestinations] = useState(allDestinationsData);
  const [searchParams] = useSearchParams();
  const searchKeyword = searchParams.get('search') || '';

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);

    let isMounted = true;
    fetchDestinations()
      .then((res) => {
        if (!isMounted) return;
        const apiData = Array.isArray(res.data) ? res.data : [];
        if (apiData.length > 0) {
          const mapped = apiData.map((d) => {
            const reg = (d.region || '').toLowerCase();
            const slug = (d.slug || '').toLowerCase();
            const name = (d.name || d.title || '').toLowerCase();

            let category = 'nord';
            if (reg === 'nepal' || slug === 'nepal' || name.includes('nepal') || name.includes('népal')) {
              category = 'nepal';
            } else if (reg === 'bhoutan' || slug === 'bhoutan' || name.includes('bhoutan')) {
              category = 'bhoutan';
            } else if (reg === 'inde-de-louest' || reg === 'inde-du-ouest' || reg === 'ouest' || reg === 'gujarat' || slug === 'gujarat' || name.includes('gujarat') || name.includes('kutch')) {
              category = 'ouest';
            } else if (reg === 'ladakh' || reg === 'himalaya' || slug === 'ladakh' || name.includes('ladakh') || name.includes('himalaya')) {
              category = 'ladakh';
            } else if (reg === 'rajasthan' || slug === 'rajasthan' || name.includes('rajasthan')) {
              category = 'rajasthan';
            } else if (reg === 'inde-du-sud' || reg === 'sud' || slug === 'kerala' || slug === 'tamil-nadu' || slug === 'karnataka') {
              category = 'sud';
            } else {
              category = 'nord';
            }

            return {
              _id: d._id,
              category,
              title: d.name || d.title,
              slug: d.slug,
              image: d.image || '/images/dest-rajasthan.jpg',
              excerpt: d.shortDescription || d.tagline || d.excerpt || '',
              btnText: `Découvrir ${d.name || d.title}`,
              link: d.customUrl || `/destinations/${d.slug}`
            };
          });
          setDynamicDestinations(mapped);
        }
      })
      .catch((err) => console.error('Error loading destinations API:', err));

    return () => {
      isMounted = false;
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredDestinations = dynamicDestinations.filter((dest) => {
    let matchesFilter = false;
    if (activeFilter === 'all') {
      matchesFilter = true;
    } else if (activeFilter === 'nord') {
      matchesFilter = dest.category === 'nord' || dest.category === 'rajasthan';
    } else if (activeFilter === 'sud') {
      matchesFilter = dest.category === 'sud';
    } else if (activeFilter === 'ouest') {
      matchesFilter = dest.category === 'ouest' || dest.category === 'gujarat';
    } else {
      matchesFilter = dest.category === activeFilter;
    }
    const matchesSearch =
      !searchKeyword ||
      dest.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      dest.excerpt.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <SEO pageKey="destinations" />
      {/* =========================================================================
          BANNER
          ========================================================================= */}
      <section className="destinations-hero-section">
        <img
          src="/images/Voyage-Jaisalmer.jpg"
          onError={(e) => { e.currentTarget.src = "https://www.jodhpurvoyage.com/wp-content/uploads/2026/07/Voyage-Jaisalmer.jpg"; }}
          alt="Destinations Banner"
          className="destinations-hero-bg"
        />
        <div className="container destinations-hero-content">
          <span className="hero-badge">Nos Régions</span>
          <h1 className="destinations-hero-title">Nos Destinations d'Exception</h1>
          <p className="destinations-hero-desc" style={{ color: '#fff', fontSize: '1.1rem', marginTop: '10px', maxWidth: '700px', marginInline: 'auto' }}>
            Explorez l'Inde du Nord, l'Inde du Sud, le Népal et le Bhoutan avec une agence réceptive locale francophone.
          </p>
        </div>
      </section>

      {/* =========================================================================
          MAIN DIRECTORY
          ========================================================================= */}
      <section className="section-padding bg-cream">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Explorer</span>
            <h2 className="section-title">Où souhaitez-vous voyager ?</h2>
            <p className="section-description">
              Sélectionnez la région de vos rêves parmi nos 17 destinations phares pour découvrir nos circuits et programmes sur mesure.
            </p>
          </div>

          {/* INTERACTIVE FILTER TABS */}
          <div className="filter-tabs">
            <button
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              Toutes Les Régions ({dynamicDestinations.length})
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
              className={`filter-btn ${activeFilter === 'ouest' ? 'active' : ''}`}
              onClick={() => setActiveFilter('ouest')}
            >
              Inde de l'Est & de l'Ouest
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

          <div className="tours-grid">
            {filteredDestinations.map((dest, idx) => (
              <div key={idx} className="tour-card" data-category={dest.category}>
                <Link to={dest.link} className="tour-card-image-wrap" title={`Explorer ${dest.title}`}>
                  <img 
                    src={dest.image} 
                    alt={dest.title} 
                    onError={(e) => { e.currentTarget.src = "/images/dest-rajasthan.jpg"; }}
                  />
                </Link>
                <div className="tour-card-body">
                  <h3 className="tour-card-title">
                    <Link to={dest.link}>{dest.title}</Link>
                  </h3>
                  <p className="tour-card-excerpt">{dest.excerpt}</p>
                  <Link to={dest.link} className="btn btn-primary btn-sm mt-auto">
                    {dest.btnText}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          CTA BANNER
          ========================================================================= */}
      <section className="cta-banner-section">
        <img 
          src="/images/image-9.jpg" 
          onError={(e) => { e.currentTarget.src = "https://www.jodhpurvoyage.com/wp-content/uploads/2025/08/image-9.jpg"; }}
          alt="CTA Background" 
          className="cta-bg-image" 
        />
        <div className="container cta-content">
          <h2 className="cta-title">Votre voyage sur mesure en Inde & Népal</h2>
          <Link to="/voyage-sur-mesure" className="btn btn-primary btn-lg">
            Créer mon voyage
          </Link>
        </div>
      </section>

      {/* =========================================================================
          FLOATING WIDGETS
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
    </>
  );
};

export default Destinations;
