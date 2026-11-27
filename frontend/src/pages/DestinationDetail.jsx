import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import BookingModal from '../components/BookingModal';
import { fetchTours, fetchDestinationBySlug } from '../services/api';
import SEO from '../components/SEO';

const defaultDestinationsMap = {
  ladakh: {
    name: 'Ladakh',
    slug: 'ladakh',
    heroTitle: 'Voyage au Ladakh',
    h1Title: 'Trekking au Ladakh : Randonnée, Trek et Monastères de l\'Himalaya',
    tagline: 'Le Petit Tibet – Paysages lunaires, monastères bouddhistes et cols à 5 000 m',
    image: '/images/dest-ladakh.jpg',
    satisfaction: '98% de satisfaction (112 avis)',
    shortDescription: "L'Inde peut s’enorgueillir d’avoir sur son territoire l’une des régions les plus célèbres au monde par les amateurs de treks en altitude : le Ladakh. Dans l'Himalaya, vivez une immersion bouddhiste au plus près des habitants, entre traversée du Zanskar, reliefs du Karakoram, monastères de Thiksey et Hemis et le sublime lac Pangong Tso aux eaux turquoise.",
    fullDescription: "La lenteur nécessaire à l'acclimatation progressive de ces hautes latitudes fait partie intégrante de l'esprit de votre voyage au Ladakh. Que ce soit en longeant la rivière Indus, en franchissant le col vertigineux de Khardung La à 5 359 m ou en explorant les dunes de sable d'altitude de la vallée de la Nubra, nos guides francophones experts vous accompagnent en toute sécurité.",
    highlights: [
      { icon: 'fa-place-of-worship', title: 'Monastères Perchés', desc: 'Visitez Thiksey, Hemis, Lamayuru et Likir, sanctuaires vivants du bouddhisme tibétain.' },
      { icon: 'fa-mountain', title: 'Lac Pangong & Nubra', desc: 'Admirez les eaux turquoise du lac Pangong Tso (4 350 m) et les chameaux de Bactriane à Hunder.' },
      { icon: 'fa-hiking', title: 'Trek au Zanskar & Spiti', desc: 'Circuits d’altitude d’exception à travers la chaîne du Karakoram et les vallées isolées de Spiti.' },
      { icon: 'fa-road', title: 'Cols Mythiques', desc: 'Empruntez l’une des plus hautes routes carrossables du monde via le col de Khardung La (5 359 m).' }
    ],
    region: 'ladakh'
  },
  rajasthan: {
    name: 'Rajasthan',
    slug: 'rajasthan',
    heroTitle: 'Voyage au Rajasthan',
    h1Title: 'La Terre des Maharajas : Cités Royales & Désert du Thar',
    tagline: 'Palais d’opulence, forteresses imprenables, désert d’or et havelis du Shekhawati',
    image: '/images/dest-rajasthan.jpg',
    satisfaction: '99% de satisfaction (245 avis)',
    shortDescription: "Le Rajasthan est la terre mythique des forteresses grandioses, des palais des Mille et Une Nuits et des cités colorées. De Jaïpur la rose à Jodhpur la bleue, d'Udaipur la romantique à Jaisalmer la dorée au cœur des dunes de sable du désert du Thar, découvrez une féérie architecturale unique au monde.",
    fullDescription: "Séjournez dans des palais de patrimoine restaurés, parcourez les ruelles des cités fortifiées et passez une nuit inoubliable sous les étoiles du désert. Nos chauffeurs privés et nos guides locaux vous feront vivre une expérience féérique et authentique.",
    seoTitle: "Voyage au Rajasthan — Circuits & Séjours sur Mesure | Jodhpur Voyage",
    seoDescription: "Découvrez le Rajasthan avec Jodhpur Voyage : palais des Maharajas, forteresses du désert du Thar, cités royales et circuits 100% sur mesure avec chauffeur privé francophone.",
    seoKeywords: "voyage rajasthan, circuit rajasthan, sejour rajasthan sur mesure, voyage maharajas, chauffeur prive rajasthan, agence locale rajasthan, jodhpur voyage",
    highlights: [
      { icon: 'fa-crown', title: 'Forts & Palais Royaux', desc: 'Fort de Mehrangarh à Jodhpur, Palais des Vents à Jaipur et City Palace d\'Udaipur.' },
      { icon: 'fa-campground', title: 'Désert du Thar', desc: 'Randonnée en chameau et campement de charme sous les étoiles du désert de Jaisalmer.' },
      { icon: 'fa-hotel', title: 'Hôtels de Patrimoine', desc: 'Nuits magiques dans des anciennes demeures de Maharajas et havelis du Shekhawati.' },
      { icon: 'fa-users', title: 'Rencontres Authentiques', desc: 'Immersion rurale chez les communautés éco-responsables Bishnoi et artisans locaux.' }
    ],
    region: 'inde-du-nord'
  },
  kerala: {
    name: 'Kerala',
    slug: 'kerala',
    heroTitle: 'Voyage au Kerala',
    h1Title: 'Inde du Sud & Backwaters : Lagunes d’Émeraude & Ayurveda',
    tagline: 'Croisières en houseboat traditionnel, collines de thé et sérénité tropicale',
    image: '/images/dest-kerala.jpg',
    satisfaction: '97% de satisfaction (89 avis)',
    shortDescription: "Surnommé 'God’s Own Country', le Kerala vous transporte dans une Inde apaisante, verdoyante et tropicale. Naviguez en houseboat privé sur les canaux paisibles des backwaters d'Alleppey, parcourez les denses plantations de thé de Munnar et bénéficiez de soins ayurvédiques ancestraux.",
    fullDescription: "Assistez aux spectacles envoûtants de Kathakali à Cochin, observez les éléphants sauvages dans la réserve de Periyar et terminez votre séjour sur les plages dorées et préservées de Marari.",
    highlights: [
      { icon: 'fa-ship', title: 'Houseboat Privé', desc: 'Croisière et nuitée exclusive sur un kettuvalam traditionnel le long des backwaters.' },
      { icon: 'fa-leaf', title: 'Soins Ayurvédiques', desc: 'Massages aux huiles précieuses et cures de bien-être dans des sanctuaires authentiques.' },
      { icon: 'fa-seedling', title: 'Plantations de Munnar', desc: 'Collines verdoyantes tapissées de théiers et de jardins d’épices odorantes.' },
      { icon: 'fa-umbrella-beach', title: 'Côte Malabar', desc: 'Détente sur les plages tropicales ombragées de cocotiers à Marari et Kovalam.' }
    ],
    region: 'inde-du-sud'
  },
  nepal: {
    name: 'Népal',
    slug: 'nepal',
    heroTitle: 'Voyage au Népal',
    h1Title: 'Népal : Cités Royales de Katmandou & Sommets de l’Himalaya',
    tagline: 'Vallée sacrée, stupas bouddhistes, lacs de Pokhara et safaris à Chitwan',
    image: '/images/dest-nepal.jpg',
    satisfaction: '98% de satisfaction (74 avis)',
    shortDescription: "Le Népal est le royaume incontournable du toit du monde. Des ruelles médiévales de Bhaktapur et des stupas sacrés de Swayambhunath aux panoramas sur les Annapurnas depuis Pokhara, découvrez la richesse culturelle et naturelle de l'Himalaya.",
    fullDescription: "Combinez visites de temples séculaires et aventures en nature sauvage : safaris à dos d'éléphant pour apercevoir le rhinocéros unicorne à Chitwan et randonnées face aux sommets enneigés.",
    highlights: [
      { icon: 'fa-place-of-worship', title: 'Cités Médionales', desc: 'Katmandou, Patan et Bhaktapur, joyaux d’art et d’architecture Newar (UNESCO).' },
      { icon: 'fa-mountain', title: 'Lacs de Pokhara', desc: 'Vues splendides sur le Machapuchare et la chaîne sacrée des Annapurnas.' },
      { icon: 'fa-hippo', title: 'Parc de Chitwan', desc: 'Safaris en jungle tropicale pour observer rhinocéros unicorne et tigres du Bengale.' },
      { icon: 'fa-pray', title: 'Spiritualité Himalaya', desc: 'Rencontre avec les moines et cérémonies autour des stupas de Boudhanath.' }
    ],
    region: 'nepal'
  },
  agra: {
    name: 'Agra',
    slug: 'agra',
    heroTitle: 'Voyage à Agra & Taj Mahal',
    h1Title: 'Agra : La Cité Impériale Moghole & Le Majestueux Taj Mahal',
    tagline: 'Merveille du Monde, Fort d\'Agra et splendeurs mogholes',
    image: '/images/dest-tajmahal.jpg',
    satisfaction: '99% de satisfaction (180 avis)',
    shortDescription: "Visitez le majestueux Taj Mahal en marbre blanc au lever du soleil et l'historique Fort d'Agra. Joyau de l'Empire moghol, Agra est une étape incontournable offrant une richesse patrimoniale et architecturale incomparable.",
    fullDescription: "Découvrez l'ancienne capitale des empereurs moghouls. Du marbre blanc immaculé du Taj Mahal aux remparts de grès rouge du Fort d'Agra et aux ruines préservées de Fatehpur Sikri, plongez au cœur de l'histoire et du raffinement moghol.",
    highlights: [
      { icon: 'fa-heart', title: 'Taj Mahal au Lever du Soleil', desc: 'Merveille du Monde baignée par les douces lumières de l\'aube.' },
      { icon: 'fa-landmark', title: 'Fort Rouge d\'Agra', desc: 'Résidence impériale moghole et forteresse classée au patrimoine de l\'UNESCO.' },
      { icon: 'fa-archway', title: 'Fatehpur Sikri', desc: 'Cité impériale magnifiquement conservée aux portes d\'Agra.' },
      { icon: 'fa-paint-brush', title: 'Artisans du Marbre', desc: 'Savoir-faire séculaire de marqueterie de marbre incrusté de pierres semi-précieuses.' }
    ],
    region: 'inde-du-nord'
  },
  delhi: {
    name: 'Delhi',
    slug: 'delhi',
    heroTitle: 'Voyage à Delhi',
    h1Title: 'Delhi : Capitale Millénaire entre Histoire et Modernité',
    tagline: 'Des ruelles vibrantes d\'Old Delhi aux avenues majestueuses de New Delhi',
    image: '/images/dest-tajmahal.jpg',
    satisfaction: '98% de satisfaction (145 avis)',
    shortDescription: "Capitale vibrante et carrefour millénaire, Delhi dévoile les contrastes saisissants de l'Inde : du labyrinthe historique de Chandni Chowk aux monuments majestueux de la dynastie moghole.",
    fullDescription: "Explorez les trésors de Delhi avec chauffeur privé : la Grande Mosquée Jama Masjid, le Tombeau d'Humayun, le Qutb Minar et les boulevards verdoyants de New Delhi conçus par Lutyens.",
    highlights: [
      { icon: 'fa-mosque', title: 'Jama Masjid & Chandni Chowk', desc: 'La plus grande mosquée d\'Inde et balade immersive en rickshaw.' },
      { icon: 'fa-monument', title: 'Tombeau d\'Humayun (UNESCO)', desc: 'Précurseur architectural du Taj Mahal au milieu de jardins persans.' },
      { icon: 'fa-place-of-worship', title: 'Qutb Minar', desc: 'Plus haut minaret de briques au monde datant du XIIe siècle.' },
      { icon: 'fa-sun', title: 'Temple du Lotus & India Gate', desc: 'Monuments emblématiques mêlant modernité, recueillement et mémoire.' }
    ],
    region: 'inde-du-nord'
  },
  'delhi-agra': {
    name: 'Delhi & Taj Mahal d\'Agra',
    slug: 'delhi-agra',
    heroTitle: 'Voyage Delhi & Taj Mahal',
    h1Title: 'Delhi & Agra : Merveille du Monde et Joyaux Moghouls',
    tagline: 'Du Taj Mahal à l\'aube aux marchés vibrants de Chandni Chowk',
    image: '/images/dest-tajmahal.jpg',
    satisfaction: '99% de satisfaction (180 avis)',
    shortDescription: "Découvrez le cœur battant et historique de l'Inde du Nord. Admirez la beauté féérique du Taj Mahal au lever du soleil, visitez l'imposant Fort Rouge d'Agra et explorez les monuments impériaux de Delhi.",
    highlights: [
      { icon: 'fa-heart', title: 'Taj Mahal à l\'Aube', desc: 'L\'une des 7 Merveilles du Monde illuminée par les premiers rayons du soleil.' },
      { icon: 'fa-landmark', title: 'Fort Rouge d\'Agra', desc: 'Palais en grès rouge des empereurs moghouls dominant la rivière Yamuna.' },
      { icon: 'fa-biking', title: 'Old Delhi en Rickshaw', desc: 'Traversée haut en couleurs des bazars parfumés de Chandni Chowk.' },
      { icon: 'fa-monument', title: 'Qutb Minar & Humayun', desc: 'Minaret historique du XIIIe siècle et tombeau impérial précurseur du Taj Mahal.' }
    ],
    region: 'inde-du-nord'
  },
  varanasi: {
    name: 'Varanasi',
    slug: 'varanasi',
    heroTitle: 'Voyage à Varanasi',
    h1Title: 'Varanasi (Bénarès) : Capitale Spirituelle & Gange Sacré',
    tagline: 'Ghats séculaires, cérémonies Ganga Aarti et balades spirituelles sur le fleuve',
    image: '/images/dest-varanasi.jpg',
    satisfaction: '98% de satisfaction (95 avis)',
    shortDescription: "Varanasi est la plus ancienne cité vivante d'Inde. Plongez dans l'intensité mystique des rituels sacrés, assistez à la grandiose cérémonie nocturne du Ganga Aarti et naviguez à l'aube sur le fleuve vénéré.",
    highlights: [
      { icon: 'fa-fire', title: 'Ganga Aarti', desc: 'Spectacle hypnotique de lampes à huile, de chants sacrés et d\'incantations au crépuscule.' },
      { icon: 'fa-ship', title: 'Aube sur le Gange', desc: 'Navigation matinale en barque pour observer les ablutions et la dévotion des pèlerins.' },
      { icon: 'fa-dharmachakra', title: 'Sarnath Sacré', desc: 'Le parc des daims où le Bouddha prononça son tout premier enseignement.' },
      { icon: 'fa-gopuram', title: 'Vieille Ville Mystique', desc: 'Dédale fascinant d\'ruelles anciennes, d\'échoppes d\'épices et de temples mystérieux.' }
    ],
    region: 'inde-du-nord'
  },
  gujarat: {
    name: 'Gujarat',
    slug: 'gujarat',
    heroTitle: 'Voyage au Gujarat',
    h1Title: 'Gujarat : Désert de Sel Blanc du Rann de Kutch & Lions d\'Asie',
    tagline: 'Artisanat textile tribal, temples jaïns de Palitana et nature préservée',
    image: '/images/dest-gujarat.jpg',
    satisfaction: '96% de satisfaction (52 avis)',
    shortDescription: "Le Gujarat offre une Inde authentique et méconnue. Émerveillez-vous devant l'immensité étincelante du désert de sel du Rann de Kutch, gravitiez les marches sacrées de Palitana et partez en safari à Gir.",
    highlights: [
      { icon: 'fa-sun', title: 'Grand Rann de Kutch', desc: 'Le plus grand désert de sel blanc au monde illuminé par la pleine lune.' },
      { icon: 'fa-cat', title: 'Lions de la Forêt de Gir', desc: 'Dernier refuge sur Terre des majestueux lions asiatiques sauvages.' },
      { icon: 'fa-gopuram', title: 'Temples de Palitana', desc: 'Complexe sacré de 863 temples sculptés sur les collines du mont Shatrunjaya.' },
      { icon: 'fa-tshirt', title: 'Artisanat & Broderies', desc: 'Techniques ancestrales de tissage Ikat et de broderies tribales d\'exception.' }
    ],
    region: 'gujarat'
  },
  'amritsar-punjab': {
    name: 'Amritsar & Le Punjab',
    slug: 'amritsar-punjab',
    heroTitle: 'Voyage à Amritsar & Punjab',
    h1Title: 'Amritsar & Le Punjab : Temple d\'Or et Hospitalité Sikh',
    tagline: 'Temple d\'Or scintillant, ferveur spirituelle, gastronomie généreuse et cérémonie de Wagah',
    image: '/images/dest-jodhpur.jpg',
    satisfaction: '98% de satisfaction (78 avis)',
    shortDescription: "Capitale spirituelle de la communauté sikh, Amritsar abrite le somptueux Harmandir Sahib (Temple d'Or), havre de paix et de dévotion inconditionnelle. Découvrez une culture chaleureuse, des cuisines réputées et la cérémonie spectaculaire de la frontière indo-pakistanaise de Wagah.",
    highlights: [
      { icon: 'fa-sun', title: 'Harmandir Sahib (Temple d\'Or)', desc: 'Le sanctuaire d\'or étincelant au cœur du bassin sacré d\'Amrit Sarovar.' },
      { icon: 'fa-utensils', title: 'Langar Sacré', desc: 'La plus grande cuisine communautaire gratuite au monde servant 100 000 repas par jour.' },
      { icon: 'fa-flag', title: 'Frontière de Wagah', desc: 'Cérémonie militaire théâtrale de descente des drapeaux entre l\'Inde et le Pakistan.' },
      { icon: 'fa-history', title: 'Jallianwala Bagh', desc: 'Mémorial historique émouvant retraçant la lutte pour l\'indépendance indienne.' }
    ],
    region: 'inde-du-nord'
  },
  'dharamsala-himachal': {
    name: 'Dharamsala & Himachal Pradesh',
    slug: 'dharamsala-himachal',
    heroTitle: 'Voyage à Dharamsala & Himachal',
    h1Title: 'Dharamsala & Himachal : Résidence du Dalaï-Lama au Cœur de l\'Himalaya',
    tagline: 'McLeod Ganj, monastères tibétains, forêts de cèdres et vallées de Kangra et Manali',
    image: '/images/dest-himachal.jpg',
    satisfaction: '97% de satisfaction (64 avis)',
    shortDescription: "Niché sur les pentes boisées de la chaîne des Dhauladhar, Dharamsala et son faubourg McLeod Ganj constituent le refuge du Dalaï-Lama et du gouvernement tibétain en exil. Imprégnez-vous de spiritualité bouddhiste au milieu de paysages de pins majestueux.",
    highlights: [
      { icon: 'fa-place-of-worship', title: 'Temple du Dalaï-Lama', desc: 'Centre névralgique de la spiritualité tibétaine et lieu d\'enseignement bouddhiste.' },
      { icon: 'fa-mountain', title: 'Vallée de Kangra', desc: 'Collines verdoyantes, plantations de thé et forteresse médiévale de Kangra.' },
      { icon: 'fa-hiking', title: 'Trek de Triund', desc: 'Randonnée panoramique offrant des vues spectaculaires sur les crêtes enneigées de l\'Himalaya.' },
      { icon: 'fa-hands', title: 'Institut Norbulingka', desc: 'Préservation des arts et traditions tibétains : peinture thangka et artisanat d\'art.' }
    ],
    region: 'inde-du-nord'
  },
  'rishikesh-uttarakhand': {
    name: 'Rishikesh & Haridwar (Uttarakhand)',
    slug: 'rishikesh-uttarakhand',
    heroTitle: 'Voyage à Rishikesh & Haridwar',
    h1Title: 'Rishikesh & Haridwar : Capitale Mondiale du Yoga et Gange Sauvage',
    tagline: 'Ashrams mythiques, ponts suspendus Lakshman Jhula et Aarti vibrant à Har Ki Pauri',
    image: '/images/image-12.jpg',
    satisfaction: '98% de satisfaction (82 avis)',
    shortDescription: "Aux portes de l'Himalaya, là où les eaux émeraude du Gange descendent des montagnes, Rishikesh et Haridwar forment un sanctuaire de sérénité et de quête spirituelle. Pratiquez le yoga et la méditation dans les ashrams historiques et vibrez aux chants sacrés de l'Aarti.",
    highlights: [
      { icon: 'fa-om', title: 'Ashrams & Yoga', desc: 'Pratique ancestrale du yoga et de la méditation guidée par des maîtres certifiés.' },
      { icon: 'fa-bridge', title: 'Ponts Lakshman & Ram Jhula', desc: 'Passerelles suspendues mythiques au-dessus des eaux cristallines du Gange.' },
      { icon: 'fa-fire', title: 'Aarti d\'Haridwar', desc: 'Milliers de petites lampes de fleurs allumées flottant sur le fleuve au crépuscule.' },
      { icon: 'fa-water', title: 'Rafting & Nature Himalaya', desc: 'Descentes d\'eaux vives et randonnées dans les contreforts boisés de l\'Uttarakhand.' }
    ],
    region: 'inde-du-nord'
  },
  'tamil-nadu': {
    name: 'Tamil Nadu & Temples Dravidiens',
    slug: 'tamil-nadu',
    heroTitle: 'Voyage au Tamil Nadu',
    h1Title: 'Tamil Nadu : Cités Temples Millénaires & Comptoir de Pondichéry',
    tagline: 'Gopurams multicolores de Madurai, grands temples Chola de Tanjore et charme français de Pondichéry',
    image: '/images/dest-karnataka.jpg',
    satisfaction: '98% de satisfaction (91 avis)',
    shortDescription: "Terre de la culture dravidienne pure, le Tamil Nadu fascine par ses cités-temples gigantesques aux gopurams vertigineux sculptés de milliers de divinités. De la majesté de Madurai au romantisme colonial de Pondichéry et aux sanctuaires côtiers de Mahabalipuram.",
    highlights: [
      { icon: 'fa-gopuram', title: 'Temple Meenakshi de Madurai', desc: 'Chef-d\'œuvre dravidien foisonnant de sculptures polychromes et rituels quotidiens.' },
      { icon: 'fa-landmark', title: 'Temples Chola de Tanjore', desc: 'Monuments UNESCO en granit pur témoignant du génie architectural de l\'Empire Chola.' },
      { icon: 'fa-compass', title: 'Pondichéry & Auroville', desc: 'Flânerie dans le quartier blanc aux maisons coloniales françaises et communauté d\'Auroville.' },
      { icon: 'fa-monument', title: 'Mahabalipuram Côtier', desc: 'Bas-relief de la Descente du Gange et Temples du Rivage face à l\'océan Indien.' }
    ],
    region: 'inde-du-sud'
  },
  chennai: {
    name: 'Chennai',
    slug: 'chennai',
    heroTitle: 'Voyage à Chennai',
    h1Title: 'Chennai & Tamil Nadu : Cité Métropolitaine & Portes du Sud',
    tagline: 'Porte d\'entrée du Tamil Nadu, temples dravidiens, plages de Marina et héritage colonial',
    image: '/images/dest-karnataka.jpg',
    satisfaction: '98% de satisfaction (64 avis)',
    shortDescription: "Capitale vibrante du Tamil Nadu, Chennai (anciennement Madras) est la porte d’entrée incontournable de l’Inde du Sud. Découvrez la longue plage de Marina Beach, la basilique Saint-Thomas, le temple de Kapaleeshwarar et un riche patrimoine culturel et gastronomique.",
    fullDescription: "Traversée du Sud de l'Inde de Chennai à la côte est à Cochin à la côte ouest. Au programme : les temples pyramidaux et colorés du Sud, l'ancien comptoir français de Pondichéry, l'ashram Aurobindo, le Parc national de Periyar et les eaux des backwaters d'Alleppey.",
    highlights: [
      { icon: 'fa-gopuram', title: 'Temple de Kapaleeshwarar', desc: 'Magnifique sanctuaire dravidien dédié à Shiva avec ses gopurams sculptés multicolores.' },
      { icon: 'fa-umbrella-beach', title: 'Marina Beach', desc: 'Une des plus longues plages urbaines au monde vibrant au coucher du soleil.' },
      { icon: 'fa-church', title: 'Basilique Saint-Thomas', desc: 'Édifice néo-gothique érigé sur le tombeau de l\'apôtre Thomas.' },
      { icon: 'fa-monument', title: 'Fort St. George & Musées', desc: 'Première forteresse britannique en Inde, témoin de l\'histoire coloniale.' }
    ],
    region: 'inde-du-sud'
  },
  karnataka: {
    name: 'Karnataka & Hampi',
    slug: 'karnataka',
    heroTitle: 'Voyage au Karnataka',
    h1Title: 'Karnataka : Cité Oubliée de Hampi & Palais des Maharajas de Mysore',
    tagline: 'Ruines grandioses de Vijayanagara, temples ciselés de Belur et faste oriental de Mysore',
    image: '/images/image-6.jpg',
    satisfaction: '99% de satisfaction (67 avis)',
    shortDescription: "Le Karnataka recèle certains des plus beaux trésors architecturaux d'Inde du Sud. Explorez le site surréaliste de Hampi parsemé d'immenses blocs de granit et de temples en ruines, admirez la dentelle de pierre des temples Hoysala et le somptueux palais illuminé de Mysore.",
    highlights: [
      { icon: 'fa-monument', title: 'Hampi Cité Millénaire (UNESCO)', desc: 'Paysage lunaire spectaculaire et ruines colossales du prestigieux empire de Vijayanagara.' },
      { icon: 'fa-crown', title: 'Palais de Mysore', desc: 'Joyau d\'architecture indo-sarrasine scintillant de 100 000 ampoules chaque dimanche soir.' },
      { icon: 'fa-gem', title: 'Temples Hoysala de Belur & Halebid', desc: 'Sanctuaires en stéatite ciselés avec la précision et la finesse d\'un orfèvre.' },
      { icon: 'fa-coffee', title: 'Collines de Coorg & Café', desc: 'Plantations de café ombragées, cascades et forêts tropicales des Ghâts occidentaux.' }
    ],
    region: 'inde-du-sud'
  },
  goa: {
    name: 'Goa & Côte Tropicale',
    slug: 'goa',
    heroTitle: 'Voyage à Goa',
    h1Title: 'Goa : Plages Dorées, Églises Portugaises & Douceur Tropicale',
    tagline: 'Plages frangées de cocotiers, architecture coloniale d\'Old Goa et coucher de soleil sur la mer d\'Arabie',
    image: '/images/dest-goa.jpg',
    satisfaction: '97% de satisfaction (58 avis)',
    shortDescription: "Véritable parenthèse balnéaire et coloniale, Goa mêle harmonieusement traditions indiennes et héritage portugais. Détendez-vous sur des plages de sable doré, découvrez les basiliques baroques classées à l'UNESCO et dégustez une gastronomie savoureuse de fruits de mer et d'épices.",
    highlights: [
      { icon: 'fa-umbrella-beach', title: 'Plages Préservées', desc: 'Palolem, Agonda et Mandrem : criques paisibles ombragées de cocotiers.' },
      { icon: 'fa-church', title: 'Old Goa & Basilique Bom Jesus', desc: 'Sanctuaires baroques classés UNESCO abritant les reliques de Saint François-Xavier.' },
      { icon: 'fa-pepper-hot', title: 'Plantations d\'Épices Tropicales', desc: 'Visite guidée et dégustation au cœur des jardins aromatiques de cardamome et vanille.' },
      { icon: 'fa-ship', title: 'Croisière sur la Rivière Mandovi', desc: 'Navigation au soleil couchant avec musique et danses traditionnelles goanaises.' }
    ],
    region: 'inde-du-sud'
  },
  orissa: {
    name: 'Orissa / Odisha & Konark',
    slug: 'orissa',
    heroTitle: 'Voyage en Orissa',
    h1Title: 'Orissa : Temple du Soleil de Konark & Tribus Authentiques',
    tagline: 'Char monumental en pierre de Konark, cité sacrée de Puri et marchés artisanaux',
    image: '/images/dest-orissa.jpg',
    satisfaction: '96% de satisfaction (43 avis)',
    shortDescription: "Bordée par le golfe du Bengale, l'Orissa (Odisha) est un trésor d'art sacré et de traditions vivantes. Admirez le gigantesque Temple du Soleil de Konark, vibrez à la spiritualité de Puri et partez à la rencontre de minorités ethniques perpétuant des savoir-faire ancestraux.",
    highlights: [
      { icon: 'fa-sun', title: 'Temple du Soleil de Konark (UNESCO)', desc: 'Immense chariot céleste de pierre sculpté de 24 roues géantes et tiré par sept chevaux.' },
      { icon: 'fa-place-of-worship', title: 'Puri & Temple de Jagannath', desc: 'L\'un des quatre pèlerinages les plus sacrés de l\'hindouisme (Char Dham).' },
      { icon: 'fa-water', title: 'Lac Chilika & Dauphins', desc: 'La plus grande lagune côtière d\'Asie, refuge d\'oiseaux migrateurs et de dauphins de l\'Irrawaddy.' },
      { icon: 'fa-palette', title: 'Village d\'Artisans de Raghurajpur', desc: 'Berceau des peintures traditionnelles Pattachitra sur feuille de palmier et masques sculptés.' }
    ],
    region: 'inde-du-sud'
  },
  bhoutan: {
    name: 'Bhoutan',
    slug: 'bhoutan',
    heroTitle: 'Voyage au Bhoutan',
    h1Title: 'Bhoutan : Le Royaume du Bonheur National Brut & Monastères de l\'Himalaya',
    tagline: 'Nid du Tigre (Taktshang) suspendu aux falaises, forteresses Dzongs et traditions séculaires',
    image: '/images/jaipur-travel.jpg',
    satisfaction: '99% de satisfaction (56 avis)',
    shortDescription: "Dernier royaume bouddhiste de l'Himalaya, le Bhoutan cultive un art de vivre fondé sur le Bonheur National Brut et la préservation de son environnement. Des forteresses monumentales (Dzongs) de Paro et Punakha jusqu'à l'ascension légendaire du monastère suspendu de Taktshang.",
    highlights: [
      { icon: 'fa-place-of-worship', title: 'Monastère du Nid du Tigre (Taktshang)', desc: 'Sanctuaire iconique accroché à une falaise verticale à 3 120 m d\'altitude.' },
      { icon: 'fa-fort-awesome', title: 'Punakha Dzong Majestueux', desc: 'La plus majestueuse forteresse du pays au confluent de deux rivières sacrées.' },
      { icon: 'fa-mountain', title: 'Vallée Glaciaire de Phobjikha', desc: 'Havre de paix préservé où viennent hiberner les rares grues à cou noir.' },
      { icon: 'fa-mask', title: 'Festivals Tshechu & Masques Sacrés', desc: 'Danses mystiques costumées exécutées par les moines dans les cours des Dzongs.' }
    ],
    region: 'bhoutan'
  },
  bombay: {
    name: 'Bombay (Mumbai)',
    slug: 'bombay',
    heroTitle: 'Voyage à Bombay',
    h1Title: 'Bombay (Mumbai) : Métropole Vibrante & Cité du Cinéma Bollywood',
    tagline: 'Gateway of India, Marine Drive, marchés colorés et grottes d\'Elephanta',
    image: '/images/dest-rajasthan.jpg',
    satisfaction: '98% de satisfaction (70 avis)',
    shortDescription: "Capitale économique et financière de l'Inde, Bombay (Mumbai) est une mégapole effervescente face à la mer d'Oman. Découvrez l'architecture victorienne classée UNESCO, le célèbre Gateway of India et l'énergie débordante de cette cité cosmopolite.",
    highlights: [
      { icon: 'fa-landmark', title: 'Gateway of India', desc: 'Monument emblématique érigé face au port de Bombay.' },
      { icon: 'fa-umbrella-beach', title: 'Marine Drive', desc: 'Le collier de la reine illuminé au coucher du soleil.' },
      { icon: 'fa-film', title: 'Bollywood & Culture', desc: 'Immersion dans les coulisses des studios de cinéma les plus prolifiques du monde.' },
      { icon: 'fa-place-of-worship', title: 'Île d\'Elephanta (UNESCO)', desc: 'Grottes sculptées millénaires dédiées à Shiva au milieu de la baie.' }
    ],
    region: 'inde-du-sud'
  },
  madras: {
    name: 'Madras (Chennai)',
    slug: 'madras',
    heroTitle: 'Voyage à Madras',
    h1Title: 'Madras : Cité Historique & Patrimoine Dravidien du Sud',
    tagline: 'Temples séculaires, plage de Marina et carrefour culturel du Tamil Nadu',
    image: '/images/dest-karnataka.jpg',
    satisfaction: '98% de satisfaction (64 avis)',
    shortDescription: "Ancienne Madras, Chennai est le cœur culturel et artistique du Tamil Nadu, berceau de la musique carnatique et de la danse Bharatanatyam.",
    highlights: [
      { icon: 'fa-gopuram', title: 'Temple de Kapaleeshwarar', desc: 'Gopurams sculptés polychromes dédiés à Shiva.' },
      { icon: 'fa-umbrella-beach', title: 'Marina Beach', desc: 'Immense plage urbaine animée au crépuscule.' },
      { icon: 'fa-church', title: 'Basilique Saint-Thomas', desc: 'Patrimoine historique chrétien séculaire.' },
      { icon: 'fa-landmark', title: 'Fort St. George', desc: 'Témoin majeur de l\'histoire coloniale britannique.' }
    ],
    region: 'inde-du-sud'
  },
  'madhya-pradesh': {
    name: 'Madhya Pradesh',
    slug: 'madhya-pradesh',
    heroTitle: 'Voyage au Madhya Pradesh',
    h1Title: 'Madhya Pradesh : Le Cœur de l\'Inde, Temples de Khajuraho & Tigres',
    tagline: 'Temples érotiques de Khajuraho, forteresses d\'Orchha et parcs nationaux',
    image: '/images/image-6.jpg',
    satisfaction: '97% de satisfaction (55 avis)',
    shortDescription: "Le Madhya Pradesh est le cœur sauvage et patrimonial de l'Inde : temples sculptés de Khajuraho, palais d'Orchha, forteresse colossale de Gwalior et safaris aux tigres dans les parcs de Kanha et Bandhavgarh.",
    highlights: [
      { icon: 'fa-gem', title: 'Temples de Khajuraho (UNESCO)', desc: 'Sculptures érotiques et spirituelles de grès d\'une finesse incomparable.' },
      { icon: 'fa-fort-awesome', title: 'Orchha Médiévale', desc: 'Palais et cénotaphes paisibles au bord de la rivière Betwa.' },
      { icon: 'fa-cat', title: 'Safaris aux Tigres', desc: 'Observation des tigres du Bengale dans les forêts du Livre de la Jungle.' },
      { icon: 'fa-monument', title: 'Fort de Gwalior', desc: 'Forteresse imprenable dominant la ville historique.' }
    ],
    region: 'inde-de-louest'
  },
  'darjeeling-sikkim': {
    name: 'Darjeeling & Sikkim',
    slug: 'darjeeling-sikkim',
    heroTitle: 'Voyage à Darjeeling & Sikkim',
    h1Title: 'Darjeeling & Sikkim : Plantations de Thé & Vue sur le Kangchenjunga',
    tagline: 'Train à vapeur Toy Train, monastères tibétains et sommets himalayens',
    image: '/images/dest-himachal.jpg',
    satisfaction: '99% de satisfaction (60 avis)',
    shortDescription: "Face au géant Kangchenjunga (8 586 m), Darjeeling et l'ancien royaume du Sikkim dévoilent un univers de brumes mystiques, de plantations de thé d'altitude et de monastères bouddhistes séculaires.",
    highlights: [
      { icon: 'fa-mountain', title: 'Mont Kangchenjunga', desc: 'Lever de soleil inoubliable sur le 3e plus haut sommet de la planète depuis Tiger Hill.' },
      { icon: 'fa-leaf', title: 'Jardins de Thé de Darjeeling', desc: 'Dégustation des plus grands crus de thé au monde parmi les collines émeraude.' },
      { icon: 'fa-place-of-worship', title: 'Monastère de Rumtek', desc: 'Haut lieu du bouddhisme tibétain au Sikkim.' },
      { icon: 'fa-train', title: 'Toy Train (UNESCO)', desc: 'Ligne ferroviaire historique à vapeur serpentant à flanc de montagne.' }
    ],
    region: 'inde-de-louest'
  }
};

