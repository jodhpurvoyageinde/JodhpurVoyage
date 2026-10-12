import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { fetchPageContent } from '../services/api';

const InfosPratiques = () => {
  const [pageData, setPageData] = useState(null);
  const [activeVocabTab, setActiveVocabTab] = useState('presentation');

  useEffect(() => {
    fetchPageContent('infos-pratiques')
      .then(res => {
        if (res.data) setPageData(res.data);
      })
      .catch(err => console.error('Error fetching infos-pratiques page content:', err));

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
    const t2 = setTimeout(checkAndScrollToHash, 450);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const hero = pageData?.hero || {};

  return (
    <div style={{ backgroundColor: '#FAF8F5', color: '#1E293B' }}>
      <SEO pageKey="infos-pratiques" />

      {/* HERO BANNER SECTION */}
      <section className="infos-hero-section" id="hero">
        <img 
          src={hero.bgImage || "/images/image-6.jpg"} 
          onError={(e) => { e.currentTarget.src = "/images/image-6.jpg"; }}
          alt="Infos Pratiques Banner" 
          className="infos-hero-bg" 
        />
        <div className="container infos-hero-content">
          <span className="hero-badge">{hero.badge || "Infos Pratiques"}</span>
          <h1 className="infos-hero-title">{hero.title || "Infos Pratiques & Conseils de Voyage en Inde & Népal"}</h1>
          <p className="infos-hero-desc" style={{ color: '#fff', opacity: 0.9, marginTop: '12px', maxWidth: '750px' }}>
            {hero.description || "Toutes les informations essentielles pour préparer votre voyage : visas, climat, santé, monnaie, coutumes, vocabulaire et calendrier des fêtes."}
          </p>
        </div>
      </section>

      {/* QUICK SUMMARY KPI CARDS */}
      <section className="section-padding bg-cream" id="kpis">
        <div className="container">
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-icon-circle"><i className="fas fa-clock"></i></div>
              <div>
                <div className="kpi-label">Décalage Horaire</div>
                <div className="kpi-value">+4h30 (Hiver) / +3h30 (Été)</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon-circle"><i className="fas fa-coins"></i></div>
              <div>
                <div className="kpi-label">Monnaie Officielle</div>
                <div className="kpi-value">Roupie Indienne (INR)</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon-circle"><i className="fas fa-calendar-check"></i></div>
              <div>
                <div className="kpi-label">Meilleure Période</div>
                <div className="kpi-value">Mi-Novembre à Fin Mars</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon-circle"><i className="fas fa-passport"></i></div>
              <div>
                <div className="kpi-label">Visa Obligatoire</div>
                <div className="kpi-value">e-Tourist Visa (eTV) / VFS</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: VISAS & FORMALITES D'ENTREE
          ========================================================================= */}
      <section id="visas-formalites" className="section-padding bg-white">
        <div id="visa-inde-nepal"></div>
        <div id="visa-inde"></div>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Passeport & Démarches Officielles</span>
            <h2 className="section-title">Visas & Formalités d'Entrée en Inde & Népal</h2>
            <p className="section-description">
              Le guide complet étape par étape pour l'obtention de votre visa touristique électronique ou classique.
            </p>
          </div>

          <div className="visas-grid">
            {/* Left Column: e-Visa & VFS Procedure */}
            <div>
              <div className="visas-main-card">
                <h3 className="visas-card-title">
                  <i className="fas fa-laptop"></i> Procédure pour l'obtention d’un visa électronique (e-Tourist Visa)
                </h3>
                <p className="contact-lead-desc">
                  Le site officiel du gouvernement indien pour effectuer votre demande en ligne est :{' '}
                  <a href="https://indianvisaonline.gov.in/visa/tvoa.html" target="_blank" rel="noopener noreferrer" className="footer-contact-link" style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}>
                    https://indianvisaonline.gov.in/visa/tvoa.html
                  </a>. Vous y trouverez la liste complète des instructions à suivre (en anglais) et des documents à fournir.
                </p>

                <h4 className="visas-sub-title">Nouveau ! Les 3 choix pour le E-Visa (depuis août 2019) :</h4>
                <ul className="visas-list">
                  <li className="visas-list-item">
                    <i className="fas fa-check-circle" style={{ color: '#0D9488' }}></i>
                    <span><strong>E-Visa 1 an (Multiples entrées) :</strong> Valide 1 an à compter de la délivrance, entrées multiples de 90 jours maximum par séjour. Frais consulaires de 39 € (recommandé pour éviter tout problème de validité).</span>
                  </li>
                  <li className="visas-list-item">
                    <i className="fas fa-check-circle" style={{ color: '#0D9488' }}></i>
                    <span><strong>E-Visa 30 jours (Haute saison Juil-Mars) :</strong> Valide 30 jours pour 2 entrées (1ère entrée entre juillet et mars). Frais consulaires de 25 €.</span>
                  </li>
                  <li className="visas-list-item">
                    <i className="fas fa-check-circle" style={{ color: '#0D9488' }}></i>
                    <span><strong>E-Visa 30 jours (Basse saison Avril-Juin) :</strong> Valide 30 jours pour 2 entrées (1ère entrée en avril-mai-juin). Frais consulaires de 11 €.</span>
                  </li>
                </ul>
                <p style={{ fontSize: '0.9rem', color: '#64748B', fontStyle: 'italic', marginTop: '10px' }}>
                  * À savoir : Les e-visas de 30 jours ne peuvent être demandés que 1 mois avant l'entrée en Inde. En haute saison, les délais de délivrance peuvent atteindre 7 à 10 jours. Nous vous conseillons le E-visa valide 1 an (39 €).
                </p>

                <h4 className="visas-sub-title" style={{ marginTop: '20px' }}>Documents à télécharger lors de votre inscription en ligne :</h4>
                <ul className="visas-list">
                  <li>• Une copie claire et lisible de la page d'identité du passeport au format PDF (taille entre 10 KB et 300 KB).</li>
                  <li>• Une photo d’identité récente au format JPEG fond blanc (taille entre 10 KB et 1 MB).</li>
                  <li>• Tous les noms complets figurant sur le passeport (noms d'usage, époux/épouse) doivent impérativement être saisis à l'identique.</li>
                </ul>

                <div className="visas-alert-box" style={{ marginTop: '20px' }}>
                  <strong><i className="fas fa-exclamation-triangle"></i> Important :</strong> Pensez à imprimer et conserver une copie de votre eTV (e-Tourist Visa) pour l'embarquement. Vos données biométriques (empreintes digitales et reconnaissance faciale) seront relevées à l’arrivée dans l'un des 26 aéroports éligibles (Delhi, Mumbai, Jaipur, Varanasi, Chennai, Bengalore, Goa, Ahmedabad, Amritsar, Cochin, Kolkata, etc.).
                </div>
              </div>

              {/* Processus classique VFS France */}
              <div className="visas-steps-card" style={{ marginTop: '30px' }}>
                <h3 className="visas-card-title">
                  <i className="fas fa-tasks"></i> Le Processus d'une Demande de Visa Classique (VFS)
                </h3>
                <div className="visas-list" style={{ lineHeight: '1.8' }}>
                  <div><strong>Étape 1 :</strong> Choisissez la catégorie de visa dans la section "CHOISIR SON VISA" sur le site VFS (<a href="http://www.vfs-in-fr.com" target="_blank" rel="noreferrer" className="footer-contact-link">http://www.vfs-in-fr.com</a>) et remplissez le formulaire annexe.</div>
                  <div><strong>Étape 2 :</strong> Déposez votre dossier complet au centre VFS (Paris, Lyon ou Marseille) ou par correspondance. (Frais : 65 € pour visa tourisme, 40 € pour transit).</div>
                  <div><strong>Étape 3 :</strong> Suivez votre demande en ligne. Prévoir 3 à 5 jours de délai à Paris, 10 jours en province ou par correspondance.</div>
                </div>
              </div>
            </div>

            {/* Right Column: Adresses Utiles Inde & Népal */}
            <div>
              <div className="visas-sidebar-card">
                <h3 className="visas-sidebar-title">
                  <i className="fas fa-building"></i> Adresses Utiles en France pour l'Inde
                </h3>
                
                <div className="visas-list" style={{ lineHeight: '1.7' }}>
                  <div style={{ marginBottom: '14px' }}>
                    <strong>Consulat d’Inde à Paris :</strong><br />
                    20-22, rue Albéric-Magnard, 75016 Paris (M° La Muette). Tél. : 01-40-50-71-71. Email : <a href="mailto:cons.paris@gmail.com" className="footer-contact-link">cons.paris@gmail.com</a>
                  </div>
                  <div style={{ marginBottom: '14px' }}>
                    <strong>Ambassade de l’Inde :</strong><br />
                    15, rue Alfred-Dehodencq, 75016 Paris. Tél. : 01-40-50-70-70. (Du lundi au vendredi 9h-13h / 14h-17h30, sur rdv).
                  </div>
                  <div style={{ marginBottom: '14px' }}>
                    <strong>VFS France (Centre Visas) :</strong><br />
                    42-44, rue de Paradis, 75010 Paris (M° Poissonnière). Tél. : 0892-230-358. Dépôt 8h-13h, retrait 14h-18h. (Aussi à Marseille et Lyon). Photomaton et photocopieuse sur place.
                  </div>
                  <div>
                    <strong>Office National Indien de Tourisme :</strong><br />
                    13, bd Haussmann (5e ét.), 75009 Paris. Tél. : 01-45-23-30-45. Email : <a href="mailto:indtourparis@aol.com" className="footer-contact-link">indtourparis@aol.com</a>.
                  </div>
                </div>
              </div>

              {/* Népal Ambassade & Consulat */}
              <div className="visas-sidebar-card-alt" style={{ marginTop: '30px' }}>
                <h3 className="visas-sidebar-title">
                  <i className="fas fa-mountain"></i> Visa & Adresses Utiles pour le Népal
                </h3>
                
                <p className="contact-lead-desc">
                  Le visa pour le Népal s'obtient <strong>directement à l'arrivée</strong> à l'aéroport de Katmandou ou aux postes frontières terrestres, ainsi qu'aux consulats.
                </p>

                <div className="visas-list" style={{ lineHeight: '1.7' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <strong>Ambassade du Népal à Paris :</strong><br />
                    45 bis, rue des Acacias, 75017 Paris (M° Étoile / Argentine). Tél. : 01-46-22-48-67. Visas du lundi au vendredi de 10h à 13h (délai 24h).<br />
                    • Tarifs (entrées multiples) : 15 jours (25 €), 30 jours (40 €), 90 jours (100 €). Passeport valide 6 mois + 1 photo.
                  </div>
                  <div>
                    <strong>Consulat Honoraire du Népal à Rouen :</strong><br />
                    BP 40257, 76004 Rouen Cedex 2. Tél. : 02-35-07-18-12. Email : consulat.nepal@wanadoo.fr.<br />
                    • Tarifs par correspondance (chèque) : 1-15 jours (33 €), 16-30 jours (48 €), 31-90 jours (108 €).
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: CLIMAT, GEOGRAPHIE & SAISONS
          ========================================================================= */}
      <section id="climat-geographie" className="section-padding bg-cream">
        <div id="quand-partir"></div>
        <div id="climat-meteo"></div>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Superficie, Démographie & Climatology</span>
            <h2 className="section-title">Le Climat & La Géographie Indienne</h2>
            <p className="section-description">
              Une superficie de 3 287 590 km² offrant une incroyable diversité de paysages, des hauts sommets de l'Himalaya aux lagunes tropicales.
            </p>
          </div>

          <div className="climat-grid">
            <div className="climat-card">
              <h3 className="climat-card-title">
                <i className="fas fa-globe-asia"></i> La Population & Le Littoral Indien
              </h3>
              <p className="contact-lead-desc" style={{ marginBottom: '12px' }}>
                <strong>La Population :</strong> L'Inde compte 1,24 milliard d'habitants, ce qui en fait le deuxième pays le plus peuplé au monde. La population indienne connaît une augmentation rapide d'environ 19 millions d'habitants par an.
              </p>
              <p className="contact-lead-desc" style={{ marginBottom: '12px' }}>
                <strong>Un pays jeune :</strong> Les moins de 20 ans représentent <strong>45,3% de la population indienne</strong>, tandis que les plus de 60 ans représentent 5,9%.
              </p>
              <p className="contact-lead-desc">
                <strong>Le Littoral :</strong> Il s'étend sur plus de <strong>7 000 kilomètres</strong>. L'Inde partage des frontières terrestres avec le Pakistan à l'ouest, la Chine, le Népal et le Bhoutan au nord/nord-est, le Bangladesh et la Birmanie à l'est. Elle est bordée au sud par l'Océan Indien face aux Maldives, au Sri Lanka et à l'Indonésie.
              </p>
            </div>

            <div className="climat-card">
              <h3 className="climat-card-title">
                <i className="fas fa-cloud-sun-rain"></i> Le Climat & Les 4 Saisons
              </h3>
              <p className="contact-lead-desc" style={{ marginBottom: '12px' }}>
                Le climat est globalement tropical, plutôt sec dans le Nord et humide au Sud. On dénombre officiellement 4 saisons :
              </p>
              <ul className="visas-list" style={{ lineHeight: '1.8' }}>
                <li><strong>• Hiver (Janvier à Février) :</strong> Climat frais et sec. Températures idéales entre 18°C et 28°C en janvier. C'est la haute saison touristique dans le Nord et au Rajasthan.</li>
                <li><strong>• Été (Mars à Mai) :</strong> Climat sec et chaud. Températures grimpant entre 26°C et 34°C (parfois 40°C+ en mai). Période propice aux safaris photos et à la haute montagne.</li>
                <li><strong>• Mousson (Juin à Septembre) :</strong> Saison des pluies tropicales avec un pic en juillet (jusqu'à 20 jours de pluie). Saison idéale pour visiter le Ladakh et la vallée de l'Himalaya.</li>
                <li><strong>• Post-mousson / Automne (Octobre à Décembre) :</strong> Les températures s'adoucissent, la nature est verdoyante, parfait pour visiter tout le pays.</li>
              </ul>
              <div style={{ background: '#FFFBEB', padding: '14px', borderRadius: '10px', marginTop: '16px', borderLeft: '4px solid #D97706', fontSize: '0.92rem' }}>
                <strong><i className="fas fa-sun"></i> Meilleure période pour visiter l'Inde :</strong> De <strong>mi-novembre à fin mars</strong> pour l'ensemble du territoire (sauf extrême sud en raison de la mousson tardive).
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: VOCABULAIRE DE SURVIE (HINDI & ANGLAIS)
          ========================================================================= */}
      <section id="vocabulaire-hindi" className="section-padding bg-white">
        <div id="lexique-hindi"></div>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Guide de Communication & Lexique</span>
            <h2 className="section-title">Inde du Nord : Vocabulaire de Survie en Hindi & Anglais</h2>
            <p className="section-description">
              L'Inde compte 234 langues maternelles et 122 langues importantes, dont 22 sont officielles. Le Hindi est parlé par 41% de la population et l'Anglais est très largement utilisé dans les villes et les commerces.
            </p>
          </div>

          {/* Tab Navigation for Vocab Categories */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '35px' }}>
            <button 
              onClick={() => setActiveVocabTab('presentation')}
              className={`btn btn-sm ${activeVocabTab === 'presentation' ? 'btn-primary' : 'btn-outline'}`}
            >
              <i className="fas fa-handshake"></i> Présentation & Politesse
            </button>
            <button 
              onClick={() => setActiveVocabTab('urgences')}
              className={`btn btn-sm ${activeVocabTab === 'urgences' ? 'btn-primary' : 'btn-outline'}`}
            >
              <i className="fas fa-first-aid"></i> Urgences & Santé
            </button>
            <button 
              onClick={() => setActiveVocabTab('restauration')}
              className={`btn btn-sm ${activeVocabTab === 'restauration' ? 'btn-primary' : 'btn-outline'}`}
            >
              <i className="fas fa-utensils"></i> Restauration & Boissons
            </button>
            <button 
              onClick={() => setActiveVocabTab('transport')}
              className={`btn btn-sm ${activeVocabTab === 'transport' ? 'btn-primary' : 'btn-outline'}`}
            >
              <i className="fas fa-car-side"></i> Transports & Directions
            </button>
            <button 
              onClick={() => setActiveVocabTab('commerce')}
              className={`btn btn-sm ${activeVocabTab === 'commerce' ? 'btn-primary' : 'btn-outline'}`}
            >
              <i className="fas fa-shopping-bag"></i> Commerce, Chiffres & Heures
            </button>
          </div>

          {/* TAB 1: PRESENTATION */}
          {activeVocabTab === 'presentation' && (
            <div>
              <h3 className="vocab-section-title"><i className="fas fa-comments"></i> Salutations & Présentation</h3>
              <div className="vocab-grid">
                <div className="vocab-card"><div className="vocab-fr">Bonjour, salut</div><div className="vocab-hi">Namasté / Hello</div></div>
                <div className="vocab-card"><div className="vocab-fr">Merci</div><div className="vocab-hi">Dhaniawad / Thank you</div></div>
                <div className="vocab-card"><div className="vocab-fr">Au revoir</div><div className="vocab-hi">Fir milènge / Alvida / Bye</div></div>
                <div className="vocab-card"><div className="vocab-fr">Excusez-moi</div><div className="vocab-hi">Maf karna / Excuse me</div></div>
                <div className="vocab-card"><div className="vocab-fr">S'il vous plaît</div><div className="vocab-hi">Kripaya / Please</div></div>
                <div className="vocab-card"><div className="vocab-fr">Oui / Non</div><div className="vocab-hi">Ha (Oui) / Nahi (Non)</div></div>
                <div className="vocab-card"><div className="vocab-fr">D'accord / Très bien</div><div className="vocab-hi">Achha / Theek</div></div>
                <div className="vocab-card"><div className="vocab-fr">Je m'appelle...</div><div className="vocab-hi">Mera naam [prénom] hé</div></div>
                <div className="vocab-card"><div className="vocab-fr">Comment vous appelez-vous ?</div><div className="vocab-hi">Aapka naam kya hé ?</div></div>
                <div className="vocab-card"><div className="vocab-fr">Comment allez-vous ?</div><div className="vocab-hi">Aap kaise hé ?</div></div>
                <div className="vocab-card"><div className="vocab-fr">Bien, et vous ?</div><div className="vocab-hi">Theek, aur aap ?</div></div>
                <div className="vocab-card"><div className="vocab-fr">Allons-y !</div><div className="vocab-hi">Tchalo !</div></div>
              </div>
            </div>
          )}

          {/* TAB 2: URGENCES */}
          {activeVocabTab === 'urgences' && (
            <div>
              <h3 className="vocab-section-title"><i className="fas fa-ambulance"></i> Urgences & Santé</h3>
              <div className="vocab-grid">
                <div className="vocab-card"><div className="vocab-fr">Médecin</div><div className="vocab-hi">Doktar / Doctor</div></div>
                <div className="vocab-card"><div className="vocab-fr">Appelez un médecin</div><div className="vocab-hi">Doktar bulao</div></div>
                <div className="vocab-card"><div className="vocab-fr">J'ai besoin de voir un médecin</div><div className="vocab-hi">Mujhé doktar sé milna hé</div></div>
                <div className="vocab-card"><div className="vocab-fr">Hôpital</div><div className="vocab-hi">Hospital / Aspatal</div></div>
                <div className="vocab-card"><div className="vocab-fr">Je suis malade</div><div className="vocab-hi">Mé bimaar hu</div></div>
                <div className="vocab-card"><div className="vocab-fr">Je ne me sens pas bien</div><div className="vocab-hi">Mujhé atchha nahi lag raha</div></div>
                <div className="vocab-card"><div className="vocab-fr">Mal au ventre / Mal à la tête</div><div className="vocab-hi">Peit dard / Sar dard</div></div>
                <div className="vocab-card"><div className="vocab-fr">Nausée / Vomir</div><div className="vocab-hi">Jee machalna / Mujhé ulti hogi</div></div>
                <div className="vocab-card"><div className="vocab-fr">J'ai une blessure / mal ici</div><div className="vocab-hi">Yaha tchaute / dard hé</div></div>
                <div className="vocab-card"><div className="vocab-fr">À l'aide ! / Feu !</div><div className="vocab-hi">Madad / Help (ou Aag! / Fire!)</div></div>
                <div className="vocab-card"><div className="vocab-fr">Police / Danger</div><div className="vocab-hi">Poulisse / Khatra</div></div>
                <div className="vocab-card"><div className="vocab-fr">WC / Toilettes</div><div className="vocab-hi">Toilet / Shochalay</div></div>
              </div>
            </div>
          )}

          {/* TAB 3: RESTAURATIONS */}
          {activeVocabTab === 'restauration' && (
            <div>
              <h3 className="vocab-section-title"><i className="fas fa-utensils"></i> Restauration & Boissons</h3>
              <div className="vocab-grid">
                <div className="vocab-card"><div className="vocab-fr">J'ai faim / J'ai soif</div><div className="vocab-hi">Mujhé bhouk / pyaass lagi hé</div></div>
                <div className="vocab-card"><div className="vocab-fr">Manger / Nourriture</div><div className="vocab-hi">Khana</div></div>
                <div className="vocab-card"><div className="vocab-fr">Où est le restaurant ?</div><div className="vocab-hi">Restorante kaha hé ?</div></div>
                <div className="vocab-card"><div className="vocab-fr">Eau potable</div><div className="vocab-hi">Pani (Mineral water)</div></div>
                <div className="vocab-card"><div className="vocab-fr">Piments / Sans piment</div><div className="vocab-hi">Mirtchi / Mirtchi nahi</div></div>
                <div className="vocab-card"><div className="vocab-fr">Peu de piment</div><div className="vocab-hi">Kam mirtchi</div></div>
                <div className="vocab-card"><div className="vocab-fr">C'est délicieux !</div><div className="vocab-hi">Swaadishta hé !</div></div>
                <div className="vocab-card"><div className="vocab-fr">Végétarien</div><div className="vocab-hi">Shakahaari (Veg)</div></div>
                <div className="vocab-card"><div className="vocab-fr">Viande / Poisson / Œuf</div><div className="vocab-hi">Maas / Matcchi / Andaa</div></div>
                <div className="vocab-card"><div className="vocab-fr">Thé indien au lait & épices</div><div className="vocab-hi">Masala Tchaï</div></div>
                <div className="vocab-card"><div className="vocab-fr">Café</div><div className="vocab-hi">Kofi</div></div>
                <div className="vocab-card"><div className="vocab-fr">Boisson au yaourt</div><div className="vocab-hi">Lassi (sucré / salé)</div></div>
              </div>
            </div>
          )}

          {/* TAB 4: TRANSPORT */}
          {activeVocabTab === 'transport' && (
            <div>
              <h3 className="vocab-section-title"><i className="fas fa-route"></i> Transports & Directions</h3>
              <div className="vocab-grid">
                <div className="vocab-card"><div className="vocab-fr">Gare / Train</div><div className="vocab-hi">Railway station / Rail gadi</div></div>
                <div className="vocab-card"><div className="vocab-fr">Bus / Arrêt de bus</div><div className="vocab-hi">Bas / Bas stop</div></div>
                <div className="vocab-card"><div className="vocab-fr">Aéroport / Avion</div><div className="vocab-hi">Airport (Hawai adda) / Hawai jahaaj</div></div>
                <div className="vocab-card"><div className="vocab-fr">Voiture / Moto / Vélo</div><div className="vocab-hi">Gaadi / Bike / Saai-kal</div></div>
                <div className="vocab-card"><div className="vocab-fr">Où est... ? / Comment aller...?</div><div className="vocab-hi">... Kaha hé ? / ... Kaisé jaaé ?</div></div>
                <div className="vocab-card"><div className="vocab-fr">Tout droit / Devant / Derrière</div><div className="vocab-hi">Seedha / Saamné / Peetchhé</div></div>
                <div className="vocab-card"><div className="vocab-fr">À droite / À gauche</div><div className="vocab-hi">Daaé / Baaé</div></div>
                <div className="vocab-card"><div className="vocab-fr">Au centre / Loin / Près</div><div className="vocab-hi">Beetchh mé / Doour / Paas</div></div>
                <div className="vocab-card"><div className="vocab-fr">Nord / Sud / Est / Ouest</div><div className="vocab-hi">Uttar / Dakshin / Pourab / Paschim</div></div>
                <div className="vocab-card"><div className="vocab-fr">Arrêtez-vous / Vite</div><div className="vocab-hi">Ruko / Jaldi</div></div>
                <div className="vocab-card"><div className="vocab-fr">Je suis perdu(e)</div><div className="vocab-hi">Me ghoum gaya (m) / gayi (f)</div></div>
                <div className="vocab-card"><div className="vocab-fr">Hôtel / Rue</div><div className="vocab-hi">Hotal / Gali</div></div>
              </div>
            </div>
          )}

          {/* TAB 5: COMMERCE */}
          {activeVocabTab === 'commerce' && (
            <div>
              <h3 className="vocab-section-title"><i className="fas fa-tag"></i> Commerce, Chiffres & Heures</h3>
              <div className="vocab-grid">
                <div className="vocab-card"><div className="vocab-fr">Combien ça coûte ?</div><div className="vocab-hi">Kitné ka hé ?</div></div>
                <div className="vocab-card"><div className="vocab-fr">C'est trop cher !</div><div className="vocab-hi">Yé bahut méhénga hé</div></div>
                <div className="vocab-card"><div className="vocab-fr">Pouvez-vous baisser le prix ?</div><div className="vocab-hi">Aap kitna kam kar sakté hé ?</div></div>
                <div className="vocab-card"><div className="vocab-fr">C'est pas cher / Argent</div><div className="vocab-hi">Yé sasta hé / Paisé</div></div>
                <div className="vocab-card"><div className="vocab-fr">Je regarde seulement</div><div className="vocab-hi">Bas dékh rahé hé / Just looking</div></div>
                <div className="vocab-card"><div className="vocab-fr">Je veux l'acheter</div><div className="vocab-hi">Mé khareedna tchahata hu</div></div>
                <div className="vocab-card"><div className="vocab-fr">Marché / Boutique / Distributeur</div><div className="vocab-hi">Market / Doukaan / ATM</div></div>
                <div className="vocab-card"><div className="vocab-fr">Chiffres (1 à 5)</div><div className="vocab-hi">1: Ek, 2: Do, 3: Teen, 4: Chaar, 5: Paatch</div></div>
                <div className="vocab-card"><div className="vocab-fr">Chiffres (6 à 10)</div><div className="vocab-hi">6: Tchhé, 7: Saat, 8: Aath, 9: Nau, 10: Das</div></div>
                <div className="vocab-card"><div className="vocab-fr">Cent / Mille</div><div className="vocab-hi">100: Sau, 1000: Hajaar</div></div>
                <div className="vocab-card"><div className="vocab-fr">Aujourd'hui / Demain / Hier</div><div className="vocab-hi">Aaj / Kal (Tomorrow/Yesterday)</div></div>
                <div className="vocab-card"><div className="vocab-fr">Matin / Soir / Nuit</div><div className="vocab-hi">Subah / Shaam / Raat</div></div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: RELIGIONS & SYSTEME DE CASTES
          ========================================================================= */}
      <section id="religions-castes" className="section-padding bg-cream">
        <div id="religions"></div>
        <div id="castes"></div>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Mosaïque Spirituelle & Structure Sociale</span>
            <h2 className="section-title">La Religion & Le Système de Castes en Inde</h2>
            <p className="section-description">
              Comprendre la richesse philosophique et la hiérarchie traditionnelle qui façonnent la société indienne.
            </p>
          </div>

          <div className="religions-grid">
            <div className="climat-card">
              <div className="score-stars"><i className="fas fa-om"></i></div>
              <h3 className="climat-card-title">L'Hindouisme (~80%)</h3>
              <p className="contact-lead-desc" style={{ fontSize: '0.95rem' }}>
                L'une des plus anciennes religions au monde. Fondée sur les Védas (textes sacrées de savoir), son principe de base est que la vraie nature de l'homme est divine (le divin ou Brahman réside en chaque être vivant). Il s'agit davantage d'un mode de vie et de recherche de connaissance de soi que d'une religion dogmatique.
              </p>
            </div>

            <div className="climat-card">
              <div className="top-bar-item" style={{ color: 'var(--primary-color)', fontSize: '1.4rem', marginBottom: '8px' }}><i className="fas fa-mosque"></i></div>
              <h3 className="climat-card-title">L'Islam (~13,4% à 16%)</h3>
              <p className="contact-lead-desc" style={{ fontSize: '0.95rem' }}>
                L'Inde abrite la 2ème plus grande population musulmane au monde. L'Islam a profondément marqué l'histoire, la gastronomie, la musique soufie et l'architecture indienne (Taj Mahal, Fort Rouge).
              </p>
            </div>

            <div className="climat-card">
              <div className="score-stars"><i className="fas fa-khanda"></i></div>
              <h3 className="climat-card-title">Le Sikhisme (~2%)</h3>
              <p className="contact-lead-desc" style={{ fontSize: '0.95rem' }}>
                Minorité religieuse très solidaire, entreprenante et respectée. Reconnaissables à leurs turbans colorés, moustaches et barbes entretenues. Ils prônent l'honnêteté et le service de la société (Temple d'Or d'Amritsar).
              </p>
            </div>

            <div className="climat-card">
              <div className="score-stars"><i className="fas fa-cross"></i></div>
              <h3 className="climat-card-title">Le Christianisme (~2,3%)</h3>
              <p className="contact-lead-desc" style={{ fontSize: '0.95rem' }}>
                Très présent au Kerala, à Goa et dans le Nord-Est. L'apôtre Saint Thomas aurait apporté la foi chrétienne en Inde dès l'an 52.
              </p>
            </div>

            <div className="climat-card">
              <div className="score-stars"><i className="fas fa-yin-yang"></i></div>
              <h3 className="climat-card-title">Le Jaïnisme & Bouddhisme</h3>
              <p className="contact-lead-desc" style={{ fontSize: '0.95rem' }}>
                Non-violents (Ahimsa), les Jaïns refusent les armes et sont strictement végétariens. Le Bouddhisme est né en Inde (Bodhgaya) et s'épanouit au Ladakh et dans l'Himalaya.
              </p>
            </div>

            <div className="climat-card">
              <div className="score-stars"><i className="fas fa-star-of-david"></i></div>
              <h3 className="climat-card-title">Les Parsis & Autres (~1,9%)</h3>
              <p className="contact-lead-desc" style={{ fontSize: '0.95rem' }}>
                Zoroastriens arrivés de Perse, très influents dans le commerce à Mumbai. Mosaïque harmonieuse de croyances.
              </p>
            </div>
          </div>

          {/* Les 4 Varnas (Castes) Box */}
          <div className="castes-box" style={{ marginTop: '40px' }}>
            <h3 className="climat-card-title">
              <i className="fas fa-sitemap"></i> Le Système des Castes (Les 4 Varnas & Dalits)
            </h3>
            <p className="contact-lead-desc" style={{ marginBottom: '20px' }}>
              Dans l'hindouisme védique (Manu Smriti), la société traditionnelle se divise en 4 grandes classes (Varnas), complétées par les Dalits :
            </p>

            <div className="castes-grid">
              <div className="caste-card">
                <strong className="contact-info-title">1. Brâhmanes (ब्राह्मण)</strong>
                <span className="badge-verify-text">Prêtres, enseignants, savants, intellectuels et professeurs.</span>
              </div>

              <div className="caste-card">
                <strong className="contact-info-title">2. Kshatriyas (क्षत्रिय)</strong>
                <span className="badge-verify-text">Rois, princes, gouvernants, guerriers et administrateurs.</span>
              </div>

              <div className="caste-card">
                <strong className="contact-info-title">3. Vaishyas (वैश्य)</strong>
                <span className="badge-verify-text">Commerçants, artisans, hommes d'affaires, agriculteurs.</span>
              </div>

              <div className="caste-card">
                <strong className="contact-info-title">4. Sudras & Dalits (शूद्र)</strong>
                <span className="badge-verify-text">Serviteurs, travailleurs manuels et Dalits ("Harijans" ou enfants de Dieu).</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: CALENDRIER DES FESTIVALS & FETES
          ========================================================================= */}
      <section id="festivals-fetes" className="section-padding bg-white">
        <div id="festivals"></div>
        <div id="fetes"></div>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Célébrations & Fêtes Traditionnelles</span>
            <h2 className="section-title">Calendrier des Grands Festivals en Inde</h2>
            <p className="section-description">
              Découvrez les moments magiques où l'Inde s'illumine de mille couleurs, musiques folkloriques et danses du désert.
            </p>
          </div>

          <div className="festival-grid">
            {/* Festival 1: Nagaur */}
            <div className="festival-card">
              <div className="festival-img-wrap">
                <img src="/images/dest-rajasthan.jpg" onError={(e) => { e.currentTarget.src = "/images/dest-rajasthan.jpg"; }} alt="Nagaur Fair" />
                <div className="festival-date-badge">24-27 Janvier 2026</div>
              </div>
              <div className="festival-body">
                <div className="festival-location"><i className="fas fa-map-marker-alt"></i> Nagaur, Rajasthan</div>
                <h3 className="festival-title">Foire aux Bestiaux de Nagaur</h3>
                <p className="festival-desc">
                  2ème plus grande foire aux bestiaux (chameaux, chevaux, bœufs) avec combats de coqs, tir à la corde et le célèbre « Mirchi Bazaar » (marché de piment rouge).
                </p>
              </div>
            </div>

            {/* Festival 2: Desert Jaisalmer */}
            <div className="festival-card">
              <div className="festival-img-wrap">
                <img src="/images/Voyage-Jaisalmer.jpg" onError={(e) => { e.currentTarget.src = "/images/Voyage-Jaisalmer.jpg"; }} alt="Desert Festival Jaisalmer" />
                <div className="festival-date-badge">30 Jan - 01 Fév 2026</div>
              </div>
              <div className="festival-body">
                <div className="festival-location"><i className="fas fa-map-marker-alt"></i> Jaisalmer, Désert du Thar</div>
                <h3 className="festival-title">Festival du Désert de Jaisalmer</h3>
                <p className="festival-desc">
                  3 jours de festivités dans les dunes : polo à dos de chameau, concours des plus belles moustaches, nouage de turbans, charmeurs de serpents et danses du feu.
                </p>
              </div>
            </div>

            {/* Festival 3: Soufi Jodhpur */}
            <div className="festival-card">
              <div className="festival-img-wrap">
                <img src="/images/dest-jodhpur.jpg" onError={(e) => { e.currentTarget.src = "/images/dest-jodhpur.jpg"; }} alt="World Sacred Spirit Festival" />
                <div className="festival-date-badge">14-16 & 22-23 Février 2026</div>
              </div>
              <div className="festival-body">
                <div className="festival-location"><i class="fas fa-map-marker-alt"></i> Fort Mehrangarh, Jodhpur</div>
                <h3 className="festival-title">World Sacred Spirit Festival (Soufi)</h3>
                <p className="festival-desc">
                  Les remparts du Fort Mehrangarh s'illuminent de mille bougies pour accueillir les plus grands musiciens sacrés et poètes soufis de la Route de la Soie.
                </p>
              </div>
            </div>

            {/* Festival 4: Holi */}
            <div className="festival-card">
              <div className="festival-img-wrap">
                <img src="https://www.jodhpurvoyage.com/wp-content/uploads/2012/07/Colors-731x650-300x266.jpg" onError={(e) => { e.currentTarget.src = "/images/dest-rajasthan.jpg"; }} alt="Holi Fête des Couleurs" />
                <div className="festival-date-badge">04-05 Mars 2026</div>
              </div>
              <div className="festival-body">
                <div className="festival-location"><i className="fas fa-map-marker-alt"></i> Toute l'Inde & Rajasthan</div>
                <h3 className="festival-title">Holi – Fête des Couleurs</h3>
                <p className="festival-desc">
                  Célèbre la venue du printemps et le triomphe du Bien sur le Mal. Tout le monde s'éclabousse d'eau et de poudres de couleurs (rose, rouge, jaune, violet) dans les rues.
                </p>
              </div>
            </div>

            {/* Festival 5: Elephant Jaipur */}
            <div className="festival-card">
              <div className="festival-img-wrap">
                <img src="https://www.jodhpurvoyage.com/wp-content/uploads/2012/07/elephant-festival-1-300x199.jpg" onError={(e) => { e.currentTarget.src = "/images/dest-kerala.jpg"; }} alt="Festival de l'Éléphant Jaipur" />
                <div className="festival-date-badge">Mars 2026</div>
              </div>
              <div className="festival-body">
                <div className="festival-location"><i className="fas fa-map-marker-alt"></i> Jaipur, Rajasthan</div>
                <h3 className="festival-title">Festival de l'Éléphant de Jaipur</h3>
                <p className="festival-desc">
                  Défilé royal d'éléphants parés de tapis de selle brodés d'or, bijoux et peints de motifs vibrants au son des tambours, polo à dos d'éléphant.
                </p>
              </div>
            </div>

            {/* Festival 6: Gangaur & Mewar */}
            <div className="festival-card">
              <div className="festival-img-wrap">
                <img src="/images/jaipur-travel.jpg" onError={(e) => { e.currentTarget.src = "/images/jaipur-travel.jpg"; }} alt="Gangaur & Mewar Festival" />
                <div className="festival-date-badge">21 Mars & 11-13 Avril 2026</div>
              </div>
              <div className="festival-body">
                <div className="festival-location"><i className="fas fa-map-marker-alt"></i> Udaipur, Rajasthan</div>
                <h3 className="festival-title">Gangaur & Mewar Festival</h3>
                <p className="festival-desc">
                  Fête du printemps dédiée à Parvati. Processions de femmes en robes jaunes portant les effigies jusqu'au lac Pichola, danses traditionnelles.
                </p>
              </div>
            </div>

            {/* Festival 7: Diwali */}
            <div className="festival-card">
              <div className="festival-img-wrap">
                <img src="https://www.jodhpurvoyage.com/wp-content/uploads/2012/07/Diwali_Diya-300x225.jpg" onError={(e) => { e.currentTarget.src = "/images/dest-varanasi.jpg"; }} alt="Diwali Fête des Lumières" />
                <div className="festival-date-badge">20 Octobre 2025</div>
              </div>
              <div className="festival-body">
                <div className="festival-location"><i className="fas fa-map-marker-alt"></i> Toute l'Inde</div>
                <h3 className="festival-title">Diwali – Fête des Lumières</h3>
                <p className="festival-desc">
                  5 jours de célébration du retour de Rama. Des millions de petites lampes à huile (Diyas) et feux d'artifice illuminent temples, maisons et marchés.
                </p>
              </div>
            </div>

            {/* Festival 8: Pushkar Fair */}
            <div className="festival-card">
              <div className="festival-img-wrap">
                <img src="https://www.jodhpurvoyage.com/wp-content/uploads/2016/06/b58f8c4210f7f449a64d6276e55085ba.jpg" onError={(e) => { e.currentTarget.src = "/images/Voyage-Jaisalmer.jpg"; }} alt="Pushkar Fair" />
                <div className="festival-date-badge">30 Oct - 05 Nov 2025</div>
              </div>
              <div className="festival-body">
                <div className="festival-location"><i className="fas fa-map-marker-alt"></i> Pushkar, Rajasthan</div>
                <h3 className="festival-title">Grand Rassemblement de Pushkar</h3>
                <p className="festival-desc">
                  Le plus grand marché aux chameaux du monde jumelé au pèlerinage sacré du lac de Brahma lors de la pleine lune de Kartika.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: USAGES, SANTE, DOUANES & PATRIMOINE UNESCO
          ========================================================================= */}
      <section id="patrimoine-unesco" className="section-padding bg-cream">
        <div id="sante-vaccins"></div>
        <div id="monnaie-change"></div>
        <div id="transports-chauffeur"></div>
        <div id="conseils-pratiques"></div>
        <div id="faq"></div>
        <div id="questions-frequentes"></div>
        <div className="container">
          <div className="section-header" id="conseils-header">
            <span className="section-subtitle">Conseils Pratiques & Savoir-Vivre</span>
            <h2 className="section-title">Usages, Santé, Transports & Patrimoine UNESCO</h2>
            <p className="section-description">
              Toutes les recommandations indispensables pour voyager sereinement en Inde et au Népal.
            </p>
          </div>

          <div className="infos-conseils-grid">
            {/* Card 1: Monnaie, Taxes & Pourboires */}
            <div className="climat-card" id="monnaie-change">
              <div id="monnaie"></div>
              <h3 className="climat-card-title"><i className="fas fa-coins"></i> Monnaie, Taxes & Pourboires</h3>
              <ul className="visas-list" style={{ lineHeight: '1.7' }}>
                <li><strong>• Monnaie :</strong> La Roupie Indienne (INR). 1 € ≈ 75-90 Rps. Le change s'effectue sans commission dans les bureaux de change et banques.</li>
                <li><strong>• Cartes bancaires :</strong> Paiement par carte limité aux hôtels chic et boutiques de luxe. Prévoir des espèces pour les marchés.</li>
                <li><strong>• Taxes & Pourboires (Baksheesh) :</strong> Taxes de 4% à 35%. Prévoir 5 à 10% au restaurant, 400-500 Rps/jour pour le chauffeur privé et 500 Rps/jour pour un guide francophone.</li>
              </ul>
            </div>

            {/* Card 2: Transports & Chauffeur */}
            <div className="climat-card" id="transports">
              <div id="transports-chauffeur-card"></div>
              <h3 className="climat-card-title"><i className="fas fa-car-side"></i> Transports & Chauffeur en Inde</h3>
              <ul className="visas-list" style={{ lineHeight: '1.7' }}>
                <li><strong>• Voiture privée avec chauffeur :</strong> Le mode de transport idéal pour explorer le Rajasthan et l'Inde du Nord en toute liberté et sérénité (véhicules climatisés, carburant, frais de route inclus).</li>
                <li><strong>• Trains Indiens (Indian Railways) :</strong> Expérience culturelle incontournable. Réservations conseillées en 1ère/2ème classe climatisée (1AC, 2AC, 3AC, Shatabdi / Rajdhani Express).</li>
                <li><strong>• Vols Intérieurs :</strong> Idéal pour franchir rapidement de longues distances (Delhi, Varanasi, Udaipur, Mumbai, Kerala).</li>
                <li><strong>• Taxis & Auto-Rickshaws :</strong> Pratiques pour les petits déplacements en ville. Négociez le prix avant le départ ou exigez le compteur (meter).</li>
              </ul>
            </div>

            {/* Card 3: Habillement, Temple & Photo */}
            <div className="climat-card" id="habillement">
              <h3 className="climat-card-title"><i className="fas fa-tshirt"></i> Habillement & Photographie</h3>
              <ul className="visas-list" style={{ lineHeight: '1.7' }}>
                <li><strong>• Tenue vestimentaire :</strong> Les Indiens sont pudiques. Privilégier des tenues couvertes (pas de shorts ou d'épaules dénudées dans les temples).</li>
                <li><strong>• Dans les lieux religieux :</strong> Retirer ses chaussures à l'entrée. Tête couverte dans les temples Sikhs. Aucun article en cuir dans les temples Jaïns.</li>
                <li><strong>• Photographie :</strong> Demander l'autorisation avant de photographier les gens (notamment les sâdhus). Une taxe d'appareil photo/vidéo (1 à 5 €) est parfois demandée aux monuments.</li>
              </ul>
            </div>

            {/* Card 4: Douanes, Électricité & Hébergement */}
            <div className="climat-card" id="douanes">
              <h3 className="climat-card-title"><i className="fas fa-plug"></i> Douanes, Électricité & Hébergement</h3>
              <ul className="visas-list" style={{ lineHeight: '1.7' }}>
                <li><strong>• Douanes :</strong> Importation autorisée de 200 cigarettes et 1L d'alcool. Déclarer les PC portables / caméscopes sur le passeport à l'arrivée. Exportation d'antiquités et espèces protégées interdite.</li>
                <li><strong>• Courant électrique :</strong> 230V-240V / 50Hz. Prévoir un adaptateur universel.</li>
                <li><strong>• Hébergement :</strong> Check-in à partir de 14h, check-out à 12h (ou 10h). Une empreinte de carte bleue peut être demandée pour le minibar.</li>
              </ul>
            </div>

            {/* Card 5: Santé & Vaccinations */}
            <div className="climat-card" id="sante-card">
              <div id="sante"></div>
              <h3 className="climat-card-title"><i className="fas fa-briefcase-medical"></i> Santé, Vaccins & Eau</h3>
              <ul className="visas-list" style={{ lineHeight: '1.7' }}>
                <li><strong>• Eau & Boissons :</strong> Ne jamais consommer l'eau du robinet ni de glaçons. Boire uniquement de l'eau en bouteille capsulée. Dégustez le Masala Chai ou le Lassi.</li>
                <li><strong>• Vaccinations conseillées :</strong> Vaccins universels à jour (DTP, ROR, Hépatite B). Fièvre typhoïde et Hépatite A très vivement recommandées.</li>
                <li><strong>• Pharmacie de voyage :</strong> Prévoir antipaludéens, antidiarrhéiques et antalgiques avec votre médecin.</li>
              </ul>
            </div>

            {/* Card 6: Monuments Classés UNESCO */}
            <div className="climat-card unesco-card" id="unesco">
              <h3 className="climat-card-title"><i className="fas fa-landmark"></i> Les Trésors Classés au Patrimoine UNESCO</h3>
              <div className="unesco-subgrid">
                <div>
                  <strong>Inde du Nord :</strong>
                  <ul className="visas-list" style={{ marginTop: '6px' }}>
                    <li>• Taj Mahal & Fort Rouge d'Agra, Fatehpur Sikri</li>
                    <li>• Jantar Mantar de Jaipur & 6 Forts du Rajasthan</li>
                    <li>• Qutb Minar, Tombe de Humayun & Fort Rouge à Delhi</li>
                    <li>• Temples de Khajuraho & Sanchi (Madhya Pradesh)</li>
                    <li>• Parc National de Keoladeo (Bharatpur) & Konârak</li>
                  </ul>
                </div>
                <div>
                  <strong>Inde du Sud & Ouest :</strong>
                  <ul className="visas-list" style={{ marginTop: '6px' }}>
                    <li>• Grottes d'Ajanta et d'Ellora (Maharashtra)</li>
                    <li>• Gare Victoria CST & Grottes d'Elephanta (Mumbai)</li>
                    <li>• Églises et couvents d'Old Goa</li>
                    <li>• Ensemble monumental de Hampi & Pattadakal (Karnataka)</li>
                    <li>• Grands temples vivants Chola (Mahabalipuram, Tanjore)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Quick Action */}
      <a href="https://wa.me/919650698669" target="_blank" rel="noopener noreferrer" className="floating-whatsapp" aria-label="Contactez-nous sur WhatsApp">
        <i className="fab fa-whatsapp"></i>
        <span className="whatsapp-tooltip">Contactez-nous sur WhatsApp</span>
      </a>
    </div>
  );
};

export default InfosPratiques;
