import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { submitCustomTrip } from '../services/api';
import SEO from '../components/SEO';

const destinationsChoices = [
  { value: 'Rajasthan', icon: 'fa-crown', label: 'Rajasthan' },
  { value: 'Inde du Nord', icon: 'fa-gopuram', label: 'Inde du Nord' },
  { value: 'Inde du Sud', icon: 'fa-water', label: 'Inde du Sud' },
  { value: 'Gujarat', icon: 'fa-campground', label: 'Gujarat' },
  { value: 'Karnataka', icon: 'fa-monument', label: 'Karnataka' },
  { value: 'Ladakh', icon: 'fa-mountain', label: 'Ladakh' },
  { value: 'Népal', icon: 'fa-hiking', label: 'Népal' },
  { value: 'Orissa', icon: 'fa-place-of-worship', label: 'Orissa' },
  { value: 'Promo d’été', icon: 'fa-sun', label: 'Promo d’été' }
];

const themesData = [
  {
    icon: 'fa-landmark',
    title: 'Histoire & Architecture',
    desc: 'Forteresses majestueuses, palais rajput, temples sacrés et monuments classés au patrimoine UNESCO.'
  },
  {
    icon: 'fa-crown',
    title: 'Maharajas & Luxe',
    desc: 'Hôtels de patrimoine, havelis historiques et palais princiers pour une immersion royale.'
  },
  {
    icon: 'fa-tree',
    title: 'Grands Espaces Verts',
    desc: 'Plantations de thé verdoyantes, vallées de l\'Himalaya, backwaters d\'émeraude et désert du Thar.'
  },
  {
    icon: 'fa-om',
    title: 'Yoga & Spiritualité',
    desc: 'Retraites bien-être à Rishikesh, cérémonies Ganga Aarti et méditation au bord des fleuves sacrés.'
  },
  {
    icon: 'fa-music',
    title: 'Musique & Danse',
    desc: 'Festivals folkloriques rajasthanis, spectacles de Kathakali et rythmes traditionnels envoûtants.'
  },
  {
    icon: 'fa-utensils',
    title: 'Cuisine & Gastronomie',
    desc: 'Ateliers de cuisine chez l\'habitant, marchés aux épices colorés et spécialités régionales raffinées.'
  },
  {
    icon: 'fa-hippo',
    title: 'Safaris & Faune Sauvage',
    desc: 'Observation du tigre du Bengale, éléphants sauvages et biodiversité exceptionnelle dans les parcs nationaux.'
  },
  {
    icon: 'fa-home',
    title: 'Chez l\'Habitant & Cabanes',
    desc: 'Immersion authentique, cabanes traditionnelles en terre et nuits magiques sous les étoiles du désert.'
  }
];

const faqData = [
  {
    question: 'Comment se déroule la création de mon voyage sur mesure ?',
    answer:
      'Après avoir soumis votre formulaire, un conseiller francophone de notre équipe à Jodhpur étudie vos demandes et crée une proposition d\'itinéraire détaillée sous 24 heures. Nous ajustons ensuite les étapes, hôtels et activités autant de fois que nécessaire.'
  },
  {
    question: 'Le devis sur mesure est-il payant ou contraignant ?',
    answer:
      'Absolument pas ! Tous nos devis et conseils de voyage personnalisés sont 100% gratuits et sans aucun engagement de votre part.'
  },
  {
    question: 'Peut-on combiner plusieurs régions comme le Rajasthan et le Népal ?',
    answer:
      'Oui, tout à fait. Nos 20 ans d\'expérience sur l\'Inde et le Népal nous permettent de créer des combinés harmonieux (ex: Rajasthan + Varanasi + Népal ou Inde du Nord + Kerala).'
  },
  {
    question: 'Aurons-nous un chauffeur privé dédié ?',
    answer:
      'Oui. Pour votre confort et votre sécurité, tous nos voyages sur mesure incluent un véhicule privé confortable avec chauffeur professionnel dédié pour l\'intégralité de vos trajets terrestres.'
  }
];

