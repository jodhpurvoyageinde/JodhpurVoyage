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
    name: 'Bhoutan – Royaume du Dragon',
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
  }
};

const defaultPackages = [
  {
    title: 'Séjour au Rajasthan et Bénarès – Le Rajasthan et la rivière Gange',
    duration: '17 Jours / 16 Nuits',
    image: '/images/dest-rajasthan.jpg',
    location: 'Rajasthan & Bénarès',
    badge: 'Populaire',
    excerpt: 'Un voyage d\'exception alliant la féerie des palais des Maharajas et la spiritualité sacrée de Varanasi sur les bords du Gange.',
    slug: 'sejour-au-rajasthan-et-benares'
  },
  {
    title: 'Trek & Voyage d\'Exception au Ladakh – Le Petit Tibet',
    duration: '14 Jours / 13 Nuits',
    image: '/images/dest-ladakh.jpg',
    location: 'Leh, Pangong & Vallée de la Nubra',
    badge: 'Himalaya',
    excerpt: 'Une grande traversée de l\'Himalaya entre monastères bouddhistes perchés, lac Pangong Tso et franchissement du col Khardung La.',
    slug: 'trek-voyage-ladakh-petit-tibet'
  },
  {
    title: 'Voyage au Rajasthan Hors des Sentiers Battus',
    duration: '15 Jours / 14 Nuits',
    image: '/images/Voyage-Jaisalmer.jpg',
    location: 'Villages & Forts Ruraux',
    badge: 'Authentique',
    excerpt: 'Immergez-vous dans la vraie vie rurale indienne, dormez dans des havelis de charme et découvrez des palais secrets.',
    slug: 'voyage-au-rajasthan-hors-des-sentiers-battus'
  },
  {
    title: 'Joyaux du Kerala & Backwaters sur Mesure',
    duration: '12 Jours / 11 Nuits',
    image: '/images/dest-kerala.jpg',
    location: 'Cochin, Alleppey & Munnar',
    badge: 'Nature & Ayurveda',
    excerpt: 'Croisières en Houseboat privé sur les lagunes tranquilles, plantations de thé de Munnar et massages ayurvédiques.',
    slug: 'joyaux-du-kerala-backwaters'
  }
];

const slugAliases = {
  'delhi': 'delhi-agra',
  'agra': 'delhi-agra',
  'amritsar': 'amritsar-punjab',
  'punjab': 'amritsar-punjab',
  'dharamsala': 'dharamsala-himachal',
  'himachal': 'dharamsala-himachal',
  'rishikesh': 'rishikesh-uttarakhand',
  'uttarakhand': 'rishikesh-uttarakhand',
  'benares': 'varanasi',
  'katmandou': 'nepal',
  'pokhara': 'nepal',
  'chitwan': 'nepal',
  'paro': 'bhoutan',
  'punakha': 'bhoutan',
  'thimphu': 'bhoutan'
};

const DestinationDetail = ({ overrideSlug }) => {
  const { slug: paramSlug } = useParams();
  const rawSlug = overrideSlug || paramSlug || 'rajasthan';
  const currentSlug = slugAliases[rawSlug.toLowerCase()] || rawSlug;

  const [destInfo, setDestInfo] = useState(null);
  const [packages, setPackages] = useState(defaultPackages);
  const [loading, setLoading] = useState(true);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState({ title: 'Voyage sur mesure', duration: '' });
  const [showScrollTop, setShowScrollTop] = useState(false);

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

    // 2. Fetch tours matching this category / destination
    fetchTours({ category: currentSlug })
      .then((res) => {
        const tourList = Array.isArray(res.data) ? res.data : [];
        if (tourList.length > 0) {
          // Compare and ensure only matching category/destination tours are shown
          const cleanSlug = currentSlug.toLowerCase().trim();
          const filtered = tourList.filter(t => {
            const cat = (t.category || '').toLowerCase();
            const title = (t.title || '').toLowerCase();
            const loc = (t.location || '').toLowerCase();
            const cities = Array.isArray(t.cities) 
              ? t.cities.map(c => (typeof c === 'string' ? c : c.name || c.slug || '').toLowerCase())
              : [];

            if (cleanSlug === 'rajasthan') {
              if (cat.includes('gujarat') || cat.includes('ladakh') || cat.includes('nepal') || cat.includes('népal') || cat.includes('karnataka') || cat.includes('kerala')) {
                return false;
              }
              return cat.includes('rajasthan') || title.includes('rajasthan') || loc.includes('rajasthan') || cities.some(c => c.includes('rajasthan') || c.includes('jaipur') || c.includes('jodhpur') || c.includes('udaipur') || c.includes('jaisalmer') || c.includes('bikaner'));
            }
            if (cleanSlug === 'gujarat') {
              return cat.includes('gujarat') || title.includes('gujarat') || loc.includes('gujarat') || cities.some(c => c.includes('gujarat') || c.includes('ahmedabad') || c.includes('kutch') || c.includes('palitana') || c.includes('gir'));
            }
            if (cleanSlug === 'ladakh') {
              return cat.includes('ladakh') || title.includes('ladakh') || loc.includes('ladakh') || cities.some(c => c.includes('ladakh') || c.includes('leh'));
            }
            if (cleanSlug === 'kerala') {
              return cat.includes('kerala') || title.includes('kerala') || loc.includes('kerala') || cities.some(c => c.includes('kerala') || c.includes('cochin') || c.includes('munnar') || c.includes('alleppey'));
            }
            if (cleanSlug === 'nepal') {
              return cat.includes('nepal') || cat.includes('népal') || title.includes('nepal') || loc.includes('nepal') || cities.some(c => c.includes('nepal') || c.includes('kathmandu') || c.includes('pokhara'));
            }

            return cat.includes(cleanSlug) || title.includes(cleanSlug) || loc.includes(cleanSlug) || cities.some(c => c.includes(cleanSlug));
          });

          setPackages(filtered.length > 0 ? filtered : tourList);
        } else {
          fetchTours({ region: currentSlug })
            .then((r2) => {
              const r2List = Array.isArray(r2.data) ? r2.data : [];
              if (r2List.length > 0) {
                setPackages(r2List);
              } else {
                const fallbackFiltered = defaultPackages.filter(p => 
                  p.location?.toLowerCase().includes(currentSlug.toLowerCase()) || 
                  p.title?.toLowerCase().includes(currentSlug.toLowerCase())
                );
                setPackages(fallbackFiltered.length > 0 ? fallbackFiltered : defaultPackages);
              }
            })
            .catch(() => setPackages(defaultPackages));
        }
      })
      .catch(() => {
        setPackages(defaultPackages);
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
        canonicalUrl={`https://jodhpurvoyage.com/destinations/${activeDest.slug || currentSlug}`}
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
                  <span className="tour-card-badge">{pkg.badge || 'Populaire'}</span>
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
