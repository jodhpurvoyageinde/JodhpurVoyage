import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { createBooking } from '../services/api';

const DESTINATION_OPTIONS = [
  { id: 'rajasthan', title: 'Rajasthan & Inde du Nord', icon: 'fas fa-gopuram', desc: 'Palais des Maharajas, Forts & Désert du Thar' },
  { id: 'sud-kerala', title: 'Inde du Sud & Kerala', icon: 'fas fa-tree', desc: 'Backwaters, Temples Chola & Plages tropicales' },
  { id: 'safari-centre', title: 'Culture & Safaris Tigres', icon: 'fas fa-paw', desc: 'Parcs nationaux de Bandhavgarh, Kanha & Taj Mahal' },
  { id: 'himalaya-ladakh', title: 'Himalaya & Ladakh', icon: 'fas fa-mountain', desc: 'Monastères bouddhistes, vallées sacrées & col de Khardung' },
  { id: 'nepal', title: 'Népal & Katmandou', icon: 'fas fa-place-of-worship', desc: 'Vallée de Katmandou, Pokhara & sommets de l\'Everest' }
];

const VOYAGEUR_TYPES = [
  { id: 'couple', label: 'En couple', icon: 'fas fa-heart' },
  { id: 'famille', label: 'En famille', icon: 'fas fa-child' },
  { id: 'noces', label: 'Voyage de noces', icon: 'fas fa-ring' },
  { id: 'evenement', label: 'Anniversaire / Événement', icon: 'fas fa-glass-cheers' },
  { id: 'amis', label: 'Entre amis', icon: 'fas fa-users' },
  { id: 'groupe', label: 'Groupe (+ de 10 pers)', icon: 'fas fa-bus' },
  { id: 'solo', label: 'Voyage solo', icon: 'fas fa-user-ninja' }
];

const TYPE_VOYAGE_OPTIONS = [
  { id: 'circuit-groupe', label: 'Circuit accompagné en groupe réduit', icon: 'fas fa-flag' },
  { id: 'sur-mesure-privatif', label: 'Voyage 100% sur mesure privatif', icon: 'fas fa-sliders-h' },
  { id: 'chauffeur-prive', label: 'Voiture privative avec chauffeur dédié', icon: 'fas fa-car-side' },
  { id: 'spirituel-yoga', label: 'Voyage spirituel, Yoga & Bien-être', icon: 'fas fa-om' },
  { id: 'palais-patrimoine', label: 'Séjour Palais & Hôtels de Charme', icon: 'fas fa-crown' },
  { id: 'safari-nature', label: 'Safari faune & parcs naturels', icon: 'fas fa-hippo' }
];

const ATTENTES_OPTIONS = [
  { id: 'culture-unesco', label: 'Culture & Monuments UNESCO', icon: 'fas fa-landmark' },
  { id: 'immersion', label: 'Rencontre & immersion chez l\'habitant', icon: 'fas fa-hands-helping' },
  { id: 'safari', label: 'Safaris & Observation de la faune', icon: 'fas fa-binoculars' },
  { id: 'festivals', label: 'Festivals traditionnels (Holi, Pushkar...)', icon: 'fas fa-drum' },
  { id: 'trek', label: 'Trekking & Marches en montagne', icon: 'fas fa-hiking' },
  { id: 'ayurveda', label: 'Ayurveda, Spa & Detox', icon: 'fas fa-spa' },
  { id: 'detente', label: 'Détente & Plages (Goa, Kerala)', icon: 'fas fa-umbrella-beach' }
];

const HEBERGEMENT_OPTIONS = [
  { id: 'havelis', label: 'Havelis & Demeures de Charme', icon: 'fas fa-hotel' },
  { id: 'palais', label: 'Palais de Maharajas & Héritage', icon: 'fas fa-chess-rook' },
  { id: 'luxe', label: 'Hôtels 4* / 5* de Luxe', icon: 'fas fa-star' },
  { id: 'ecolodge', label: 'Écolodges & Glamping de charme', icon: 'fas fa-campground' },
  { id: 'standard', label: 'Standard Confortable', icon: 'fas fa-bed' }
];