defaultDestinationsMap['amritsar'] = defaultDestinationsMap['amritsar-punjab'];
defaultDestinationsMap['himachal-pradesh'] = defaultDestinationsMap['dharamsala-himachal'];
defaultDestinationsMap['rishikesh'] = defaultDestinationsMap['rishikesh-uttarakhand'];
defaultDestinationsMap['benares'] = defaultDestinationsMap['varanasi'];

const defaultPackages = [];

const slugAliases = {
  'delhi': 'delhi',
  'agra': 'agra',
  'taj-mahal-agra': 'agra',
  'delhi-agra': 'delhi-agra',
  'amritsar': 'amritsar-punjab',
  'punjab': 'amritsar-punjab',
  'dharamsala': 'dharamsala-himachal',
  'himachal': 'dharamsala-himachal',
  'himachal-pradesh': 'dharamsala-himachal',
  'spiti': 'dharamsala-himachal',
  'kinnaur': 'dharamsala-himachal',
  'shimla': 'dharamsala-himachal',
  'manali': 'dharamsala-himachal',
  'rishikesh': 'rishikesh-uttarakhand',
  'uttarakhand': 'rishikesh-uttarakhand',
  'benares': 'varanasi',
  'benaras': 'varanasi',
  'bénarès': 'varanasi',
  'bombay': 'bombay',
  'mumbai': 'bombay',
  'darjeeling': 'darjeeling-sikkim',
  'sikkim': 'darjeeling-sikkim',
  'darjeeling-sikkim': 'darjeeling-sikkim',
  'madhya': 'madhya-pradesh',
  'madhya-pradesh': 'madhya-pradesh',
  'nepal': 'nepal',
  'népal': 'nepal',
  'katmandou': 'nepal',
  'pokhara': 'nepal',
  'chitwan': 'nepal',
  'bhoutan': 'bhoutan',
  'paro': 'bhoutan',
  'punakha': 'bhoutan',
  'thimphu': 'bhoutan',
  'chennai': 'chennai',
  'madras': 'madras',
  'goa': 'goa',
  'karnataka': 'karnataka',
  'kerala': 'kerala',
  'tamil-nadu': 'tamil-nadu',
  'tamil': 'tamil-nadu',
  'orissa': 'orissa',
  'odisha': 'orissa',
  'gujarat': 'gujarat',
  'rajasthan': 'rajasthan',
  'ladakh': 'ladakh'
};

