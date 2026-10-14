import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { fetchPageContent } from '../services/api';

const getHighResImageUrl = (url) => {
  if (!url) return '/images/image-12.jpg';
  return url.replace(/-250x250(?=\.(jpg|jpeg|png|webp))/gi, '');
};

const getItemObjectPosition = (member) => {
  if (member.objectPosition) return member.objectPosition;
  const name = (member.name || '').toLowerCase();
  if (name.includes('raj') || name.includes('kapil') || name.includes('om')) {
    return 'bottom center';
  }
  if (name.includes('vikey') || name.includes('praveen') || name.includes('vikram') || name.includes('monu')) {
    return 'center 25%';
  }
  return 'top center';
};

const DEFAULT_TEAM_MEMBERS = [
  {
    name: 'Mr. Singh',
    role: 'Fondateur & Interlocuteur Principal',
    category: 'Direction',
    specialty: 'Rajasthan, Inde du Nord & Népal',
    desc: "Passionné par son pays et sa culture, j'ai obtenu mon master de tourisme à l'Université de Jodhpur et j'ai débuté en tant que guide francophone certifié. Fondateur de l'agence Jodhpur Voyage, je supervise la création de vos circuits sur mesure et la qualité de votre séjour.",
    quote: "« Partager notre amour profond pour l'Inde avec professionnalisme et authenticité. »",
    image: '/images/mr-singh.jpg',
    objectPosition: 'top center'
  },
  {
    name: 'Vikey',
    role: 'Experte Voyage Inde du Nord & Inde Himalayenne',
    category: 'Guides Francophones',
    specialty: 'Rajasthan, Bénares, Centre de l\'Inde, Ladakh, Himachal & Spiti',
    desc: "Namasté, Je suis Vikey, guide francophone originaire du Rajasthan. J'ai fait mes études d'histoire à Delhi et j'ai obtenu mon diplôme en langue française en 2007 à l'Alliance Française de Pondichéry. Passionnée par l'apprentissage des lieux historiques et le partage de nos traditions.",
    quote: "« J'aime particulièrement Udaipur, la Venise de l'Inde, pour ses palais au bord du lac, sa romance et son sentiment de paix. »",
    image: 'https://www.jodhpurvoyage.com/wp-content/uploads/2025/08/3f297bb8-b810-4825-8074-d197af7e3542.jpg',
    objectPosition: 'center 25%'
  },
  {
    name: 'Praveen',
    role: 'Experte Voyage Inde du Nord & Sud',
    category: 'Guides Francophones',
    specialty: 'Rajasthan, Inde du Nord et Inde du Sud',
    desc: "Je m'appelle Praveen, je suis guide francophone diplômé. Je suis passionné par mon métier : faire découvrir ma terre natale à travers mes yeux, une terre magique et fascinante. Je travaille dans le tourisme depuis 2014 et j'ai appris le français à l'Alliance Française de Pondichéry.",
    quote: "« Les gens, les couleurs, les rites et la nourriture : en vous laissant surprendre, vous découvrirez une population d'une générosité unique. »",
    image: 'https://www.jodhpurvoyage.com/wp-content/uploads/2025/08/a07bc3a2-3ec0-4c82-a583-ba5e61f3a911.jpg',
    objectPosition: 'center 25%'
  },
  {
    name: 'Raj',
    role: 'Experte Voyage Inde du Nord & Sud',
    category: 'Guides Francophones',
    specialty: 'Rajasthan, Amritsar, Centre de l\'Inde, Inde du Sud & Bénares',
    desc: "Je suis Raj, je parle français et travaille comme guide francophone depuis 2015. Mon leitmotiv est de tout mettre en œuvre pour vous faire rêver, vivre des expériences inoubliables et ressentir des émotions intenses lors de vos voyages.",
    quote: "« Tout mettre en œuvre pour transformer votre circuit en un souvenir gravé à jamais dans votre mémoire. »",
    image: 'https://www.jodhpurvoyage.com/wp-content/uploads/2025/08/Raj-Guide-francophone-en-Inde.jpg',
    objectPosition: 'bottom center'
  },
  {
    name: 'Kapil',
    role: 'Experte Voyage Inde du Nord & Centre de l\'Inde',
    category: 'Guides Francophones',
    specialty: 'Rajasthan, Taj Mahal, Varanasi, Gujarat, Karnataka & Kerala',
    desc: "Bonjour les amis ! Je suis un jeune et dynamique guide touristique français en Inde, originaire du Rajasthan avec 10 ans d'expérience. Spécialiste du patrimoine et des visites culturelles et historiques, j'aime transmettre mes connaissances avec enthousiasme.",
    quote: "« Venez découvrir l'Inde authentique avec les yeux et le cœur des locaux. »",
    image: 'https://www.jodhpurvoyage.com/wp-content/uploads/2025/08/Kapil-guide-francophone-en-Inde.jpg',
    objectPosition: 'bottom center'
  },
  {
    name: 'Vikram',
    role: 'Manager Logistique & Assistance Aéroport Francophone',
    category: 'Management',
    specialty: 'Jodhpur, Transferts, Hôtels & Assistance 24/7',
    desc: "Originaire de Jodhpur, j'ai étudié les arts à l'Université de Jodhpur puis passé deux ans à l'Alliance Française de Delhi. Je suis responsable des réservations d'hôtels, des guides, des véhicules et des transferts sur le terrain.",
    quote: "« Il est temps de vivre la vie que tu t'es imaginée » – Henry James.",
    image: 'https://www.jodhpurvoyage.com/wp-content/uploads/2025/09/Vikram-Agence-de-voyage-en-Inde.jpg',
    objectPosition: 'center 25%'
  },
  {
    name: 'Mohit',
    role: 'Le Comptable d\'Entreprise',
    category: 'Management',
    specialty: 'Gestion financière, Comptabilité & Facturation',
    desc: "Responsable de la comptabilité et des factures au sein de l'agence. Passionné par les randonnées en montagne et les paysages d'altitude, mes récents voyages m'ont conduit dans l'Himachal Pradesh et à Rishikesh.",
    quote: "« Une gestion rigoureuse et transparente au service d'un séjour parfait. »",
    image: '/images/image-8.jpg',
    objectPosition: 'center'
  },
  {
    name: 'Om',
    role: 'Chauffeur Anglophone Privilégié (8+ Ans d\'Expérience)',
    category: 'Chauffeurs Privés',
    specialty: 'Rajasthan, Gujarat, Centre de l\'Inde, Agra & Bénares',
    desc: "Je suis Om, je travaille comme chauffeur privé pour Jodhpur Voyage depuis 8 ans. J'ai accompagné de très nombreux voyageurs français à travers le Rajasthan, le Gujarat, Madhya Pradesh et Bénares en toute sécurité.",
    quote: "« Conduite prudente, ponctualité et attention de chaque instant pour nos voyageurs. »",
    image: 'https://www.jodhpurvoyage.com/wp-content/uploads/2025/09/Om-Chauffeur-en-Inde.jpg',
    objectPosition: 'bottom center'
  },
  {
    name: 'Monu',
    role: 'Chauffeur Anglophone Spécialiste Himalayen (10+ Ans)',
    category: 'Chauffeurs Privés',
    specialty: 'Punjab, Himachal, Uttarakhand, Vallée du Spiti & Kinnaur',
    desc: "Je suis Monu, chauffeur pour Jodhpur Voyage depuis 10 ans. Je suis le spécialiste des routes de montagne du Nord : Punjab, Himachal Pradesh, Uttarakhand, vallée du Spiti et Kinnaur.",
    quote: "« Une parfaite maîtrise des routes de montagne pour des circuits hors des sentiers battus. »",
    image: 'https://www.jodhpurvoyage.com/wp-content/uploads/2025/09/Monu-voyage-avec-chauffeur-en-Inde.jpg',
    objectPosition: 'center 25%'
  }
];