const BUDGET_RANGES = [
  { id: 'b1', label: 'Moins de 1 500 €', sub: 'par personne' },
  { id: 'b2', label: '1 500 € – 2 500 €', sub: 'par personne (Conseillé)' },
  { id: 'b3', label: '2 500 € – 4 000 €', sub: 'par personne' },
  { id: 'b4', label: 'Plus de 4 000 €', sub: 'Luxe & Palais' }
];

const CircuitAccompagne = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    destination: 'rajasthan',
    villeDepart: 'Paris',
    dateDepart: '',
    duree: '12-15 jours',
    adultes: 2,
    enfants: 0,
    budget: 'b2',
    voyageurTypes: ['couple'],
    typesVoyage: ['circuit-groupe'],
    attentes: ['culture-unesco'],
    hebergements: ['havelis'],
    precisions: '',
    civilite: 'Monsieur',
    prenom: '',
    nom: '',
    email: '',
    phone: '',
    creneauAppel: 'Après-midi (14h-18h)',
    newsletter: true
  });

  const [captchaNum1, setCaptchaNum1] = useState(4);
  const [captchaNum2, setCaptchaNum2] = useState(3);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCaptchaNum1(Math.floor(Math.random() * 8) + 2);
    setCaptchaNum2(Math.floor(Math.random() * 8) + 1);
  }, [currentStep]);

  const toggleMultiSelect = (field, id) => {
    setFormData(prev => {
      const current = prev[field] || [];
      if (current.includes(id)) {
        if (current.length === 1) return prev; // keep at least one
        return { ...prev, [field]: current.filter(item => item !== id) };
      } else {
        return { ...prev, [field]: [...current, id] };
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const goToStep2 = (e) => {
    e.preventDefault();
    setCurrentStep(2);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (parseInt(captchaAnswer, 10) !== captchaNum1 + captchaNum2) {
      setCaptchaError(true);
      setErrorMsg('Veuillez résoudre correctement l\'addition anti-spam.');
      return;
    }

    setLoading(true);

    try {
      const selectedDestTitle = DESTINATION_OPTIONS.find(d => d.id === formData.destination)?.title || formData.destination;
      const selectedBudgetLabel = BUDGET_RANGES.find(b => b.id === formData.budget)?.label || formData.budget;

      const summaryDetails = `
Demande de Devis Sur Mesure & Circuit Accompagné
------------------------------------------------
• Destination : ${selectedDestTitle}
• Ville de Départ : ${formData.villeDepart}
• Date / Période : ${formData.dateDepart || 'Non spécifiée'}
• Durée : ${formData.duree}
• Voyageurs : ${formData.adultes} Adulte(s), ${formData.enfants} Enfant(s)
• Budget : ${selectedBudgetLabel}
• Profil Voyageur : ${formData.voyageurTypes.join(', ')}
• Type de Voyage : ${formData.typesVoyage.join(', ')}
• Attentes Principales : ${formData.attentes.join(', ')}
• Hébergement : ${formData.hebergements.join(', ')}
• Créneau d'appel souhaité : ${formData.creneauAppel}
• Précisions / Message : ${formData.precisions || 'Aucune précision complémentaire'}
      `.trim();

      await createBooking({
        name: `${formData.civilite} ${formData.prenom} ${formData.nom}`,
        email: formData.email,
        phone: formData.phone,
        tourTitle: `Devis Sur Mesure - ${selectedDestTitle}`,
        tourSlug: 'circuit-accompagne',
        travelers: formData.adultes + formData.enfants,
        date: formData.dateDepart || new Date().toISOString().split('T')[0],
        message: summaryDetails
      });

      setSuccess(true);
      setCurrentStep(3);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    } catch (err) {
      console.error('Error submitting devis:', err);
      setErrorMsg(err.response?.data?.message || 'Une erreur est survenue lors de la transmission de votre devis. Veuillez réessayer ou nous contacter par téléphone.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#FAF8F5', color: '#1E293B', minHeight: '100vh', paddingBottom: '60px' }}>
      <SEO pageKey="circuit-accompagne" title="Devis Sur Mesure & Circuits Accompagnés | Jodhpur Voyage" description="Créez votre voyage personnalisé ou circuit accompagné en Inde & Népal avec Jodhpur Voyage. Devis gratuit et conseils sur mesure d'experts locaux." />

      {/* HERO BANNER */}
      <section className="about-hero-section" style={{ minHeight: '340px' }}>
        <img
          src="/images/image-12.jpg"
          alt="Devis Sur Mesure Maisons du Voyage Style"
          className="about-hero-bg"
          onError={(e) => { e.currentTarget.src = '/images/image-12.jpg'; }}
        />
        <div className="container about-hero-content" style={{ textAlign: 'center', paddingTop: '40px' }}>
          <span className="hero-badge" style={{ background: 'rgba(197, 139, 57, 0.95)', color: '#fff', border: 'none' }}>
            <i className="fas fa-magic"></i> Devis Sur Mesure & Circuits Accompagnés
          </span>
          <h1 className="about-hero-title" style={{ fontSize: '2.5rem', marginTop: '12px' }}>
            Votre Demande de Devis Personnalisé
          </h1>
          <p className="about-hero-desc" style={{ maxWidth: '750px', margin: '12px auto 0 auto', opacity: 0.95 }}>
            « Faites-nous part de vos envies de voyage, vous êtes entre de bonnes mains »
          </p>
        </div>
      </section>

      {/* STEPPER PROGRESS BAR */}
      <div className="container" style={{ marginTop: '-35px', position: 'relative', zIndex: 10 }}>
        <div className="circuit-stepper-wrap" style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: currentStep >= 1 ? '#0D9488' : '#94A3B8' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: currentStep >= 1 ? '#0D9488' : '#E2E8F0', color: currentStep >= 1 ? '#fff' : '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.1rem' }}>
              1
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Mon Voyage</div>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Destinations & Attentes</div>
            </div>
          </div>

          <div style={{ height: '2px', width: '60px', background: currentStep >= 2 ? '#0D9488' : '#E2E8F0', display: 'none', WebkitMediaControls: 'block' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: currentStep >= 2 ? '#0D9488' : '#94A3B8' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: currentStep >= 2 ? '#0D9488' : '#E2E8F0', color: currentStep >= 2 ? '#fff' : '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.1rem' }}>
              2
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Mes Coordonnées</div>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Vos coordonnées & appel</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: currentStep === 3 ? '#0D9488' : '#94A3B8' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: currentStep === 3 ? '#0D9488' : '#E2E8F0', color: currentStep === 3 ? '#fff' : '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.1rem' }}>
              3
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Confirmation</div>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Envoi & Suivi</div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER CONTENT */}
      <div className="container" style={{ marginTop: '40px' }}>
        {/* STEP 1: VOYAGE & EN VIES */}
        {currentStep === 1 && (
          <form onSubmit={goToStep2}>
            {/* 1. SELECTION DE DESTINATION */}
            <div className="circuit-form-card" style={{ background: '#fff', borderRadius: '16px', marginBottom: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.4rem', color: '#1E293B', marginBottom: '8px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fas fa-map-marked-alt" style={{ color: '#0D9488' }}></i> Ma destination souhaitée *
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.92rem', marginBottom: '20px' }}>
                Sélectionnez la région que vous souhaitez explorer lors de votre prochain circuit :
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                {DESTINATION_OPTIONS.map((dest) => {
                  const selected = formData.destination === dest.id;
                  return (
                    <div
                      key={dest.id}
                      onClick={() => setFormData({ ...formData, destination: dest.id })}
                      style={{
                        padding: '18px',
                        borderRadius: '12px',
                        border: selected ? '2px solid #0D9488' : '1px solid #CBD5E1',
                        background: selected ? '#F0FDFA' : '#fff',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        justify: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <i className={dest.icon} style={{ fontSize: '1.5rem', color: selected ? '#0D9488' : '#64748B' }}></i>
                        {selected && <i className="fas fa-check-circle" style={{ color: '#0D9488', fontSize: '1.2rem' }}></i>}
                      </div>
                      <strong style={{ fontSize: '1.05rem', color: '#1E293B', marginBottom: '4px' }}>{dest.title}</strong>
                      <span style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: '1.4' }}>{dest.desc}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. DATES, DUREE & VILLE DE DEPART */}
            <div className="circuit-form-card" style={{ background: '#fff', borderRadius: '16px', marginBottom: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.4rem', color: '#1E293B', marginBottom: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fas fa-calendar-alt" style={{ color: '#0D9488' }}></i> Mes dates & durée de voyage *
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: '600' }}>Ville de départ souhaitée</label>
                  <select name="villeDepart" className="form-control" value={formData.villeDepart} onChange={handleInputChange}>
                    <option value="Paris">Paris (CDG / ORY)</option>
                    <option value="Lyon">Lyon</option>
                    <option value="Marseille">Marseille</option>
                    <option value="Nice">Nice</option>
                    <option value="Toulouse">Toulouse</option>
                    <option value="Bruxelles">Bruxelles (Belgique)</option>
                    <option value="Genève">Genève (Suisse)</option>
                    <option value="Sur place">Sans vol (Prise en charge sur place en Inde)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: '600' }}>Date ou mois de départ approximatif</label>
                  <input
                    type="text"
                    name="dateDepart"
                    className="form-control"
                    placeholder="Ex: Novembre 2026 ou 15/02/2026"
                    value={formData.dateDepart}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: '600' }}>Durée estimée du voyage</label>
                  <select name="duree" className="form-control" value={formData.duree} onChange={handleInputChange}>
                    <option value="7-10 jours">7 à 10 jours</option>
                    <option value="10-14 jours">10 à 14 jours (Recommandé)</option>
                    <option value="15-21 jours">15 à 21 jours (Grand Tour)</option>
                    <option value="3 semaines+">Plus de 3 semaines</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. VOYAGEURS & BUDGET */}
            <div className="circuit-form-card" style={{ background: '#fff', borderRadius: '16px', marginBottom: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.4rem', color: '#1E293B', marginBottom: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fas fa-coins" style={{ color: '#0D9488' }}></i> Nombre de voyageurs & Budget *
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '25px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: '600' }}>Adultes (+12 ans)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    name="adultes"
                    className="form-control"
                    value={formData.adultes}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: '600' }}>Enfants (0 à 12 ans)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    name="enfants"
                    className="form-control"
                    value={formData.enfants}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <label className="form-label" style={{ fontWeight: '600', marginBottom: '10px', display: 'block' }}>
                Budget estimé par personne (tout compris sauf vols) :
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                {BUDGET_RANGES.map((b) => {
                  const sel = formData.budget === b.id;
                  return (
                    <div
                      key={b.id}
                      onClick={() => setFormData({ ...formData, budget: b.id })}
                      style={{
                        padding: '14px',
                        borderRadius: '10px',
                        border: sel ? '2px solid #0D9488' : '1px solid #CBD5E1',
                        background: sel ? '#F0FDFA' : '#fff',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <strong style={{ display: 'block', fontSize: '1.05rem', color: sel ? '#0D9488' : '#1E293B' }}>{b.label}</strong>
                      <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{b.sub}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. PERSONNALISATION DE VOTRE VOYAGE (SELECTION MAISONS DU VOYAGE STYLE) */}
            <div className="circuit-form-card" style={{ background: '#fff', borderRadius: '16px', marginBottom: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.4rem', color: '#1E293B', marginBottom: '6px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fas fa-sliders-h" style={{ color: '#0D9488' }}></i> Afin de personnaliser votre voyage, dites-nous ce qui est important pour vous *
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '24px' }}>
                Sélectionnez plusieurs choix dans chaque catégorie :
              </p>

              {/* A. Quel voyageur êtes-vous ? */}
              <div style={{ marginBottom: '28px' }}>
                <h4 style={{ fontSize: '1.05rem', color: '#1E293B', marginBottom: '12px', fontWeight: '600' }}>
                  Quel voyageur êtes-vous ? (choix multiple)
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {VOYAGEUR_TYPES.map((vt) => {
                    const active = formData.voyageurTypes.includes(vt.id);
                    return (
                      <button
                        type="button"
                        key={vt.id}
                        onClick={() => toggleMultiSelect('voyageurTypes', vt.id)}
                        className={`btn btn-sm ${active ? 'btn-primary' : 'btn-outline'}`}
                        style={{ borderRadius: '20px', padding: '8px 16px' }}
                      >
                        <i className={vt.icon} style={{ marginRight: '6px' }}></i> {vt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* B. Quel type de voyage recherchez-vous ? */}
              <div style={{ marginBottom: '28px' }}>
                <h4 style={{ fontSize: '1.05rem', color: '#1E293B', marginBottom: '12px', fontWeight: '600' }}>
                  Quel type de voyage recherchez-vous ? (choix multiple)
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {TYPE_VOYAGE_OPTIONS.map((tv) => {
                    const active = formData.typesVoyage.includes(tv.id);
                    return (
                      <button
                        type="button"
                        key={tv.id}
                        onClick={() => toggleMultiSelect('typesVoyage', tv.id)}
                        className={`btn btn-sm ${active ? 'btn-primary' : 'btn-outline'}`}
                        style={{ borderRadius: '20px', padding: '8px 16px' }}
                      >
                        <i className={tv.icon} style={{ marginRight: '6px' }}></i> {tv.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* C. Quelles sont vos attentes principales ? */}
              <div style={{ marginBottom: '28px' }}>
                <h4 style={{ fontSize: '1.05rem', color: '#1E293B', marginBottom: '12px', fontWeight: '600' }}>
                  Quelles sont vos envies et attentes ? (choix multiple)
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {ATTENTES_OPTIONS.map((att) => {
                    const active = formData.attentes.includes(att.id);
                    return (
                      <button
                        type="button"
                        key={att.id}
                        onClick={() => toggleMultiSelect('attentes', att.id)}
                        className={`btn btn-sm ${active ? 'btn-primary' : 'btn-outline'}`}
                        style={{ borderRadius: '20px', padding: '8px 16px' }}
                      >
                        <i className={att.icon} style={{ marginRight: '6px' }}></i> {att.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* D. Quel type d'hébergement appréciez-vous ? */}
              <div>
                <h4 style={{ fontSize: '1.05rem', color: '#1E293B', marginBottom: '12px', fontWeight: '600' }}>
                  Quel type d’hébergement appréciez-vous ? (choix multiple)
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {HEBERGEMENT_OPTIONS.map((heb) => {
                    const active = formData.hebergements.includes(heb.id);
                    return (
                      <button
                        type="button"
                        key={heb.id}
                        onClick={() => toggleMultiSelect('hebergements', heb.id)}
                        className={`btn btn-sm ${active ? 'btn-primary' : 'btn-outline'}`}
                        style={{ borderRadius: '20px', padding: '8px 16px' }}
                      >
                        <i className={heb.icon} style={{ marginRight: '6px' }}></i> {heb.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* BUTTON NEXT STEP */}
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button type="submit" className="btn btn-primary btn-lg circuit-submit-btn" style={{ padding: '14px 40px', fontSize: '1.1rem' }}>
                Continuer vers mes coordonnées <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: MES COORDONNEES & VALIDATION */}
        {currentStep === 2 && (
          <form onSubmit={handleSubmit}>
            <div className="circuit-form-card" style={{ background: '#fff', borderRadius: '16px', marginBottom: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.5rem', color: '#1E293B', marginBottom: '8px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fas fa-user-check" style={{ color: '#0D9488' }}></i> Mes Coordonnées de Contact *
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.92rem', marginBottom: '24px' }}>
                Indiquez-nous où vous transmettre votre proposition de voyage sur mesure gratuite et sans engagement.
              </p>

              {errorMsg && (
                <div style={{ padding: '14px 18px', background: '#FEE2E2', color: '#B91C1C', borderRadius: '10px', marginBottom: '20px' }}>
                  <i className="fas fa-exclamation-circle"></i> {errorMsg}
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ fontWeight: '600' }}>Civilité *</label>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input type="radio" name="civilite" value="Monsieur" checked={formData.civilite === 'Monsieur'} onChange={handleInputChange} />
                    Monsieur
                  </label>
                  <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input type="radio" name="civilite" value="Madame" checked={formData.civilite === 'Madame'} onChange={handleInputChange} />
                    Madame
                  </label>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: '600' }}>Prénom *</label>
                  <input type="text" name="prenom" className="form-control" placeholder="Votre prénom" required value={formData.prenom} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: '600' }}>Nom *</label>
                  <input type="text" name="nom" className="form-control" placeholder="Votre nom" required value={formData.nom} onChange={handleInputChange} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: '600' }}>Email *</label>
                  <input type="email" name="email" className="form-control" placeholder="exemple@domaine.fr" required value={formData.email} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: '600' }}>Téléphone / WhatsApp *</label>
                  <input type="tel" name="phone" className="form-control" placeholder="+33 6 12 34 56 78" required value={formData.phone} onChange={handleInputChange} />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ fontWeight: '600' }}>Quel est le moment le plus opportun pour vous joindre ?</label>
                <select name="creneauAppel" className="form-control" value={formData.creneauAppel} onChange={handleInputChange}>
                  <option value="Matin (9h-12h)">Matin (9h – 12h)</option>
                  <option value="Après-midi (14h-18h)">Après-midi (14h – 18h)</option>
                  <option value="Soir (18h-20h)">Soir (18h – 20h)</option>
                  <option value="WhatsApp uniquement">Par message WhatsApp uniquement</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ fontWeight: '600' }}>Précisions ou demandes particulières</label>
                <textarea
                  name="precisions"
                  className="form-control"
                  rows="4"
                  placeholder="Avez-vous des villes étapes incontournables, des exigences alimentaires ou des rythmes spécifiques ?"
                  value={formData.precisions}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              {/* Protection Anti-Spam Captcha */}
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
                <label className="form-label" style={{ fontWeight: '600', color: '#1E293B' }}>
                  <i className="fas fa-shield-alt" style={{ color: '#0D9488' }}></i> Protection anti-spam : Combien font {captchaNum1} + {captchaNum2} ? *
                </label>
                <input
                  type="number"
                  className={`form-control ${captchaError ? 'border-danger' : ''}`}
                  placeholder={`Entrez le résultat (${captchaNum1 + captchaNum2})`}
                  required
                  value={captchaAnswer}
                  onChange={(e) => {
                    setCaptchaAnswer(e.target.value);
                    setCaptchaError(false);
                  }}
                  style={{ maxWidth: '240px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <button type="button" onClick={() => setCurrentStep(1)} className="btn btn-outline">
                  <i className="fas fa-arrow-left"></i> Modifier mon voyage
                </button>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                  {loading ? (
                    <><i className="fas fa-spinner fa-spin"></i> Transmission en cours...</>
                  ) : (
                    <>Valider et recevoir mon devis <i className="fas fa-paper-plane" style={{ marginLeft: '6px' }}></i></>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* STEP 3: CONFIRMATION */}
        {currentStep === 3 && (
          <div className="circuit-form-card" style={{ background: '#fff', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 25px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#F0FDFA', color: '#0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', fontSize: '2.5rem' }}>
              <i className="fas fa-check-circle"></i>
            </div>
            <h2 style={{ fontSize: '1.8rem', color: '#1E293B', fontWeight: '700', marginBottom: '12px' }}>
              Votre demande de devis sur mesure a été transmise !
            </h2>
            <p style={{ color: '#64748B', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '30px' }}>
              Merci <strong>{formData.civilite} {formData.prenom} {formData.nom}</strong>. Nos conseillers francophones basés en Inde étudient dès à présent vos choix et prépareront un itinéraire personnalisé adapté à vos dates et votre budget.
            </p>

            <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '12px', textAlign: 'left', marginBottom: '30px', border: '1px solid #E2E8F0' }}>
              <h4 style={{ color: '#0D9488', fontSize: '1.1rem', marginBottom: '12px', fontWeight: '700' }}>
                <i className="fas fa-clipboard-list"></i> Récapitulatif de votre projet :
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '1.8', color: '#334155' }}>
                <li><strong>Destination :</strong> {DESTINATION_OPTIONS.find(d => d.id === formData.destination)?.title}</li>
                <li><strong>Départ :</strong> {formData.villeDepart} ({formData.dateDepart || 'Dates flexibles'})</li>
                <li><strong>Durée & Voyageurs :</strong> {formData.duree} – {formData.adultes} Adulte(s) {formData.enfants > 0 ? `, ${formData.enfants} Enfant(s)` : ''}</li>
                <li><strong>Budget :</strong> {BUDGET_RANGES.find(b => b.id === formData.budget)?.label}</li>
                <li><strong>Créneau d'appel :</strong> {formData.creneauAppel}</li>
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
              <Link to="/" className="btn btn-primary">
                Retourner à l'accueil
              </Link>
              <a href="https://wa.me/919650698669" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ borderColor: '#25D366', color: '#25D366' }}>
                <i className="fab fa-whatsapp"></i> Échanger sur WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CircuitAccompagne;