const DestinationDetail = ({ overrideSlug }) => {
  const { slug: paramSlug, category: paramCat } = useParams();
  const rawSlug = overrideSlug || paramSlug || paramCat || 'rajasthan';
  const cleanRaw = typeof rawSlug === 'string' ? rawSlug.trim().replace(/^\/+|\/+$/g, '') : rawSlug;
  const currentSlug = slugAliases[cleanRaw?.toLowerCase()] || cleanRaw;

  const [destInfo, setDestInfo] = useState(null);
  const [packages, setPackages] = useState(defaultPackages);
  const [loading, setLoading] = useState(true);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState({ title: 'Voyage sur mesure', duration: '' });
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 100% PURE CATEGORY BASED MATCHING (No transit city, route or title bleed)
  const filterToursForDestination = (tourList, targetSlug) => {
    if (!Array.isArray(tourList) || tourList.length === 0) return [];
    const clean = (targetSlug || '').toLowerCase().trim();

    return tourList.filter(t => {
      const cat = (t.category || '').toLowerCase().trim();
      const catId = String(t.categoryId || '').toLowerCase().trim();

      // 1. Inde du Nord
      if (clean === 'agra') {
        return cat === 'agra' || catId === 'agra';
      }
      if (clean === 'amritsar-punjab' || clean === 'amritsar' || clean === 'punjab') {
        return cat === 'amritsar' || cat === 'punjab' || cat.includes('amritsar');
      }
      if (clean === 'varanasi' || clean === 'benares' || clean === 'bénarès') {
        return cat === 'varanasi' || cat === 'benares' || cat === 'bénarès' || cat.includes('varanasi') || cat.includes('bénarès') || cat.includes('benares');
      }
      if (clean === 'delhi') {
        return (cat === 'delhi' || catId === 'delhi' || catId === '6ac60d86fc92c5d1638294ba' || catId === '6ab21b8f4a1fe5af024d95ff') && !cat.includes('rajasthan') && !cat.includes('himachal');
      }
      if (clean === 'delhi-agra') {
        return cat === 'delhi' || cat === 'agra' || catId === 'delhi' || catId === 'agra';
      }
      if (clean === 'dharamsala-himachal' || clean === 'himachal-pradesh' || clean === 'himachal' || clean === 'dharamsala' || clean === 'spiti' || clean === 'kinnaur') {
        return cat === 'himachal pradesh' || cat === 'himachal' || cat.includes('himachal') || cat.includes('dharamsala') || cat.includes('spiti') || cat.includes('kinnaur');
      }
      if (clean === 'ladakh') {
        return cat === 'ladakh' || cat.includes('ladakh');
      }
      if (clean === 'rajasthan') {
        return (cat === 'rajasthan' || (cat.includes('rajasthan') && !cat.includes('gujarat')) || catId === 'rajasthan' || catId === '6ab2196edf6a34f9195b10c5' || catId === '6ac60d86fc92c5d1638294b6') && !cat.includes('gujarat') && !cat.includes('delhi');
      }
      if (clean === 'rishikesh-uttarakhand' || clean === 'rishikesh' || clean === 'uttarakhand') {
        return cat === 'rishikesh' || cat.includes('rishikesh') || cat === 'uttarakhand' || cat.includes('uttarakhand');
      }

      // 2. Inde du Sud
      if (clean === 'chennai') {
        return cat === 'chennai' || catId === 'chennai';
      }
      if (clean === 'goa') {
        return cat === 'goa' || catId === 'goa';
      }
      if (clean === 'karnataka') {
        return cat === 'karnataka' || cat.includes('karnataka');
      }
      if (clean === 'kerala') {
        return cat === 'kerala' || cat.includes('kerala');
      }
      if (clean === 'tamil-nadu' || clean === 'tamil') {
        return cat === 'tamil nadu' || cat === 'tamil' || cat.includes('tamil');
      }
      if (clean === 'bombay' || clean === 'mumbai') {
        return cat === 'bombay' || cat === 'mumbai';
      }
      if (clean === 'madras') {
        return cat === 'madras';
      }
      if (clean === 'orissa' || clean === 'odisha') {
        return cat === 'orissa' || cat === 'odisha';
      }

      // 3. Inde de l'Est & de l'Ouest
      if (clean === 'gujarat') {
        return cat === 'gujarat' || cat.includes('gujarat');
      }
      if (clean === 'madhya-pradesh' || clean === 'madhya') {
        return cat === 'madhya pradesh' || cat === 'madhya' || cat.includes('madhya');
      }
      if (clean === 'darjeeling-sikkim' || clean === 'darjeeling' || clean === 'sikkim') {
        return cat.includes('darjeeling') || cat.includes('sikkim');
      }

      // 4. Népal
      if (clean === 'nepal' || clean === 'népal') {
        return cat === 'nepal' || cat === 'népal';
      }

      // 5. Bhoutan
      if (clean === 'bhoutan' || clean === 'punakha' || clean === 'paro' || clean === 'thimphu') {
        return cat === 'bhoutan' || cat === clean || cat.includes('bhoutan');
      }

      // Fallback exact match on category or categoryId
      return cat === clean || cat.replace(/\s+/g, '-') === clean || catId === clean;
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);

    // 1. Fetch destination info
    fetchDestinationBySlug(currentSlug)
      .then((res) => {
        if (res.data) {
          setDestInfo(res.data);
        } else {
          setDestInfo(getFallbackDestination(currentSlug));
        }
      })
      .catch(() => {
        setDestInfo(getFallbackDestination(currentSlug));
      })
      .finally(() => {
        setLoading(false);
      });

    // 2. Fetch tours matching this category / destination strictly
    fetchTours({ category: currentSlug })
      .then((res) => {
        const tourList = Array.isArray(res.data) ? res.data : [];
        const filtered = filterToursForDestination(tourList, currentSlug);
        setPackages(filtered);
      })
      .catch(() => {
        setPackages([]);
      });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSlug]);

  const getFallbackDestination = (s) => {
    if (defaultDestinationsMap[s]) {
      return defaultDestinationsMap[s];
    }
    const imageMap = {
      'amritsar-punjab': '/images/dest-jodhpur.jpg',
      'dharamsala-himachal': '/images/dest-himachal.jpg',
      'rishikesh-uttarakhand': '/images/image-12.jpg',
      'tamil-nadu': '/images/dest-karnataka.jpg',
      'karnataka': '/images/image-6.jpg',
      'goa': '/images/dest-goa.jpg',
      'orissa': '/images/dest-orissa.jpg',
      'bhoutan': '/images/jaipur-travel.jpg',
      'nepal': '/images/dest-nepal.jpg',
      'gujarat': '/images/dest-gujarat.jpg',
      'delhi-agra': '/images/dest-tajmahal.jpg',
      'varanasi': '/images/dest-varanasi.jpg',
      'ladakh': '/images/dest-ladakh.jpg',
      'rajasthan': '/images/dest-rajasthan.jpg',
      'kerala': '/images/dest-kerala.jpg'
    };

    const formattedName = s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ');
    return {
      name: formattedName,
      slug: s,
      heroTitle: `Voyage ${formattedName}`,
      h1Title: `Voyage & Circuit sur Mesure à ${formattedName}`,
      tagline: `Découvrez les trésors et merveilles de ${formattedName} avec nos experts locaux`,
      image: imageMap[s] || `/images/dest-${s}.jpg`,
      satisfaction: '98% de satisfaction (110 avis)',
      shortDescription: `Découvrez ${formattedName} avec Jodhpur Voyage. Laissez-vous séduire par des paysages spectaculaires, des monuments historiques d'exception et une culture authentique au cœur de l'Inde et de l'Himalaya.`,
      fullDescription: `Nos itinéraires personnalisés à ${formattedName} combinent chauffeurs privés, guides expérimentés francophones et hébergements de charme soigneusement sélectionnés.`,
      highlights: [
        { icon: 'fa-monument', title: 'Monuments Incontournables', desc: `Explorez les édifices et sanctuaires emblématiques de ${formattedName}.` },
        { icon: 'fa-camera', title: 'Paysages Grandioses', desc: 'Des panoramas uniques à couper le souffle pour des souvenirs mémorables.' },
        { icon: 'fa-users', title: 'Rencontres Locales', desc: 'Immersion culturelle chaleureuse auprès des habitants et artisans.' },
        { icon: 'fa-user-shield', title: 'Chauffeur Privé & Guide', desc: 'Un service 100% sur mesure, flexible et sécurisé tout au long du séjour.' }
      ],
      region: s
    };
  };

  const activeDest = destInfo || getFallbackDestination(currentSlug);

  const handleOpenBooking = (title, duration) => {
    setSelectedTour({ title, duration });
    setModalOpen(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToCircuits = () => {
    const el = document.getElementById('circuits-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <SEO
        title={activeDest.seoTitle || activeDest.metaTitle || `Voyage au ${activeDest.name} — Circuits & Séjours sur Mesure | Jodhpur Voyage`}
        description={activeDest.seoDescription || activeDest.metaDescription || activeDest.shortDescription}
        keywords={activeDest.seoKeywords || activeDest.metaKeywords || `voyage ${activeDest.name?.toLowerCase()}, circuit ${activeDest.name?.toLowerCase()}, sejour sur mesure ${activeDest.name?.toLowerCase()}`}
        ogTitle={activeDest.seoTitle || activeDest.metaTitle || `Voyage au ${activeDest.name} — Circuits & Séjours sur Mesure | Jodhpur Voyage`}
        ogDescription={activeDest.seoDescription || activeDest.metaDescription || activeDest.shortDescription}
        ogImage={activeDest.image || '/images/dest-rajasthan.jpg'}
        canonicalUrl={`https://jodhpurvoyage.com/category/${activeDest.slug || currentSlug}`}
      />

      {/* =========================================================================
          TERRES D'AVENTURE STYLE HERO BANNER
          ========================================================================= */}
      <section 
        style={{ 
          position: 'relative', 
          minHeight: '480px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: '#ffffff',
          overflow: 'hidden',
          background: '#0F172A'
        }}
      >
        <img
          src={activeDest.image || '/images/dest-rajasthan.jpg'}
          alt={`Voyage ${activeDest.name}`}
          onError={(e) => { e.currentTarget.src = "/images/dest-rajasthan.jpg"; }}
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            opacity: 1 
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '60px 20px', textShadow: '0 2px 10px rgba(0,0,0,0.85), 0 4px 20px rgba(0,0,0,0.95)' }}>
          <span 
            style={{ 
              background: 'var(--primary-color, #C58B39)', 
              color: '#ffffff', 
              padding: '6px 18px', 
              borderRadius: '20px', 
              fontSize: '0.85rem', 
              fontWeight: '700', 
              letterSpacing: '1px', 
              textTransform: 'uppercase', 
              display: 'inline-block', 
              marginBottom: '16px' 
            }}
          >
            <i className="fas fa-compass" style={{ marginRight: '6px' }}></i>
            {activeDest.tagline || `Voyages & Circuits d'Exception`}
          </span>

          <h1 style={{ fontSize: 'clamp(1.4rem, 2.6vw, 2.1rem)', color: '#ffffff', fontWeight: '800', marginBottom: '14px', textShadow: '0 2px 10px rgba(0,0,0,0.85), 0 4px 20px rgba(0,0,0,0.95)' }}>
            {activeDest.heroTitle || `Voyage ${activeDest.name}`}
          </h1>

          {/* Satisfaction Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', margin: '0 auto 24px', fontSize: '0.95rem', color: '#FCD34D' }}>
            <span style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.25)', color: '#ffffff' }}>
              <i className="fas fa-star" style={{ color: '#F59E0B', marginRight: '6px' }}></i>
              {activeDest.satisfaction || '98% de satisfaction (112 avis)'}
            </span>
          </div>

          <button 
            type="button" 
            className="btn btn-gold btn-lg" 
            onClick={scrollToCircuits} 
            style={{ borderRadius: '30px', padding: '14px 32px', fontSize: '1rem', fontWeight: '700', boxShadow: '0 4px 15px rgba(197, 139, 57, 0.4)' }}
          >
            Tous les voyages au {activeDest.name} <i className="fas fa-chevron-down" style={{ marginLeft: '8px' }}></i>
          </button>
        </div>
      </section>

      {/* =========================================================================
          BREADCRUMBS & INTRODUCTORY OVERVIEW
          ========================================================================= */}
      <section style={{ background: '#F8FAFC', padding: '36px 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          {/* Breadcrumb */}
          <nav style={{ fontSize: '0.88rem', color: 'var(--text-muted, #64748B)', marginBottom: '20px' }}>
            <Link to="/" style={{ color: 'var(--text-muted, #64748B)', textDecoration: 'none' }}>Accueil</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <Link to="/destinations" style={{ color: 'var(--text-muted, #64748B)', textDecoration: 'none' }}>Destinations</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--primary-color, #C58B39)', fontWeight: '600' }}>{activeDest.name}</span>
          </nav>

          <h2 style={{ fontSize: '1.8rem', color: 'var(--secondary-color, #1E293B)', fontWeight: '800', marginBottom: '16px' }}>
            {activeDest.h1Title || `Voyage & Trek au ${activeDest.name}`}
          </h2>

          <div style={{ background: '#ffffff', padding: '24px 28px', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', borderLeft: '4px solid var(--primary-color, #C58B39)' }}>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#334155', margin: 0 }}>
              {activeDest.shortDescription}
            </p>

            {activeDest.fullDescription && (
              <>
                {showFullDesc && (
                  <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#334155', marginTop: '14px' }}>
                    {activeDest.fullDescription}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setShowFullDesc(!showFullDesc)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--primary-color, #C58B39)',
                    fontWeight: '700',
                    cursor: 'pointer',
                    marginTop: '12px',
                    padding: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {showFullDesc ? 'Réduire' : 'Lire la suite'}
                  <i className={`fas fa-chevron-${showFullDesc ? 'up' : 'down'}`}></i>
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          HIGHLIGHTS & EXPERIENCES SECTION
          ========================================================================= */}
      {activeDest.highlights && activeDest.highlights.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">Les Incontournables</span>
              <h2 className="section-title">Pourquoi Visiter le {activeDest.name} ?</h2>
              <p className="section-description">Des moments d'exception et des paysages uniques gravés à jamais.</p>
            </div>

            <div className="pillars-grid">
              {activeDest.highlights.map((h, i) => (
                <div key={i} className="pillar-card">
                  <div className="pillar-icon-circle">
                    <i className={`fas ${typeof h === 'object' ? h.icon || 'fa-star' : 'fa-check-circle'}`}></i>
                  </div>
                  <h3 className="pillar-title">{typeof h === 'object' ? h.title : `Points Forts ${i+1}`}</h3>
                  <p className="pillar-desc">{typeof h === 'object' ? h.desc : h}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          TOUR PACKAGES GRID
          ========================================================================= */}
      {packages && packages.length > 0 ? (
        <section id="circuits-section" className="section-padding bg-cream">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">Circuits & Offres Spéciales</span>
              <h2 className="section-title">Nos Offres de Voyage au {activeDest.name}</h2>
              <p className="section-description">
                Sélectionnez un circuit privatif sur mesure et découvrez son itinéraire complet avec chauffeur privé.
              </p>
            </div>

            <div className="tours-grid">
              {packages.map((pkg, idx) => (
                <div key={pkg._id || pkg.slug || idx} className="tour-card">
                  <Link to={`/${pkg.slug}`} className="tour-card-image-wrap" title="Voir l'itinéraire du voyage">
                    <img src={pkg.image || activeDest.image || '/images/dest-rajasthan.jpg'} alt={pkg.title} />
                    <span className="tour-card-badge">{(pkg.badge && pkg.badge.trim().toLowerCase() === 'popular') ? 'Populaire' : (pkg.badge || 'Populaire')}</span>
                    <div className="tour-card-duration">
                      <i className="far fa-clock"></i> {pkg.duration}
                    </div>
                  </Link>
                  <div className="tour-card-body">
                    <div className="tour-card-location">
                      <i className="fas fa-map-marker-alt"></i> {pkg.location || activeDest.name}
                    </div>
                    <h3 className="tour-card-title">
                      <Link to={`/${pkg.slug}`}>{pkg.title}</Link>
                    </h3>
                    <p className="tour-card-excerpt">
                      {pkg.excerpt || pkg.subtitle || (pkg.overview ? pkg.overview.slice(0, 110) + '...' : '')}
                    </p>
                    <div className="tour-card-footer mt-auto">
                      <Link to={`/${pkg.slug}`} className="btn btn-sm btn-outline">
                        Voir l'itinéraire
                      </Link>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => handleOpenBooking(pkg.title, pkg.duration)}
                      >
                        <i className="fas fa-paper-plane"></i> Devis / Réserver
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section id="circuits-section" className="section-padding bg-cream">
          <div className="container" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ maxWidth: '650px', margin: '0 auto', background: '#ffffff', padding: '48px 32px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <i className="fas fa-map-marked-alt" style={{ fontSize: '3rem', color: 'var(--primary-color, #C58B39)', marginBottom: '18px', display: 'inline-block' }}></i>
              <h3 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#1E293B', marginBottom: '14px' }}>
                Itinéraires sur mesure pour {activeDest.name}
              </h3>
              <p style={{ color: '#64748B', lineHeight: '1.75', marginBottom: '28px', fontSize: '1.02rem' }}>
                Cette destination est entièrement personnalisable dans le cadre d'un circuit privé en Inde avec chauffeur dédié. Contactez notre équipe pour concevoir un itinéraire exclusif incluant {activeDest.name}.
              </p>
              <Link to="/voyage-sur-mesure" className="btn btn-primary btn-lg" style={{ borderRadius: '30px', padding: '14px 32px' }}>
                <i className="fas fa-sliders-h" style={{ marginRight: '8px' }}></i> Concevoir Mon Voyage à {activeDest.name}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          CTA BANNER
          ========================================================================= */}
      <section className="cta-banner-section">
        <img src={activeDest.image || "/images/image-8.jpg"} alt="CTA Background" className="cta-bg-image" />
        <div className="container cta-content">
          <h2 className="cta-title">Votre voyage 100% sur mesure au {activeDest.name}</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '24px', fontSize: '1.1rem' }}>
            Nos conseillers locaux organisent votre circuit privé selon vos dates, vos envies et votre rythme.
          </p>
          <Link to="/voyage-sur-mesure" className="btn btn-primary btn-lg">
            Demander un Devis Gratuit
          </Link>
        </div>
      </section>

      {/* =========================================================================
          FLOATING WIDGETS
          ========================================================================= */}
      <a
        href="https://wa.me/919650698869"
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

      {/* Booking Modal */}
      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        tourTitle={selectedTour.title}
        tourDuration={selectedTour.duration}
      />
    </>
  );
};

export default DestinationDetail;