const DEFAULT_TEAM_DATA = {
  hero: {
    bgImage: '/images/image-9.jpg',
    badge: 'Des Professionnels Passionnés',
    badgeIcon: 'fas fa-users',
    title: 'Notre Équipe Locale en Inde',
    description: 'Une équipe locale francophone dévouée à faire de votre voyage en Inde une aventure humaine inoubliable.'
  },
  intro: {
    subtitle: 'La Team Jodhpur Voyage',
    title: 'Notre Équipe Locale d\'Experts',
    description: 'Nous sommes fiers de compter plus de 6 experts voyages vivant et travaillant directement en Inde, au plus près des destinations que nous proposons. Nos experts explorent sans cesse leur pays pour vous offrir des conseils personnalisés.'
  },
  members: DEFAULT_TEAM_MEMBERS,
  contactCard: {
    title: 'Une Question ? Un Projet en Tête ?',
    description: 'Nos conseillers francophones sont disponibles 7j/7 pour échanger sur vos envies.',
    buttonText: 'Nous Contacter',
    buttonLink: '/contact'
  }
};

const NotreEquipe = () => {
  const [content, setContent] = useState(DEFAULT_TEAM_DATA);
  const [activeCategory, setActiveCategory] = useState('Tous');

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPageContent('notre-equipe')
      .then((res) => {
        if (res.data) {
          setContent(prev => ({
            ...prev,
            ...res.data,
            hero: { ...prev.hero, ...(res.data.hero || {}) },
            intro: { ...prev.intro, ...(res.data.intro || {}) },
            members: (Array.isArray(res.data.members) && res.data.members.length > 0) 
              ? res.data.members 
              : DEFAULT_TEAM_MEMBERS,
            contactCard: { ...prev.contactCard, ...(res.data.contactCard || {}) }
          }));
        }
      })
      .catch((err) => console.error('Error loading team content:', err));
  }, []);

  const hero = content.hero || {};
  const intro = content.intro || content.identity || {};
  const members = (Array.isArray(content.members) && content.members.length > 0) ? content.members : DEFAULT_TEAM_MEMBERS;
  const contactCard = content.contactCard || {};

  const getMemberCategory = (member) => {
    if (member?.category) return member.category;
    const role = (member?.role || '').toLowerCase();
    const name = (member?.name || '').toLowerCase();
    if (role.includes('fondateur') || role.includes('directeur') || name.includes('singh')) return 'Direction';
    if (role.includes('chauffeur') || name.includes('om') || name.includes('monu')) return 'Chauffeurs Privés';
    if (role.includes('comptable') || role.includes('logistique') || role.includes('manager')) return 'Management';
    return 'Guides Francophones';
  };

  const categories = [
    'Tous', 
    'Direction', 
    'Guides Francophones', 
    'Management', 
    'Chauffeurs Privés',
    ...Array.from(new Set(
      members
        .map(m => getMemberCategory(m))
        .filter(c => c && !['Tous', 'Direction', 'Guides Francophones', 'Management', 'Chauffeurs Privés'].includes(c))
    ))
  ];

  const filteredMembers = activeCategory === 'Tous' 
    ? members
    : members.filter(m => getMemberCategory(m) === activeCategory);

  return (
    <div style={{ backgroundColor: '#FAF8F5', color: '#1E293B' }}>
      <SEO pageKey="notre-equipe" />

      {/* Hero Banner */}
      <section className="reviews-hero-section">
        <img 
          src={getHighResImageUrl(hero.bgImage) || '/images/image-9.jpg'} 
          alt="Notre Équipe Jodhpur Voyage" 
          className="reviews-hero-bg" 
          onError={(e) => { e.currentTarget.src = '/images/image-9.jpg'; }} 
        />
        <div className="container reviews-hero-content">
          <span className="hero-badge">
            <i className={hero.badgeIcon || 'fas fa-users'}></i> {hero.badge || 'Des Professionnels Passionnés'}
          </span>
          <h1 className="reviews-hero-title">{hero.title || 'Notre Équipe Locale en Inde'}</h1>
          <p className="reviews-hero-desc">
            {hero.description}
          </p>
        </div>
      </section>

      {/* Intro & Team Grid */}
      <section className="section-padding bg-cream">
        <div className="container" style={{ maxWidth: '1440px' }}>
          <div className="section-header">
            <span className="section-subtitle">{intro.subtitle || 'La Team Jodhpur Voyage'}</span>
            <h2 className="section-title">{intro.title || 'Notre Équipe Locale d\'Experts'}</h2>
            <p className="section-description" style={{ maxWidth: '850px', margin: '0 auto' }}>
              {intro.description}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '40px' }}>
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                style={{ borderRadius: '25px', padding: '8px 20px', fontWeight: '600' }}
              >
                {cat === 'Tous' && <i className="fas fa-users" style={{ marginRight: '6px' }}></i>}
                {cat === 'Direction' && <i className="fas fa-crown" style={{ marginRight: '6px' }}></i>}
                {cat === 'Guides Francophones' && <i className="fas fa-user-check" style={{ marginRight: '6px' }}></i>}
                {cat === 'Management' && <i className="fas fa-tasks" style={{ marginRight: '6px' }}></i>}
                {cat === 'Chauffeurs Privés' && <i className="fas fa-car-side" style={{ marginRight: '6px' }}></i>}
                {cat}
              </button>
            ))}
          </div>

          {/* Team Cards Grid - 4 Columns */}
          <div className="team-4col-grid">
            {filteredMembers.map((member, idx) => (
              <div 
                key={idx} 
                style={{ 
                  background: '#fff', 
                  borderRadius: '16px', 
                  overflow: 'hidden', 
                  boxShadow: '0 4px 18px rgba(0,0,0,0.06)', 
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
              >
                <div style={{ position: 'relative', height: '260px', overflow: 'hidden', backgroundColor: '#F1F5F9' }}>
                  <img 
                    src={getHighResImageUrl(member.image) || '/images/image-12.jpg'} 
                    alt={member.name} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      objectPosition: getItemObjectPosition(member),
                      imageRendering: '-webkit-optimize-contrast'
                    }} 
                    onError={(e) => { e.currentTarget.src = '/images/image-12.jpg'; }} 
                  />
                  {getMemberCategory(member) && (
                    <span 
                      style={{ 
                        position: 'absolute', 
                        top: '12px', 
                        right: '12px', 
                        background: 'rgba(13, 148, 136, 0.95)', 
                        color: '#fff', 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem', 
                        fontWeight: '600',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }}
                    >
                      {getMemberCategory(member)}
                    </span>
                  )}
                </div>

                <div style={{ padding: '20px 18px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#1E293B', marginBottom: '4px', fontWeight: '700' }}>
                    {member.name}
                  </h3>
                  <div style={{ color: '#0D9488', fontWeight: '600', fontSize: '0.84rem', marginBottom: '8px', lineHeight: '1.35' }}>
                    {member.role}
                  </div>

                  {member.specialty && (
                    <div style={{ fontSize: '0.78rem', color: '#C58B39', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <i className="fas fa-map-marker-alt"></i> {member.specialty}
                    </div>
                  )}

                  <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: '1.6', marginBottom: '14px', flexGrow: 1 }}>
                    {member.desc}
                  </p>

                  {member.quote && (
                    <div style={{ background: '#FFFBEB', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid #D97706', fontSize: '0.8rem', fontStyle: 'italic', color: '#92400E', marginTop: 'auto' }}>
                      {member.quote}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Banner */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '40px 30px', marginTop: '50px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '1.6rem', color: '#1E293B', marginBottom: '12px', fontWeight: '700' }}>
              {contactCard.title || 'Une Question ? Un Projet en Tête ?'}
            </h3>
            <p style={{ color: '#64748B', marginBottom: '24px', maxWidth: '650px', margin: '0 auto 24px auto' }}>
              {contactCard.description || 'Nos conseillers francophones sont disponibles 7j/7 pour échanger sur vos envies et créer votre voyage idéal.'}
            </p>
            <Link to={contactCard.buttonLink || '/contact'} className="btn btn-primary btn-lg">
              <i className="fas fa-envelope"></i> {contactCard.buttonText || 'Nous Contacter'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotreEquipe;