const VoyageSurMesure = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDestinations, setSelectedDestinations] = useState(['Rajasthan']);
  const [selectedBudget, setSelectedBudget] = useState('Standard / Hôtels de Charme');
  const [formData, setFormData] = useState({
    departure_date: '',
    duration: '',
    accommodation_style: 'Hôtels de charme & Haveli 3-4 étoiles',
    your_message: '',
    full_name: '',
    your_email: '',
    your_phone: '',
    captcha_answer: ''
  });

  const [captcha, setCaptcha] = useState({ num1: 4, num2: 3 });
  const [openFaq, setOpenFaq] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const n1 = Math.floor(Math.random() * 5) + 3;
    const n2 = Math.floor(Math.random() * 5) + 1;
    setCaptcha({ num1: n1, num2: n2 });

    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDestination = (destValue) => {
    setSelectedDestinations((prev) =>
      prev.includes(destValue) ? prev.filter((d) => d !== destValue) : [...prev, destValue]
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (currentStep === 0 && selectedDestinations.length === 0) {
      alert('Veuillez sélectionner au moins une destination.');
      return;
    }
    if (currentStep === 1 && (!formData.departure_date || !formData.duration)) {
      alert('Veuillez renseigner une date de départ et une durée de séjour.');
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 2));
    const formElement = document.getElementById('formulaire-sur-mesure');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    const formElement = document.getElementById('formulaire-sur-mesure');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(formData.captcha_answer) !== captcha.num1 + captcha.num2) {
      setErrorMessage('Calcul anti-spam incorrect. Veuillez corriger le résultat.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await submitCustomTrip({
        client: {
          firstName: formData.full_name.split(' ')[0] || formData.full_name,
          lastName: formData.full_name.split(' ').slice(1).join(' ') || '',
          email: formData.your_email,
          phone: formData.your_phone
        },
        tourTitle: `Sur Mesure: ${selectedDestinations.join(', ')}`,
        departureDate: formData.departure_date,
        duration: formData.duration,
        budget: selectedBudget,
        accommodation: formData.accommodation_style,
        destinations: selectedDestinations,
        specialRequests: formData.your_message,
        status: 'nouveau'
      });

      setSubmitSuccess(true);
      const formElement = document.getElementById('formulaire-sur-mesure');
      if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setErrorMessage('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <SEO pageKey="voyage-sur-mesure" />
      {/* =========================================================================
          HERO BANNER SECTION
          ========================================================================= */}
      <section className="mesure-hero-section">
        <img
          src="/images/image-12.jpg"
          alt="Voyage Sur Mesure Banner"
          className="mesure-hero-bg"
        />
        <div className="container mesure-hero-content">
          <span className="hero-badge">Sur Mesure</span>
          <h1 className="mesure-hero-title">Voyage Sur Mesure en Inde & Népal</h1>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: PRESENTATION DU VOYAGE SUR MESURE
          ========================================================================= */}
      <section id="decouvrir-philosophie" className="section-padding bg-white">
        <div className="container">
          <div className="welcome-grid">
            {/* Left: Complete Written Content */}
            <div className="welcome-content">
              <span className="section-subtitle">
                <i className="fas fa-compass"></i> Agence de Voyage Locale Francophone en Inde
              </span>
              <h2 className="welcome-title about-title">
                Voyage sur mesure en Inde & Népal
              </h2>

              <p className="welcome-lead">
                <em>Jodhpur Voyage</em> vous propose un voyage sur mesure en Inde, adapté à votre rythme, à votre budget, à vos goûts et à vos envies, et organisé par une agence de voyage locale francophone.
              </p>

              <p className="contact-lead-desc">
                En Inde et au Népal, Jodhpur Voyage s’efforce de vous offrir un voyage personnalisé qui reflète vos envies. Que vous souhaitiez un itinéraire classique ou un voyage hors des sentiers battus, nous sommes à l’écoute. Nous tissons{' '}
                <span className="highlight-pill-gold">
                  <i className="fas fa-check"></i> des séjours personnalisés
                </span>{' '}
                qui correspondent aux attentes de chacun. Ils s’adaptent aux gros et aux petits budgets, aux familles, aux aventuriers, aux artistes, aux aventuriers-artistes et à tous ceux qui veulent se lancer ou se relancer dans la découverte de notre pays.
              </p>

              {/* Feature Quote Callout */}
              <div className="content-feature-quote">
                <i className="fas fa-quote-right quote-bg-icon"></i>
                <p>
                  "Nous intervenons dans l’organisation selon votre demande. Nous l’organisons de <strong>A à Z</strong> s’il le faut. Ou, pour ceux qui savent déjà ce qu’ils veulent, nous mettons notre expérience et notre réseau en œuvre afin de vous offrir l’expérience que vous recherchez."
                </p>
              </div>

              <p className="contact-lead-desc">
                Pour créer votre voyage personnalisé, rien de plus simple,{' '}
                <span className="highlight-pill-teal">
                  <i className="fas fa-paper-plane"></i> parlez nous de votre voyage idéal !
                </span>{' '}
                Dites-nous si vous préférez axer votre voyage sur les grands espaces verts, la musique, la danse, la cuisine locale, l’Histoire, l’architecture, les maharajas, les grands mammifères du sous-continent indien, le yoga… ou concocter un mélange à l’image de la diversité de l’Inde et du Népal. N’hésitez pas à vous inspirer de nos circuits tout faits (A consulter dans ‘destinations’ dans notre menu principal) créés après <strong>20+ ans d’expérience</strong> dans le domaine. Dites-nous si vous voulez des hôtels de luxe, des cabanes en terre, séjourner chez l’habitant, un véhicule, un chauffeur, un guide… personnalisez vos itinéraires au détail près.
              </p>

              <div className="mesure-cta-callout" style={{ color: '#ffffff' }}>
                <div className="cta-callout-icon" style={{ background: 'linear-gradient(135deg, #D97706, #B45309)', color: '#ffffff' }}>
                  <i className="fas fa-paper-plane"></i>
                </div>
                <div className="cta-callout-text">
                  <strong className="contact-info-title" style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 700, display: 'block' }}>
                    Écrivez-nous à travers le formulaire ci-dessous.
                  </strong>
                  <span className="badge-verify-text" style={{ color: '#E2E8F0', fontSize: '0.92rem', display: 'block', marginTop: '4px' }}>
                    Tout un monde vous attend. À bientôt ! 🙂
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Visual Collage Showcase */}
            <div className="welcome-collage-wrap">
              <div className="welcome-collage">
                <div className="collage-main-frame">
                  <img
                    src="/images/dest-tajmahal.jpg"
                    alt="Taj Mahal & Splendeur de l'Inde"
                    className="collage-img-main"
                    style={{ objectPosition: 'center 30%' }}
                  />
                  <div className="collage-img-overlay"></div>
                </div>

                <div className="collage-secondary-frame">
                  <img
                    src="/images/dest-nepal.jpg"
                    alt="Népal & Sommets de l'Himalaya"
                    className="collage-img-secondary"
                    style={{ objectPosition: 'center center' }}
                  />
                </div>

                <div className="collage-badge-experience">
                  <div className="badge-stars">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <div className="collage-badge-number">20+</div>
                  <div className="collage-badge-text">Ans d'Expérience</div>
                  <div className="badge-subtext">en Inde & Népal</div>
                </div>

                <div className="collage-badge-floating-tag">
                  <i className="fas fa-award"></i>
                  <span>Sur Mesure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: THEMATIC EXPERIENCES GRID
          ========================================================================= */}
      <section className="section-padding bg-cream">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Personnalisez selon vos Passions</span>
            <h2 className="section-title">Parlez-nous de Votre Voyage Idéal</h2>
            <p className="section-description">
              Du séjour de luxe en palais de maharajas aux cabanes en terre chez l'habitant, composez le mélange parfait à l'image de la diversité de l'Inde et du Népal.
            </p>
          </div>

          <div className="theme-grid">
            {themesData.map((theme, idx) => (
              <div key={idx} className="theme-card">
                <div className="theme-card-icon">
                  <i className={`fas ${theme.icon}`}></i>
                </div>
                <h3 className="theme-card-title">{theme.title}</h3>
                <p className="theme-card-desc">{theme.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: INTERACTIVE MULTI-STEP FORM
          ========================================================================= */}
      <section id="formulaire-sur-mesure" className="section-padding bg-white">
        <div className="container form-container-sm">
          <div className="section-header">
            <span className="section-subtitle">Devis Gratuit & Sans Engagement</span>
            <h2 className="section-title">Concevez Votre Voyage sur Mesure</h2>
            <p className="section-description">
              Remplissez ce formulaire et notre équipe d'experts francophones à Jodhpur dessinera votre itinéraire idéal sous 24h.
            </p>
          </div>

          <div className="form-card-container">
            {submitSuccess ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: '#dcfce7',
                    color: '#15803d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px auto',
                    fontSize: '2.5rem'
                  }}
                >
                  <i className="fas fa-check"></i>
                </div>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--color-dark)', marginBottom: '14px' }}>
                  Merci {formData.full_name} ! Votre demande a été envoyée
                </h3>
                <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', lineHeight: '1.7', marginBottom: '24px' }}>
                  Notre conseiller local étudie votre projet et vous transmettra une proposition d'itinéraire détaillée sous <strong>24h ouvrées</strong> sur <strong>{formData.your_email}</strong>.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setSubmitSuccess(false);
                    setCurrentStep(0);
                  }}
                >
                  Créer un autre projet
                </button>
              </div>
            ) : (
              <>
                {/* Step Indicators */}
                <div className="form-step-progress">
                  <div
                    className={`step-indicator ${currentStep === 0 ? 'active' : ''}`}
                    onClick={() => setCurrentStep(0)}
                  >
                    <div className="step-number">1</div>
                    <div className="step-label">Destinations</div>
                  </div>
                  <div
                    className={`step-indicator ${currentStep === 1 ? 'active' : ''}`}
                    onClick={() => setCurrentStep(1)}
                  >
                    <div className="step-number">2</div>
                    <div className="step-label">Dates & Budget</div>
                  </div>
                  <div
                    className={`step-indicator ${currentStep === 2 ? 'active' : ''}`}
                    onClick={() => setCurrentStep(2)}
                  >
                    <div className="step-number">3</div>
                    <div className="step-label">Vos Souhaits & Contact</div>
                  </div>
                </div>

                {errorMessage && (
                  <div
                    className="toast-notification error"
                    style={{ position: 'static', marginBottom: '20px', width: '100%' }}
                  >
                    <i className="fas fa-exclamation-triangle"></i>
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} id="custom-trip-form">
                  {/* STEP 1: DESTINATIONS */}
                  {currentStep === 0 && (
                    <div className="form-step active">
                      <h3 className="form-step-title">
                        1. Quelle(s) destination(s) souhaitez-vous visiter ? *
                      </h3>
                      <p className="badge-verify-text">
                        Sélectionnez une ou plusieurs régions parmi nos destinations phares en Inde et au Népal.
                      </p>

                      <div className="choice-card-grid">
                        {destinationsChoices.map((item, idx) => {
                          const isSelected = selectedDestinations.includes(item.value);
                          return (
                            <label
                              key={idx}
                              className={`choice-card ${isSelected ? 'selected' : ''}`}
                              onClick={(e) => {
                                e.preventDefault();
                                toggleDestination(item.value);
                              }}
                            >
                              <input
                                type="checkbox"
                                name="destination"
                                value={item.value}
                                checked={isSelected}
                                readOnly
                              />
                              <span>
                                <i className={`fas ${item.icon}`}></i> {item.label}
                              </span>
                            </label>
                          );
                        })}
                      </div>

                      <div className="reviews-cta-card" style={{ marginTop: '24px', textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn btn-primary btn-next-step"
                          onClick={handleNextStep}
                        >
                          Étape suivante <i className="fas fa-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: DATES, DURATION & BUDGET */}
                  {currentStep === 1 && (
                    <div className="form-step active">
                      <h3 className="form-step-title">
                        2. Vos dates, durée & budget estimé
                      </h3>
                      <p className="badge-verify-text">
                        Nos circuits s'adaptent aussi bien aux petits qu'aux gros budgets.
                      </p>

                      <div className="form-row-2col">
                        <div className="form-group">
                          <label className="form-label">
                            <i className="fas fa-calendar-alt"></i> Date de départ estimée *
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            name="departure_date"
                            value={formData.departure_date}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">
                            <i className="fas fa-clock"></i> Nombre de jours *
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="duration"
                            placeholder="Ex: 12 jours, 2 semaines..."
                            value={formData.duration}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group-mb" style={{ marginTop: '20px' }}>
                        <label className="form-label">
                          <i className="fas fa-hotel"></i> Gamme d'hébergement & Confort *
                        </label>
                        <div className="choice-card-grid">
                          {[
                            'Économique / Essentiel',
                            'Standard / Hôtels de Charme',
                            'Confort & Havelis de Patrimoine',
                            'Luxe & Palais de Maharajas'
                          ].map((b, idx) => (
                            <label
                              key={idx}
                              className={`choice-card ${selectedBudget === b ? 'selected' : ''}`}
                              onClick={() => setSelectedBudget(b)}
                            >
                              <input
                                type="radio"
                                name="budget"
                                value={b}
                                checked={selectedBudget === b}
                                readOnly
                              />
                              <span>{b}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="form-group-mb" style={{ marginTop: '20px' }}>
                        <label className="form-label">
                          <i className="fas fa-bed"></i> Style d'hébergement & transport préféré
                        </label>
                        <select
                          className="form-control"
                          name="accommodation_style"
                          value={formData.accommodation_style}
                          onChange={handleChange}
                        >
                          <option value="Hôtels de charme & Haveli 3-4 étoiles">
                            Hôtels de charme & Haveli du patrimoine (3-4 étoiles)
                          </option>
                          <option value="Palais des Maharajas de Luxe 5 étoiles">
                            Palais des Maharajas de Luxe (5 étoiles)
                          </option>
                          <option value="Séjour chez l'habitant & Cabanes en terre">
                            Séjour chez l'habitant & Cabanes en terre
                          </option>
                          <option value="Mélange sur mesure">
                            Mélange personnalisé selon les étapes
                          </option>
                        </select>
                      </div>

                      <div
                        className="reviews-cta-card"
                        style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}
                      >
                        <button
                          type="button"
                          className="btn btn-outline btn-prev-step"
                          onClick={handlePrevStep}
                        >
                          <i className="fas fa-arrow-left"></i> Précédent
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary btn-next-step"
                          onClick={handleNextStep}
                        >
                          Étape suivante <i className="fas fa-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: SPECIFIC DESIRES & CONTACT */}
                  {currentStep === 2 && (
                    <div className="form-step active">
                      <h3 className="form-step-title">
                        3. Vos étapes, ce que vous aimez & vos coordonnées
                      </h3>
                      <p className="badge-verify-text">
                        Dites-nous tout sur votre projet : grands espaces, musique, danse, cuisine, Histoire, maharajas, faune, yoga, véhicule avec chauffeur, guide francophone...
                      </p>

                      <div className="form-group-mb">
                        <label className="form-label">
                          <i className="fas fa-heart"></i> Vos étapes & ce que vous aimez *
                        </label>
                        <textarea
                          className="form-control"
                          name="your_message"
                          rows="5"
                          placeholder="Parlez-nous de votre voyage idéal : étapes souhaitées, rythme de voyage, activités (safari, cours de cuisine, yoga), chauffeur privé, guide francophone..."
                          value={formData.your_message}
                          onChange={handleChange}
                          required
                        ></textarea>
                      </div>

                      <div className="form-row-2col" style={{ marginTop: '16px' }}>
                        <div className="form-group">
                          <label className="form-label">
                            <i className="fas fa-user"></i> Nom complet *
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="full_name"
                            placeholder="Votre prénom et nom"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">
                            <i className="fas fa-envelope"></i> Email *
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            name="your_email"
                            placeholder="votre.email@domaine.fr"
                            value={formData.your_email}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">
                            <i className="fas fa-phone-alt"></i> Téléphone / WhatsApp *
                          </label>
                          <input
                            type="tel"
                            className="form-control"
                            name="your_phone"
                            placeholder="+33 6 12 34 56 78"
                            value={formData.your_phone}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      {/* Anti-Spam Captcha Field */}
                      <div className="form-group spam-verify-group" style={{ marginTop: '16px' }}>
                        <label className="form-label">
                          <i className="fas fa-shield-alt"></i> Protection Anti-Spam : Combien font <span>{captcha.num1}</span> + <span>{captcha.num2}</span> ? *
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="captcha_answer"
                          placeholder="Entrez le résultat"
                          value={formData.captcha_answer}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div
                        className="reviews-cta-card"
                        style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}
                      >
                        <button
                          type="button"
                          className="btn btn-outline btn-prev-step"
                          onClick={handlePrevStep}
                        >
                          <i className="fas fa-arrow-left"></i> Précédent
                        </button>
                        <button
                          type="submit"
                          className="btn btn-secondary btn-lg btn-submit-step"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <span><i className="fas fa-spinner fa-spin"></i> Envoi en cours...</span>
                          ) : (
                            <span>Envoyer ma demande sur mesure <i className="fas fa-paper-plane"></i></span>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: HOW IT WORKS (COMMENT CA MARCHE ?)
          ========================================================================= */}
      <section className="section-padding bg-cream">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Simplicité & Transparence</span>
            <h2 className="section-title">Comment Nous Créons Votre Voyage sur Mesure</h2>
            <p className="section-description">
              De votre première idée à votre retour chez vous, bénéficiez de l'accompagnement personnalisé de notre agence locale francophone.
            </p>
          </div>

          <div className="process-grid">
            <div className="process-card">
              <div className="process-step-num">1</div>
              <div className="process-icon">
                <i className="fas fa-edit"></i>
              </div>
              <h3 className="process-title">Exprimez Vos Envies</h3>
              <p className="process-desc">
                Remplissez notre formulaire en indiquant vos dates, votre budget et les thèmes qui vous passionnent.
              </p>
            </div>

            <div className="process-card">
              <div className="process-step-num">2</div>
              <div className="process-icon">
                <i className="fas fa-comments"></i>
              </div>
              <h3 className="process-title">Échange Francophone</h3>
              <p className="process-desc">
                Un expert voyage basé à Jodhpur étudie votre projet et affine l'itinéraire avec vous sous 24h.
              </p>
            </div>

            <div className="process-card">
              <div className="process-step-num">3</div>
              <div className="process-icon">
                <i className="fas fa-sliders-h"></i>
              </div>
              <h3 className="process-title">Devis Personnalisé</h3>
              <p className="process-desc">
                Recevez un programme détaillé jour par jour, révisable au détail près selon vos préférences.
              </p>
            </div>

            <div className="process-card">
              <div className="process-step-num">4</div>
              <div className="process-icon">
                <i className="fas fa-car-side"></i>
              </div>
              <h3 className="process-title">Voyagez en Sérénité</h3>
              <p className="process-desc">
                Accueil VIP, véhicule privé avec chauffeur attentionné et assistance francophone 24h/7j sur place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: REGIONAL DESTINATIONS
          ========================================================================= */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Inspirations de Circuits</span>
            <h2 className="section-title">Explorez Nos Régions Phares</h2>
            <p className="section-description">
              Inspirez-vous de nos circuits tout faits créés après 20 ans d'expérience sur le terrain.
            </p>
          </div>

          <div className="region-cards-grid">
            <div className="region-card">
              <div className="region-card-header">
                <div className="region-card-icon">
                  <i className="fas fa-crown"></i>
                </div>
                <h3 className="region-card-title">Rajasthan</h3>
              </div>
              <p className="region-card-text">
                Le Rajasthan est le second État le plus touristique de l'Inde. Découvrez les splendeurs du Rajasthan, ses puissantes forteresses et ses palais de maharajas.
              </p>
              <Link to="/category/rajasthan" className="region-card-link">
                Découvrir les circuits <i className="fas fa-arrow-right"></i>
              </Link>
            </div>

            <div className="region-card">
              <div className="region-card-header">
                <div className="region-card-icon">
                  <i className="fas fa-gopuram"></i>
                </div>
                <h3 className="region-card-title">Inde du Nord</h3>
              </div>
              <p className="region-card-text">
                Le côtoiement des cultures par ses temples et ses mosquées. Les différents paysages, les provinces de l'Himalaya avec ses glaciers scintillants, ses plaines et les dunes sablonneuses du désert.
              </p>
              <Link to="/destinations" className="region-card-link">
                Découvrir les circuits <i className="fas fa-arrow-right"></i>
              </Link>
            </div>

            <div className="region-card">
              <div className="region-card-header">
                <div className="region-card-icon">
                  <i className="fas fa-water"></i>
                </div>
                <h3 className="region-card-title">Inde du Sud</h3>
              </div>
              <p className="region-card-text">
                Traversée du Sud de l’Inde de Chennai à la côte est à Cochin à la côte ouest. Au programme : les temples pyramidaux et colorés du Sud, l’ancien comptoir français de Pondichéry, l’ashram Aurobindo...
              </p>
              <Link to="/destinations" className="region-card-link">
                Découvrir les circuits <i className="fas fa-arrow-right"></i>
              </Link>
            </div>

            <div className="region-card">
              <div className="region-card-header">
                <div className="region-card-icon">
                  <i className="fas fa-campground"></i>
                </div>
                <h3 className="region-card-title">Gujarat</h3>
              </div>
              <p className="region-card-text">
                Séjour au Rajasthan et Gujarat, Voyage au Gujarat, Circuit au Gujarat, Vacance Gujarat, Circuit des villages Gujarat et artisanat ancestral.
              </p>
              <Link to="/destinations" className="region-card-link">
                Découvrir les circuits <i className="fas fa-arrow-right"></i>
              </Link>
            </div>

            <div className="region-card">
              <div className="region-card-header">
                <div className="region-card-icon">
                  <i className="fas fa-monument"></i>
                </div>
                <h3 className="region-card-title">Karnataka</h3>
              </div>
              <p className="region-card-text">
                Sa côte de sable blanc étincelant, les ruines saisissantes d'Hampi et l'opulence du palais de Mysore comptent parmi les nombreux atouts de cet État du sud-ouest de l'Inde.
              </p>
              <Link to="/destinations" className="region-card-link">
                Découvrir les circuits <i className="fas fa-arrow-right"></i>
              </Link>
            </div>

            <div className="region-card">
              <div className="region-card-header">
                <div className="region-card-icon">
                  <i className="fas fa-mountain"></i>
                </div>
                <h3 className="region-card-title">Ladakh</h3>
              </div>
              <p className="region-card-text">
                Ancien royaume bouddhiste situé sur les hauteurs de l'Himalaya offrant quelques uns des paysages les plus impressionnants de l'Inde et abritant de magnifiques monastères.
              </p>
              <Link to="/destinations" className="region-card-link">
                Découvrir les circuits <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: WHY CHOOSE JODHPUR VOYAGE
          ========================================================================= */}
      <section className="section-padding bg-dark text-white">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle score-stars">Nos Engagements Qualité</span>
            <h2 className="section-title text-white">Pourquoi Voyager Avec Jodhpur Voyage ?</h2>
            <p className="section-description badge-verify-text">
              Des garanties solides pour un séjour personnalisé d'exception en Inde & Népal.
            </p>
          </div>

          <div className="why-us-grid">
            <div className="why-us-card">
              <i className="fas fa-user-shield why-us-icon"></i>
              <h4 className="why-us-card-title">Agence Locale Directe</h4>
              <p className="why-us-card-desc">Basée à Jodhpur, sans intermédiaire, pour le meilleur rapport qualité/prix.</p>
            </div>

            <div className="why-us-card">
              <i className="fas fa-hand-holding-usd why-us-icon"></i>
              <h4 className="why-us-card-title">Tous Budgets</h4>
              <p className="why-us-card-desc">Du séjour économique chez l'habitant aux palais de maharajas les plus exclusifs.</p>
            </div>

            <div className="why-us-card">
              <i className="fas fa-car why-us-icon"></i>
              <h4 className="why-us-card-title">Chauffeur Privé</h4>
              <p className="why-us-card-desc">Véhicule climatisé récent et chauffeur francophone ou anglophone expérimenté.</p>
            </div>

            <div className="why-us-card">
              <i className="fas fa-headset why-us-icon"></i>
              <h4 className="why-us-card-title">Assistance 24/7</h4>
              <p className="why-us-card-desc">Un contact francophone réactif à votre disposition tout au long de votre parcours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: FAQ SUR MESURE
          ========================================================================= */}
      <section className="section-padding bg-cream">
        <div className="container form-container-sm">
          <div className="section-header">
            <span className="section-subtitle">Vos Questions</span>
            <h2 className="section-title">Questions Fréquentes sur le Sur Mesure</h2>
          </div>

          <div className="accordion-container">
            {faqData.map((item, idx) => (
              <div key={idx} className={`accordion-item ${openFaq === idx ? 'active' : ''}`}>
                <div
                  className="accordion-header"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <span className="accordion-title">
                    <i className="fas fa-question-circle"></i> {item.question}
                  </span>
                  <i
                    className={`fas fa-chevron-down accordion-icon ${openFaq === idx ? 'rotate' : ''}`}
                  ></i>
                </div>
                {openFaq === idx && (
                  <div className="accordion-body">
                    <p className="contact-lead-desc">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
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

export default VoyageSurMesure;
