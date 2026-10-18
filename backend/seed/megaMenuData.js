export const defaultMegaMenuData = {
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
      {
        title: 'Qui sommes-nous',
        link: '/qui-sommes-nous',
        image: '/images/image-12.jpg',
        order: 1
      },
      {
        title: 'Notre valeur ajoutée',
        link: '/qui-sommes-nous#notre-philosophie',
        image: '/images/image-9.jpg',
        order: 2
      },
      {
        title: 'Notre engagement responsable',
        link: '/qui-sommes-nous#notre-engagement-responsable',
        image: '/images/image-6.jpg',
        order: 3
      },
      {
        title: 'Notre Équipe',
        link: '/notre-equipe',
        image: '/images/image-8.jpg',
        order: 4
      }
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
      {
        title: 'Voyage sur mesure',
        link: '/voyage-sur-mesure',
        image: '/images/image-12.jpg',
        order: 1
      },
      {
        title: 'Circuit accompagné',
        link: '/circuit-accompagne',
        image: '/images/image-9.jpg',
        order: 2
      },
      {
        title: 'Culture & Safari',
        link: '#',
        image: '/images/image-6.jpg',
        order: 3
      },
      {
        title: '+ de 10 personnes',
        link: '/plus-de-10-personnes',
        image: '/images/slide4-300x176.jpg',
        order: 4
      },
      {
        title: 'Toutes les inspirations',
        link: '/inspirations',
        image: '/images/slide8-300x176.jpg',
        order: 5
      }
    ]
  }
};
