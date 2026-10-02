export const adminUser = {
  name: 'Admin Jodhpur Voyage',
  email: 'admin@jodhpurvoyage.com',
  password: 'admin123456',
  role: 'admin'
};

export const destinationsData = [
  {
    name: 'Rajasthan',
    slug: 'rajasthan',
    region: 'inde-du-nord',
    tagline: 'Terre des Maharajas, des Cités Royales et du Désert du Thar',
    shortDescription: 'Le Rajasthan est la terre mythique des forteresses grandioses, des palais des Mille et Une Nuits, des cités colorées (Jaïpur la rose, Jodhpur la bleue, Udaipur la blanche, Jaisalmer la dorée) et des traditions séculaires.',
    fullDescription: 'Joyau de l’Inde du Nord, le Rajasthan fascine par sa féérie architecturale et son hospitalité légendaire. Des dunes envoûtantes du désert du Thar aux lacs romantiques d’Udaipur, en passant par les ruelles bleu indigo de Jodhpur et les havelis peints du Shekhawati, chaque étape est une traversée dans le temps.',
    bestTimeToVisit: 'D’octobre à fin mars (climat doux et ensoleillé)',
    climateInfo: 'Climat semi-aride : hivers doux (12°C à 26°C), étés chauds.',
    image: '/images/dest-rajasthan.jpg',
    gallery: [
      '/images/dest-rajasthan.jpg',
      '/images/dest-jodhpur.jpg',
      '/images/Voyage-Jaisalmer.jpg',
      '/images/jaipur-travel.jpg'
    ],
    highlights: [
      'Fort de Mehrangarh à Jodhpur dominant la vieille ville bleue',
      'Coucher de soleil sur les dunes du désert du Thar à Jaisalmer',
      'Palais des Vents (Hawa Mahal) et Fort d’Amber à Jaipur',
      'Balade en bateau sur le Lac Pichola à Udaipur',
      'Fresques murales des havelis du Shekhawati'
    ],
    keyAttractions: [
      {
        name: 'Fort de Mehrangarh (Jodhpur)',
        description: 'L’une des plus imposantes et spectaculaires forteresses d’Inde, perchée sur une falaise de 120 mètres.',
        image: '/images/dest-jodhpur.jpg'
      },
      {
        name: 'Jaïpur & Amber Fort',
        description: 'La capitale royale du Rajasthan, célèbre pour ses façades roses et ses observatoires astronomiques.',
        image: '/images/jaipur-travel.jpg'
      },
      {
        name: 'Désert de Jaisalmer',
        description: 'La cité dorée sculptée dans le grès jaune au milieu des dunes de sable fin.',
        image: '/images/Voyage-Jaisalmer.jpg'
      }
    ],
    featured: true,
    published: true
  },
  {
    name: 'Delhi & Taj Mahal d\'Agra',
    slug: 'delhi-agra',
    region: 'inde-du-nord',
    tagline: 'Capitale millénaire, Merveille du Monde et Splendeur Moghole',
    shortDescription: 'De la mythique Delhi au Taj Mahal d’Agra jusqu’au Fort d’Agra et à la cité fantôme de Fatehpur Sikri.',
    bestTimeToVisit: 'D’octobre à avril',
    image: '/images/dest-tajmahal.jpg',
    gallery: ['/images/dest-tajmahal.jpg'],
    highlights: [
      'Visite du sublime Taj Mahal à l\'aube',
      'Fort Rouge d\'Agra et Tombeau d\'Itimad-ud-Daulah',
      'Minaret du Qutb Minar et Tombeau de Humayun à Delhi',
      'Balade en rickshaw dans le dédale de Chandni Chowk'
    ],
    featured: true,
    published: true
  },
  {
    name: 'Varanasi & Bénarès',
    slug: 'varanasi',
    region: 'inde-du-nord',
    tagline: 'Capitale spirituelle de l’Inde et Ghats sacrés du Gange',
    shortDescription: 'Varanasi (Bénarès) est l’une des plus anciennes cités vivantes au monde, où la vie, la foi hindoue et les rituels sacrés se déroulent au fil du fleuve Gange.',
    bestTimeToVisit: 'D’octobre à mars',
    image: '/images/dest-varanasi.jpg',
    gallery: ['/images/dest-varanasi.jpg'],
    highlights: [
      'Cérémonie nocturne du Ganga Aarti à Dashashwamedh Ghat',
      'Balade en barque à l’aube sur le Gange sacré',
      'Site bouddhique de Sarnath où Bouddha donna son premier enseignement',
      'Ruelles labyrinthiques de la vieille ville'
    ],
    featured: true,
    published: true
  },
  {
    name: 'Amritsar & Le Punjab',
    slug: 'amritsar-punjab',
    region: 'inde-du-nord',
    tagline: 'Terre Sacrée des Sikhs et Temple d\'Or Scintillant',
    shortDescription: 'Le Temple d\'Or d\'Amritsar, merveille dorée flottant sur le bassin sacré de l\'Amrit Sarovar, les cuisines communautaires géantes (Langar) et la relève de la garde à la frontière indo-pakistanaise de Wagah.',
    bestTimeToVisit: 'D’octobre à avril',
    image: '/images/dest-jodhpur.jpg',
    gallery: ['/images/dest-jodhpur.jpg'],
    highlights: [
      'Le Temple d\'Or (Harmandir Sahib) illuminé de mille feux',
      'Les cuisines communautaires (Langar) servant 100 000 repas gratuits par jour',
      'Cérémonie militaire théâtrale à Wagah Border',
      'Hospitalité et gastronomie généreuse du Punjab'
    ],
    featured: true,
    published: true
  },
  {
    name: 'Dharamsala & Himachal Pradesh',
    slug: 'dharamsala-himachal',
    region: 'inde-du-nord',
    tagline: 'Résidence du Dalaï-Lama et Sommets de l\'Himalaya',
    shortDescription: 'McLeod Ganj et Dharamsala au cœur des forêts de cèdres, vallées glaciaires de Manali, anciennes stations d\'altitude britanniques de Shimla et vallées secrètes de Spiti et Kinnaur.',
    bestTimeToVisit: 'De mars à juin et de septembre à novembre',
    image: '/images/dest-himachal.jpg',
    gallery: ['/images/dest-himachal.jpg'],
    highlights: [
      'Résidence et monastère principal de Sa Sainteté le Dalaï-Lama',
      'Plantations de thé de la vallée de Kangra',
      'Cols alpins et villages traditionnels en bois sculpté',
      'Randonnées au pied de la chaîne du Dhauladhar'
    ],
    featured: true,
    published: true
  },
  {
    name: 'Rishikesh & Haridwar (Uttarakhand)',
    slug: 'rishikesh-uttarakhand',
    region: 'inde-du-nord',
    tagline: 'Capitale Mondiale du Yoga et Gange Immortel',
    shortDescription: 'Sanctuaire des yogis et sages méditants au pied de l\'Himalaya, ashrams historiques des Beatles, ponts suspendus Lakshman Jhula et cérémonies Aarti au bord des eaux cristallines.',
    bestTimeToVisit: 'D’octobre à mai',
    image: '/images/image-12.jpg',
    gallery: ['/images/image-12.jpg'],
    highlights: [
      'Séances de yoga et méditation dans des ashrams réputés',
      'Cérémonie Aarti du soir à Parmarth Niketan et Har Ki Pauri',
      'Rafting et baignades rafraîchissantes sur le haut Gange',
      'Passerelles suspendues au-dessus du fleuve émeraude'
    ],
    featured: true,
    published: true
  },
  {
    name: 'Ladakh & Spiti – Le Petit Tibet',
    slug: 'ladakh',
    region: 'ladakh',
    tagline: 'Le Petit Tibet – Monastères perchés et cols vertigineux',
    shortDescription: 'Terre de haute altitude aux paysages lunaires grandioses, de spiritualité bouddhiste tibétaine et de lacs turquoise nichés à plus de 4 000 mètres.',
    bestTimeToVisit: 'De mai à fin septembre',
    image: '/images/dest-ladakh.jpg',
    gallery: ['/images/dest-ladakh.jpg'],
    highlights: [
      'Monastères bouddhistes de Thiksey, Hemis et Lamayuru',
      'Lac Pangong Tso aux eaux changeantes',
      'Vallée de la Nubra et dunes de sable de Hunder',
      'Franchissement du mythique col de Khardung La (5 359 m)'
    ],
    featured: true,
    published: true
  },
  {
    name: 'Kerala & Inde du Sud',
    slug: 'kerala',
    region: 'inde-du-sud',
    tagline: 'God’s Own Country – Lagunes d’émeraude, plantations de thé & Ayurveda',
    shortDescription: 'Une Inde tropicale, paisible et luxuriante. Croisières en houseboat traditionnel sur les backwaters, collines verdoyantes de Munnar et soins ayurvédiques authentiques.',
    bestTimeToVisit: 'De septembre à avril',
    image: '/images/dest-kerala.jpg',
    gallery: ['/images/dest-kerala.jpg'],
    highlights: [
      'Nuit à bord d’un Houseboat privé sur les Backwaters d’Alleppey',
      'Plantations de thé et d’épices de Munnar',
      'Spectacle traditionnel de danse Kathakali à Cochin',
      'Plages bordées de cocotiers à Marari'
    ],
    featured: true,
    published: true
  },
  {
    name: 'Tamil Nadu & Temples Dravidiens',
    slug: 'tamil-nadu',
    region: 'inde-du-sud',
    tagline: 'Gopurams Colossaux, Cités Sacrées et Pondichéry',
    shortDescription: 'La splendeur de l\'art dravidien à travers les temples géants de Madurai (Meenakshi), Tanjore et Chidambaram, l\'ancienne colonie française de Pondichéry et les sanctuaires côtiers de Mahabalipuram.',
    bestTimeToVisit: 'D’octobre à mars',
    image: '/images/dest-karnataka.jpg',
    gallery: ['/images/dest-karnataka.jpg'],
    highlights: [
      'Temple Meenakshi de Madurai aux milliers de statues polychromes',
      'Grand Temple Brihadesvara de Tanjore (UNESCO)',
      'Maisons coloniales et charme français de Pondichéry',
      'Falaises sculptées et Temple du Rivage à Mahabalipuram'
    ],
    featured: true,
    published: true
  },
  {
    name: 'Karnataka & Palais de Mysore',
    slug: 'karnataka',
    region: 'inde-du-sud',
    tagline: 'Vestiges Démesurés de Hampi et Palais Royal de Mysore',
    shortDescription: 'L\'empire médiéval oublié de Vijayanagara disséminé au milieu des blocs de granit géants à Hampi (UNESCO), les chefs-d\'œuvre Hoysala de Belur/Halebid et l\'éblouissant palais des Maharajas de Mysore.',
    bestTimeToVisit: 'D’octobre à avril',
    image: '/images/image-6.jpg',
    gallery: ['/images/image-6.jpg'],
    highlights: [
      'Cité monumentale de Hampi et char de pierre de Vittala',
      'Palais des Maharajas de Mysore illuminé de 100 000 ampoules',
      'Temples sculptés en dentelle de pierre de Belur et Halebid',
      'Statue colossale de Gomateshvara à Shravanabelagola'
    ],
    featured: true,
    published: true
  },
  {
    name: 'Gujarat & Désert de Kutch',
    slug: 'gujarat',
    region: 'gujarat',
    tagline: 'Désert blanc du Rann de Kutch et Lions d’Asie',
    shortDescription: 'Région fascinante et préservée, patrie de Gandhi, réputée pour ses temples jaïns de Palitana, ses puits à degrés sculptés et son artisanat textile exceptionnel.',
    bestTimeToVisit: 'De novembre à mars',
    image: '/images/dest-gujarat.jpg',
    gallery: ['/images/dest-gujarat.jpg'],
    highlights: [
      'Grand Rann de Kutch sous la pleine lune',
      'Derniers lions d’Asie sauvages au Parc de Gir',
      'Temples sacrés de Palitana sur la colline de Shatrunjaya'
    ],
    featured: true,
    published: true
  },
  {
    name: 'Goa & Côte Tropicale',
    slug: 'goa',
    region: 'inde-du-sud',
    tagline: 'Plages Dorées, Églises Baroques et Douceur de Vivre',
    shortDescription: 'Une escale ensoleillée et apaisante alliant plages paradisiaques de la mer d\'Arabie, églises de Vieux-Goa classées UNESCO, demeures indo-portugaises et plantations d\'épices.',
    bestTimeToVisit: 'De novembre à avril',
    image: '/images/dest-goa.jpg',
    gallery: ['/images/dest-goa.jpg'],
    highlights: [
      'Basilique du Bon Jésus et cathédrale Sainte-Catherine (UNESCO)',
      'Plages préservées de Palolem et Agonda',
      'Croisière au coucher du soleil sur la rivière Mandovi',
      'Cuisine réputée mêlant épices indiennes et héritage portugais'
    ],
    featured: true,
    published: true
  },
  {
    name: 'Orissa / Odisha & Temple du Soleil',
    slug: 'orissa',
    region: 'centre-est',
    tagline: 'Sanctuaire de Konark, Puri et Merveilles Tribales',
    shortDescription: 'Le monumental char solaire sculpté de Konark (UNESCO), la ville sainte de Puri sur le golfe du Bengale, les sanctuaires aux toits curvilignes de Bhubaneswar et les villages tribaux authentiques.',
    bestTimeToVisit: 'D’octobre à mars',
    image: '/images/dest-orissa.jpg',
    gallery: ['/images/dest-orissa.jpg'],
    highlights: [
      'Temple du Soleil de Konark aux 24 roues géantes',
      'Ferveur sacrée autour du temple de Jagannath à Puri',
      'Lagune du lac Chilika et ses dauphins de l\'Irrawaddy',
      'Artisanat de peintures sur feuille de palmier (Pattachitra)'
    ],
    featured: false,
    published: true
  },
  {
    name: 'Centre de l\'Inde & Madhya Pradesh',
    slug: 'madhya-pradesh',
    region: 'centre-est',
    tagline: 'Temples de Khajuraho, Forteresses d\'Orccha et Safaris Tigres',
    shortDescription: 'Le cœur historique et sauvage de l\'Inde : les célébrissimes sculptures médiévales de Khajuraho (UNESCO), les cénotaphes féeriques d\'Orccha au bord de la rivière Betwa et les parcs nationaux abritant les tigres du Bengale.',
    bestTimeToVisit: 'D’octobre à avril',
    image: '/images/image-8.jpg',
    gallery: ['/images/image-8.jpg'],
    highlights: [
      'Temples orientaux et occidentaux de Khajuraho (UNESCO)',
      'Palais de Jahangir Mahal et cénotaphes d\'Orccha',
      'Safaris en 4x4 dans le parc national de Bandhavgarh / Kanha',
      'Forteresse imprenable de Gwalior'
    ],
    featured: true,
    published: true
  },
  {
    name: 'Darjeeling & Sikkim',
    slug: 'darjeeling-sikkim',
    region: 'centre-est',
    tagline: 'Plantations de Thé Légendaires et Vue sur le Kanchenjunga',
    shortDescription: 'Les contreforts de l\'Himalaya oriental, le train à vapeur d\'époque Toy Train classé UNESCO, les jardins de thé d\'altitude mondialement renommés et les monastères tibétains du Sikkim.',
    bestTimeToVisit: 'De mars à mai et d\'octobre à décembre',
    image: '/images/slide8-300x176.jpg',
    gallery: ['/images/slide8-300x176.jpg'],
    highlights: [
      'Lever de soleil sur le mont Kanchenjunga depuis Tiger Hill',
      'Traversée en train à vapeur classé UNESCO Toy Train',
      'Visite et dégustation dans les plantations de thé bio',
      'Monastères de Rumtek et Enchey à Gangtok'
    ],
    featured: false,
    published: true
  },
  {
    name: 'Népal',
    slug: 'nepal',
    region: 'nepal',
    tagline: 'Royaume de l’Himalaya, Cités Royales & Parcs Sauvages',
    shortDescription: 'Katmandou, Patan, Bhaktapur, les sommets de l’Annapurna et les safaris à dos d’éléphant dans la jungle de Chitwan.',
    bestTimeToVisit: 'D’octobre à mai',
    image: '/images/dest-nepal.jpg',
    gallery: ['/images/dest-nepal.jpg'],
    highlights: [
      'Stupas sacrés de Swayambhunath et Boudhanath à Katmandou',
      'Vue panoramique sur la chaîne de l’Himalaya à Pokhara',
      'Safari rhinocéros unicornes dans le Parc National de Chitwan'
    ],
    featured: true,
    published: true
  },
  {
    name: 'Bhoutan – Royaume du Dragon',
    slug: 'bhoutan',
    region: 'bhoutan',
    tagline: 'Le Pays du Bonheur National Brut et le Nid du Tigre',
    shortDescription: 'Un royaume himalayen préservé du temps : le monastère suspendu de Paro Taktshang (Nid du Tigre), les forteresses Dzongs de Thimphu et Punakha, et des forêts de pins immaculées.',
    bestTimeToVisit: 'De mars à mai et de septembre à novembre',
    image: '/images/jaipur-travel.jpg',
    gallery: ['/images/jaipur-travel.jpg'],
    highlights: [
      'Ascension spectaculaire vers le monastère du Nid du Tigre (Taktshang)',
      'Splendide forteresse de Punakha Dzong au confluent de deux rivières',
      'Découverte de la capitale paisible de Thimphu',
      'Festivals traditionnels Tshechu et danses masquées sacrées'
    ],
    featured: true,
    published: true
  },
  {
    name: 'Jodhpur',
    slug: 'jodhpur',
    region: 'rajasthan',
    tagline: 'La Cité Bleue du Rajasthan & Fort de Mehrangarh',
    shortDescription: 'La cité bleue du Rajasthan dominée par l’imprenable Fort de Mehrangarh, ses ruelles indigo et ses marchés d’épices vivants.',
    bestTimeToVisit: 'D’octobre à mars',
    image: '/images/dest-jodhpur.jpg',
    gallery: ['/images/dest-jodhpur.jpg'],
    highlights: [
      'Fort de Mehrangarh et vue panoramique sur les maisons bleues',
      'Marché coloré de la Tour de l’Horloge (Sardar Market)',
      'Mémorial royal de Jaswant Thada en marbre blanc'
    ],
    featured: true,
    published: true
  },
  {
    name: 'Taj Mahal & Agra',
    slug: 'taj-mahal-agra',
    region: 'inde-du-nord',
    tagline: 'Merveille du Monde & Splendeur Moghole',
    shortDescription: 'Visitez le majestueux Taj Mahal en marbre blanc au lever du soleil et l’historique Fort d’Agra.',
    bestTimeToVisit: 'D’octobre à avril',
    image: '/images/dest-tajmahal.jpg',
    gallery: ['/images/dest-tajmahal.jpg'],
    highlights: [
      'Visite féérique du Taj Mahal au lever du soleil',
      'Fort d’Agra en grès rouge (UNESCO)',
      'Fatehpur Sikri, la cité impériale abandonnée'
    ],
    featured: true,
    published: true
  },
  {
    name: 'Himachal Pradesh',
    slug: 'himachal-pradesh',
    region: 'inde-du-nord',
    tagline: 'Vallées Verdoyantes & Sommets d’Himalaya',
    shortDescription: 'Les vallées alpines de Manali, Shimla et les paysages majestueux des contreforts de l’Himalaya.',
    bestTimeToVisit: 'De mars à juin et de septembre à novembre',
    image: '/images/dest-himachal.jpg',
    gallery: ['/images/dest-himachal.jpg'],
    highlights: [
      'Station d’altitude coloniale de Shimla',
      'Vallées verdoyantes et vergers de Manali',
      'Cols alpins de Rohtang et Solang'
    ],
    featured: true,
    published: true
  },
  {
    name: 'Punakha',
    slug: 'punakha',
    region: 'bhoutan',
    tagline: 'Majestueuse forteresse Dzong au confluent des rivières',
    shortDescription: 'La capitale hivernale du Bhoutan, célèbre pour son magnifique Punakha Dzong et son pont suspendu.',
    bestTimeToVisit: 'D’octobre à avril',
    image: '/images/Voyage-Jaisalmer.jpg',
    gallery: ['/images/Voyage-Jaisalmer.jpg'],
    highlights: [
      'Punakha Dzong au bord de la rivière',
      'Pont suspendu de Punakha',
      'Temple de la fertilité Chimi Lhakhang'
    ],
    featured: true,
    published: true
  },
  {
    name: 'Paro',
    slug: 'paro',
    region: 'bhoutan',
    tagline: 'Le monastère suspendu du Nid du Tigre',
    shortDescription: 'La magnifique vallée de Paro et l’ascension vers le monastère sacré de Taktshang.',
    bestTimeToVisit: 'De mars à mai et de septembre à novembre',
    image: '/images/image-9.jpg',
    gallery: ['/images/image-9.jpg'],
    highlights: [
      'Monastère Taktshang (Nid du Tigre)',
      'Musée national Ta Dzong',
      'Rinpung Dzong illuminé le soir'
    ],
    featured: false,
    published: true
  },
  {
    name: 'Thimphu',
    slug: 'thimphu',
    region: 'bhoutan',
    tagline: 'Capitale préservée du Royaume du Dragon',
    shortDescription: 'La capitale paisible sans aucun feu de circulation, riche en culture bouddhiste et artisanat traditionnel.',
    bestTimeToVisit: 'De mars à mai et de septembre à novembre',
    image: '/images/jaipur-travel.jpg',
    gallery: ['/images/jaipur-travel.jpg'],
    highlights: [
      'Statue colossale de Buddha Dordenma',
      'Tashichho Dzong, siège du gouvernement',
      'Mémorial Chorten et artisanat bhoutanais'
    ],
    featured: false,
    published: true
  },
  {
    name: 'Goa & Côte Tropicale',
    slug: 'goa',
    region: 'inde-du-sud',
    tagline: 'Plages Dorées, Églises Baroques et Douceur de Vivre',
    shortDescription: 'Une escale ensoleillée et apaisante alliant plages paradisiaques de la mer d’Arabie, églises de Vieux-Goa classées UNESCO, demeures indo-portugaises et plantations d’épices.',
    fullDescription: 'Perle de la côte ouest indienne, Goa séduit par la beauté de son littoral, son ambiance chaleureuse et son métissage culturel indo-portugais.',
    bestTimeToVisit: 'De novembre à avril',
    image: '/images/dest-goa.jpg',
    gallery: ['/images/dest-goa.jpg'],
    highlights: [
      'Basilique du Bon Jésus et cathédrale Sainte-Catherine (UNESCO)',
      'Plages préservées d’Agonda et Palolem bordées de cocotiers',
      'Croisière au coucher du soleil sur la rivière Mandovi'
    ],
    featured: true,
    published: true
  }
];

export const toursData = [
  {
    title: 'Voyage Inde du Nord – Amritsar, Dharamsala et Cachemire',
    slug: 'voyage-inde-du-nord-amritsar-dharamsala-cachemire',
    subtitle: 'Spiritualité sikhe, hauts plateaux de l\'Himalaya et lacs romantiques du Cachemire',
    duration: '18 Jours / 17 Nuits',
    daysCount: 18,
    location: 'Delhi, Rishikesh, Chandigarh, Manali, Dharamsala, Amritsar, Srinagar, Gulmarg, Sonamarg',
    region: 'inde-du-nord',
    theme: 'Culture & Spiritualité',
    badge: 'Incontournable',
    price: 1490,
    priceUnit: '€ / pers',
    rating: 5.0,
    reviewCount: 46,
    featured: false,
    published: true,
    image: '/images/dest-himachal.jpg',
    gallery: [
      '/images/dest-himachal.jpg',
      '/images/dest-jodhpur.jpg',
      '/images/image-12.jpg'
    ],
    overview: 'Un grand périple spirituel et montagnard reliant les rives sacrées du Gange à Rishikesh, le Temple d\'Or d\'Amritsar, la résidence du Dalaï-Lama à Dharamsala et la féérie des houseboats sur le lac Dal à Srinagar.',
    highlights: [
      'Le Temple d\'Or d\'Amritsar illuminé et les repas partagés au Langar',
      'Cérémonie nocturne du feu (Ganga Aarti) à Rishikesh',
      'Résidence de Sa Sainteté le Dalaï-Lama à McLeod Ganj (Dharamsala)',
      'Séjour de charme sur un Houseboat traditionnel sur le lac Dal à Srinagar',
      'Balade en barque Shikara et prairies alpines fleuries de Gulmarg'
    ],
    itinerary: [
      { day: 1, title: 'Arrivée à Delhi', description: 'Accueil chaleureux à l’aéroport par votre chauffeur privé et transfert à l’hôtel.', meals: 'Dîner libre', accommodation: 'Hôtel 4* à Delhi' },
      { day: 2, title: 'Delhi – Rishikesh', description: 'Route vers la capitale mondiale du yoga au pied de l\'Himalaya. Cérémonie Aarti au bord du Gange.', meals: 'Petit-déjeuner', accommodation: 'Hôtel de charme à Rishikesh' },
      { day: 3, title: 'Rishikesh & Haridwar', description: 'Découverte des ashrams, ponts suspendus Ram Jhula et rituels sacrés à Haridwar.', meals: 'Petit-déjeuner', accommodation: 'Hôtel à Rishikesh' },
      { day: 4, title: 'Rishikesh – Chandigarh – Shimla', description: 'Traversée vers la cité moderne de Chandigarh puis montée vers la station coloniale de Shimla.', meals: 'Petit-déjeuner', accommodation: 'Hôtel de patrimoine à Shimla' },
      { day: 5, title: 'Shimla – Manali', description: 'Route panoramique à travers les forêts de pins et vallées alpines jusqu\'à Manali.', meals: 'Petit-déjeuner', accommodation: 'Chalet de charme à Manali' },
      { day: 6, title: 'Manali – Vallée de Solang', description: 'Visite du temple en bois de Hadimba et excursion vers les sommets environnants.', meals: 'Petit-déjeuner', accommodation: 'Chalet à Manali' },
      { day: 7, title: 'Manali – Dharamsala (McLeod Ganj)', description: 'Arrivée dans le Petit Tibet indien, siège du gouvernement tibétain en exil.', meals: 'Petit-déjeuner', accommodation: 'Hôtel avec vue montagne à Dharamsala' },
      { day: 8, title: 'Dharamsala – Monastères & Dalaï-Lama', description: 'Visite du temple Tsuglagkhang, de l\'institut Norbulingka et des ateliers d\'artisanat tibétain.', meals: 'Petit-déjeuner', accommodation: 'Hôtel à Dharamsala' },
      { day: 9, title: 'Dharamsala – Amritsar', description: 'Descente vers les plaines fertiles du Punjab. Première visite du Temple d\'Or en soirée.', meals: 'Petit-déjeuner', accommodation: 'Hôtel de charme à Amritsar' },
      { day: 10, title: 'Amritsar – Temple d\'Or & Wagah Border', description: 'Immersion au Harmandir Sahib et spectacle patriotique à la frontière indo-pakistanaise.', meals: 'Petit-déjeuner', accommodation: 'Hôtel à Amritsar' },
      { day: 11, title: 'Amritsar – Jammu – Srinagar (Cachemire)', description: 'Trajet ou vol vers la magnifique vallée du Cachemire. Installation sur votre Houseboat privé.', meals: 'Petit-déjeuner et dîner', accommodation: 'Houseboat de luxe sur le Lac Dal' },
      { day: 12, title: 'Srinagar – Jardins Moghols & Shikara', description: 'Balade en barque Shikara sur le lac Dal et visite des célèbres jardins Shalimar et Nishat.', meals: 'Petit-déjeuner et dîner', accommodation: 'Houseboat de luxe' },
      { day: 13, title: 'Srinagar – Excursion à Gulmarg', description: 'Journée dans la prairie des fleurs de Gulmarg, téléphérique Gondola face aux neiges éternelles.', meals: 'Petit-déjeuner et dîner', accommodation: 'Houseboat de luxe' },
      { day: 14, title: 'Srinagar – Excursion à Sonamarg', description: 'Vallée dorée de Sonamarg et glaciers majestueux du haut Cachemire.', meals: 'Petit-déjeuner et dîner', accommodation: 'Houseboat de luxe' },
      { day: 15, title: 'Srinagar – Vol vers Delhi', description: 'Vol retour vers la capitale indienne et temps libre pour vos emplettes.', meals: 'Petit-déjeuner', accommodation: 'Hôtel 4* à Delhi' },
      { day: 16, title: 'Delhi – Monuments & Bazars', description: 'Visite du Tombeau de Humayun et balade en rickshaw dans le vieux Delhi.', meals: 'Petit-déjeuner', accommodation: 'Hôtel 4* à Delhi' },
      { day: 17, title: 'Delhi – Journée découverte', description: 'Temple du Lotus, Qutb Minar et derniers achats artisanaux.', meals: 'Petit-déjeuner', accommodation: 'Hôtel 4* à Delhi' },
      { day: 18, title: 'Delhi – Vol international de retour', description: 'Transfert à l\'aéroport international selon vos horaires. Fin de nos prestations.', meals: 'Petit-déjeuner', accommodation: 'Fin du séjour' }
    ],
    inclusions: [
      'Véhicule privé climatisé avec chauffeur professionnel dédié',
      'Hébergement 17 nuits en hôtels de charme et Houseboat de luxe au Cachemire',
      'Pension complète sur le lac Dal à Srinagar',
      'Balade en Shikara sur le Lac Dal',
      'Assistance francophone 24h/24'
    ],
    exclusions: ['Vols internationaux', 'Visas et assurances']
  },
  {
    title: 'Circuit dans la Vallée de Spiti et du Kinnaur',
    slug: 'circuit-vallee-de-spiti-et-kinnaur',
    subtitle: 'Route secrète de haute altitude, monastères millénaires et paysages lunaires de l\'Himalaya',
    duration: '18 Jours / 17 Nuits',
    daysCount: 18,
    location: 'Delhi, Shimla, Sarahan, Sangla, Kalpa, Nako, Tabo, Kaza, Chandratal, Manali',
    region: 'inde-du-nord',
    theme: 'Aventure & Montagne',
    badge: 'Hors Sentiers',
    price: 1590,
    priceUnit: '€ / pers',
    rating: 5.0,
    reviewCount: 28,
    featured: false,
    published: true,
    image: '/images/dest-himachal.jpg',
    gallery: [
      '/images/dest-himachal.jpg',
      '/images/dest-ladakh.jpg'
    ],
    overview: 'Une expédition spectaculaire à travers les vallées les plus secrètes et préservées de l\'Inde himalayenne, le long de la frontière tibétaine.',
    highlights: [
      'Monastère millénaire de Tabo classé UNESCO, joyau d\'art bouddhique',
      'Vue imprenable sur le mont sacré Kinnaur Kailash depuis Kalpa',
      'Monastère perché de Key et village le plus haut du monde à Kibber (4 270 m)',
      'Campement sous les étoiles au bord du lac turquoise de Chandratal',
      'Véhicule 4x4 tout-terrain avec chauffeur expérimenté de haute montagne'
    ],
    itinerary: [
      { day: 1, title: 'Delhi – Arrivée', description: 'Accueil à l\'aéroport et transfert à l\'hôtel.', meals: 'Dîner libre', accommodation: 'Hôtel 4* à Delhi' },
      { day: 2, title: 'Delhi – Shimla', description: 'Route vers les hauteurs fraîches de Shimla.', meals: 'Petit-déjeuner', accommodation: 'Hôtel de charme à Shimla' },
      { day: 3, title: 'Shimla – Sarahan', description: 'Visite du sublime temple en bois de Bhimakali.', meals: 'Petit-déjeuner', accommodation: 'Guesthouse à Sarahan' },
      { day: 4, title: 'Sarahan – Vallée de Sangla', description: 'Entrée dans la verdoyante vallée de Sangla et vergers de pommiers.', meals: 'Petit-déjeuner', accommodation: 'Camp de charme à Sangla' },
      { day: 5, title: 'Sangla – Chitkul – Kalpa', description: 'Dernier village habité avant la frontière tibétaine.', meals: 'Petit-déjeuner', accommodation: 'Hôtel avec vue Kinner Kailash' },
      { day: 6, title: 'Kalpa – Nako', description: 'Arrivée dans le désert d\'altitude et lac sacré de Nako.', meals: 'Petit-déjeuner', accommodation: 'Campement à Nako' },
      { day: 7, title: 'Nako – Gue – Tabo', description: 'Momie du moine de Gue et fresques millénaires de Tabo.', meals: 'Petit-déjeuner', accommodation: 'Guesthouse à Tabo' },
      { day: 8, title: 'Tabo – Dhankar – Kaza', description: 'Forteresse-monastère de Dhankar perchée sur un piton rocheux.', meals: 'Petit-déjeuner', accommodation: 'Hôtel à Kaza' },
      { day: 9, title: 'Kaza – Monastère de Key & Kibber', description: 'Le plus grand monastère de Spiti et rencontre avec les habitants.', meals: 'Petit-déjeuner', accommodation: 'Hôtel à Kaza' },
      { day: 10, title: 'Kaza – Hikkim & Komic', description: 'Le plus haut bureau de poste du monde à 4 440 m.', meals: 'Petit-déjeuner', accommodation: 'Hôtel à Kaza' },
      { day: 11, title: 'Kaza – Lac Chandratal', description: 'Passage du col de Kunzum (4 550 m) et bivouac au lac de la Lune.', meals: 'Petit-déjeuner et dîner', accommodation: 'Camp de tentes confortables' },
      { day: 12, title: 'Chandratal – Manali', description: 'Descente vertigineuse par le col de Rohtang vers Manali.', meals: 'Petit-déjeuner', accommodation: 'Hôtel à Manali' },
      { day: 13, title: 'Manali – Journée détente', description: 'Sources d\'eau chaude de Vashisht et vieux Manali.', meals: 'Petit-déjeuner', accommodation: 'Hôtel à Manali' },
      { day: 14, title: 'Manali – Chandigarh', description: 'Route de retour vers les plaines.', meals: 'Petit-déjeuner', accommodation: 'Hôtel à Chandigarh' },
      { day: 15, title: 'Chandigarh – Delhi', description: 'Visite du Rock Garden et retour vers Delhi.', meals: 'Petit-déjeuner', accommodation: 'Hôtel 4* à Delhi' },
      { day: 16, title: 'Delhi – Visites libres', description: 'Découverte des marchés et monuments.', meals: 'Petit-déjeuner', accommodation: 'Hôtel 4* à Delhi' },
      { day: 17, title: 'Delhi – Préparation retour', description: 'Journée libre pour vos souvenirs.', meals: 'Petit-déjeuner', accommodation: 'Hôtel 4* à Delhi' },
      { day: 18, title: 'Delhi – Vol retour', description: 'Transfert aéroport et vol retour.', meals: 'Petit-déjeuner', accommodation: 'Fin du voyage' }
    ],
    inclusions: ['Véhicule 4x4 adapté haute montagne', 'Hébergements 17 nuits', 'Permis spéciaux de zone frontalière inclus', 'Assistance francophone'],
    exclusions: ['Vols internationaux', 'Assurance rapatriement']
  },
  {
    title: 'Séjour au Rajasthan et Bénarès – Le Rajasthan et la rivière Gange',
    slug: 'sejour-au-rajasthan-et-benares',
    subtitle: 'Le grand classique incontournable : Palais des Maharajas, Cité Bleue, Taj Mahal & Ghats de Varanasi',
    duration: '17 Jours / 16 Nuits',
    daysCount: 17,
    location: 'Delhi, Mandawa, Bikaner, Jaisalmer, Jodhpur, Udaipur, Pushkar, Jaipur, Agra, Varanasi',
    region: 'inde-du-nord',
    theme: 'Culture & Patrimoine',
    badge: 'Populaire',
    price: 1390,
    priceUnit: '€ / pers',
    rating: 4.9,
    reviewCount: 52,
    featured: false,
    published: true,
    image: '/images/dest-rajasthan.jpg',
    gallery: [
      '/images/dest-rajasthan.jpg',
      '/images/dest-tajmahal.jpg',
      '/images/dest-varanasi.jpg',
      '/images/dest-jodhpur.jpg'
    ],
    overview: 'Ce circuit phare réunit la quintessence de l’Inde du Nord. Explorez la magnificence des palais rajasthanis, la pureté éternelle du Taj Mahal à Agra, et l’intensité mystique des cérémonies sacrées sur les rives du Gange à Varanasi avec un chauffeur privé dédié.',
    highlights: [
      'Visite du Taj Mahal à l’aube et du Fort Rouge d’Agra',
      'Exploration de la cité rose de Jaïpur et du Palais des Vents',
      'Forteresse grandiose de Mehrangarh et maisons bleues de Jodhpur',
      'Croisière romantique sur le lac Pichola à Udaipur',
      'Cérémonie Aarti et balade en barque à l’aube sur le Gange à Bénarès',
      'Chauffeur privé climatisé et hébergements de charme inclus'
    ],
    itinerary: [
      { day: 1, title: 'Arrivée à Delhi', description: 'Accueil chaleureux par votre chauffeur et transfert hôtel.', meals: 'Dîner libre', accommodation: 'Hôtel 4* à Delhi' },
      { day: 2, title: 'Delhi – Mandawa (Shekhawati)', description: 'Route vers le Shekhawati et ses magnifiques havelis peints.', meals: 'Petit-déjeuner', accommodation: 'Haveli de charme' },
      { day: 3, title: 'Mandawa – Bikaner', description: 'Visite du Fort de Junagarh et élevage de chameaux.', meals: 'Petit-déjeuner', accommodation: 'Hôtel à Bikaner' },
      { day: 4, title: 'Bikaner – Jaisalmer la Cité Dorée', description: 'Arrivée dans la forteresse sculptée de grès jaune.', meals: 'Petit-déjeuner', accommodation: 'Hôtel de charme' },
      { day: 5, title: 'Jaisalmer – Dunes du Désert du Thar', description: 'Temples jaïns et bivouac magique dans les dunes.', meals: 'Petit-déjeuner et dîner', accommodation: 'Camp de tentes de luxe' },
      { day: 6, title: 'Jaisalmer – Jodhpur la Cité Bleue', description: 'Visite des ruelles bleues et de la tour de l\'horloge.', meals: 'Petit-déjeuner', accommodation: 'Hôtel vue forteresse' },
      { day: 7, title: 'Jodhpur – Forteresse de Mehrangarh', description: 'L\'une des plus spectaculaires forteresses d\'Inde.', meals: 'Petit-déjeuner', accommodation: 'Hôtel à Jodhpur' },
      { day: 8, title: 'Jodhpur – Ranakpur – Udaipur', description: 'Temple jaïn aux 1444 colonnes de marbre blanc.', meals: 'Petit-déjeuner', accommodation: 'Haveli au bord du lac' },
      { day: 9, title: 'Udaipur – Venise de l\'Orient', description: 'City Palace et croisière sur le lac Pichola.', meals: 'Petit-déjeuner', accommodation: 'Haveli à Udaipur' },
      { day: 10, title: 'Udaipur – Pushkar', description: 'Lac sacré et unique temple au monde dédié à Brahma.', meals: 'Petit-déjeuner', accommodation: 'Hôtel de charme' },
      { day: 11, title: 'Pushkar – Jaïpur la Cité Rose', description: 'Arrivée dans la capitale royale du Rajasthan.', meals: 'Petit-déjeuner', accommodation: 'Haveli à Jaïpur' },
      { day: 12, title: 'Jaïpur – Fort d\'Amber & Hawa Mahal', description: 'Fort d\'Amber, Palais des Vents et City Palace.', meals: 'Petit-déjeuner', accommodation: 'Haveli à Jaïpur' },
      { day: 13, title: 'Jaïpur – Fatehpur Sikri – Agra', description: 'La cité fantôme d\'Akbar et arrivée à Agra.', meals: 'Petit-déjeuner', accommodation: 'Hôtel 4* à Agra' },
      { day: 14, title: 'Agra – Taj Mahal au lever du soleil', description: 'Merveille du monde à l\'aube et Fort Rouge.', meals: 'Petit-déjeuner', accommodation: 'Hôtel 4* à Agra' },
      { day: 15, title: 'Agra – Train ou vol vers Varanasi', description: 'Arrivée dans la cité sainte et premier Aarti.', meals: 'Petit-déjeuner', accommodation: 'Hôtel de charme' },
      { day: 16, title: 'Varanasi – Rituels sacrés sur le Gange', description: 'Barque à l\'aube, Sarnath et cérémonies.', meals: 'Petit-déjeuner', accommodation: 'Hôtel à Varanasi' },
      { day: 17, title: 'Varanasi – Delhi – Vol retour', description: 'Vol intérieur vers Delhi et vol de retour.', meals: 'Petit-déjeuner', accommodation: 'Fin du séjour' }
    ],
    inclusions: ['Véhicule privé avec chauffeur', '16 nuits d\'hôtels de charme', 'Barque sur le Gange et bateau à Udaipur', 'Assistance 24/7'],
    exclusions: ['Vols internationaux', 'Visas']
  },
  {
    title: 'Séjour en Inde : Les Havélis et Palais du Rajasthan',
    slug: 'sejour-en-inde-havelis-et-palais-du-rajasthan',
    subtitle: 'L\'essentiel de la terre des Maharajas et des forteresses médiévales avec chauffeur privé',
    duration: '13 Jours / 12 Nuits',
    daysCount: 13,
    location: 'Delhi, Shekhawati (Mandawa), Bikaner, Jaisalmer, Jodhpur, Ranakpur, Udaipur, Jaipur, Agra',
    region: 'inde-du-nord',
    theme: 'Culture & Patrimoine',
    badge: 'Classique',
    price: 1190,
    priceUnit: '€ / pers',
    rating: 4.9,
    reviewCount: 39,
    featured: false,
    published: true,
    image: '/images/dest-rajasthan.jpg',
    gallery: ['/images/dest-rajasthan.jpg', '/images/dest-tajmahal.jpg'],
    overview: 'Le voyage idéal pour découvrir tous les trésors emblématiques du Rajasthan : havelis peints, citadelles désertiques, palais sur l\'eau et le Taj Mahal.',
    highlights: [
      'Fresques murales des havelis du Shekhawati',
      'Forteresse dorée de Jaisalmer émergeant des sables',
      'Forteresse de Mehrangarh à Jodhpur',
      'Lac Pichola d\'Udaipur et Taj Mahal d\'Agra'
    ],
    itinerary: [],
    inclusions: ['Chauffeur privé climatisé', '12 nuits d\'hôtels de charme', 'Petits-déjeuners'],
    exclusions: ['Vols internationaux']
  },
  {
    title: 'Voyage spirituel en Inde : Delhi, Amritsar, Dharamsala et Rishikesh',
    slug: 'voyage-spirituel-en-inde',
    subtitle: 'Temple d’Or Sikh, Himalaya tibétain et ashrams sacrés au bord du Gange',
    duration: '12 Jours / 11 Nuits',
    daysCount: 12,
    location: 'Delhi, Amritsar, Dharamsala (McLeod Ganj), Rishikesh, Haridwar',
    region: 'inde-du-nord',
    theme: 'Spiritualité & Yoga',
    badge: 'Spirituel',
    price: 1150,
    priceUnit: '€ / pers',
    rating: 4.9,
    reviewCount: 38,
    featured: false,
    published: true,
    image: '/images/dest-himachal.jpg',
    gallery: ['/images/dest-himachal.jpg', '/images/dest-varanasi.jpg'],
    overview: 'Une immersion dans les plus hauts lieux de ferveur et de paix spirituelle de l’Inde du Nord.',
    highlights: ['Temple d’Or d’Amritsar', 'Dharamsala et monastères tibétains', 'Rishikesh et yoga au bord du Gange'],
    itinerary: [],
    inclusions: ['Véhicule privé avec chauffeur', '11 nuits en hôtels de charme', 'Séance de yoga à Rishikesh'],
    exclusions: ['Vols internationaux']
  },
  {
    title: 'Circuit Punjab & Himachal Pradesh : Du Temple d\'Or aux Cimes Himalayennes',
    slug: 'circuit-punjab-et-himachal-pradesh',
    subtitle: 'Ferveur sikhe à Amritsar, résidence du Dalaï-Lama et air pur des contreforts himalayens',
    duration: '14 Jours / 13 Nuits',
    daysCount: 14,
    location: 'Delhi, Amritsar, Dharamsala, Manali, Shimla, Rishikesh',
    region: 'inde-du-nord',
    theme: 'Culture & Nature',
    badge: 'Découverte',
    price: 1250,
    priceUnit: '€ / pers',
    rating: 4.8,
    reviewCount: 26,
    featured: false,
    published: true,
    image: '/images/dest-jodhpur.jpg',
    gallery: ['/images/dest-jodhpur.jpg', '/images/dest-himachal.jpg'],
    overview: 'Un circuit équilibré entre la richesse spirituelle du Punjab et la splendeur naturelle des montagnes de l\'Himachal Pradesh.',
    highlights: ['Temple d\'Or d\'Amritsar', 'McLeod Ganj', 'Vallée de Manali', 'Station coloniale de Shimla'],
    itinerary: [],
    inclusions: ['Chauffeur privé', '13 nuits d\'hôtels', 'Petits-déjeuners'],
    exclusions: ['Vols']
  },
  {
    title: 'Grand Tour Inde du Nord, Darjeeling et Sikkim',
    slug: 'grand-tour-inde-du-nord-darjeeling-sikkim',
    subtitle: 'Des palais du Rajasthan aux plantations de thé face au mont Kanchenjunga',
    duration: '23 Jours / 22 Nuits',
    daysCount: 23,
    location: 'Delhi, Jaipur, Agra, Varanasi, Darjeeling, Pelling, Gangtok, Kalimpong, Kolkata',
    region: 'inde-du-nord',
    theme: 'Grand Voyage',
    badge: 'Complet',
    price: 1890,
    priceUnit: '€ / pers',
    rating: 5.0,
    reviewCount: 34,
    featured: false,
    published: true,
    image: '/images/slide8-300x176.jpg',
    gallery: ['/images/slide8-300x176.jpg', '/images/dest-varanasi.jpg'],
    overview: 'La traversée intégrale du nord de l\'Inde, des cités princières et du Taj Mahal jusqu\'aux collines de thé de Darjeeling et aux monastères bouddhistes du Sikkim.',
    highlights: ['Rajasthan et Taj Mahal', 'Varanasi et le Gange sacré', 'Lever de soleil sur le Kanchenjunga', 'Toy Train de Darjeeling classé UNESCO'],
    itinerary: [],
    inclusions: ['Chauffeur privé', 'Vols intérieurs', '22 nuits en hôtels de charme'],
    exclusions: ['Vols internationaux']
  },
  {
    title: 'Voyage Découverte Rajasthan & Agra',
    slug: 'voyage-rajasthan-et-agra-11-jours',
    subtitle: 'Le concentré royal idéal avec chauffeur privé pour un premier voyage en Inde',
    duration: '11 Jours / 10 Nuits',
    daysCount: 11,
    location: 'Delhi, Agra, Jaipur, Pushkar, Jodhpur, Delhi',
    region: 'inde-du-nord',
    theme: 'Culture & Découverte',
    badge: 'Essentiel',
    price: 990,
    priceUnit: '€ / pers',
    rating: 4.9,
    reviewCount: 42,
    featured: false,
    published: true,
    image: '/images/jaipur-travel.jpg',
    gallery: ['/images/jaipur-travel.jpg', '/images/dest-tajmahal.jpg'],
    overview: 'Un itinéraire condensé et parfait pour explorer les merveilles absolues du Triangle d\'Or et du Rajasthan en toute tranquillité.',
    highlights: ['Taj Mahal d\'Agra', 'Cité Rose de Jaipur et Fort d\'Amber', 'Lac sacré de Pushkar', 'Forteresse de Mehrangarh à Jodhpur'],
    itinerary: [],
    inclusions: ['Chauffeur privé climatisé', '10 nuits d\'hôtels de charme', 'Assistance francophone'],
    exclusions: ['Vols internationaux']
  },
  {
    title: 'Voyage au Rajasthan Hors des Sentiers Battus',
    slug: 'voyage-rajasthan-hors-des-sentiers-battus',
    subtitle: 'Villages préservés, nuits chez l’habitant, forteresses secrètes et bivouac dans le désert',
    duration: '15 Jours / 14 Nuits',
    daysCount: 15,
    location: 'Shekhawati, Bikaner, Jaisalmer, Chhatrasagar, Narlai, Udaipur',
    region: 'inde-du-nord',
    theme: 'Authentique & Aventure',
    badge: 'Authentique',
    price: 1380,
    priceUnit: '€ / pers',
    rating: 5.0,
    reviewCount: 44,
    featured: false,
    published: true,
    image: '/images/Voyage-Jaisalmer.jpg',
    gallery: ['/images/Voyage-Jaisalmer.jpg', '/images/image-12.jpg'],
    overview: 'Échappez aux circuits touristiques conventionnels pour vivre un Rajasthan intimiste et chaleureux.',
    highlights: ['Havelis secrets du Shekhawati', 'Nuit en camp de charme dans le désert', 'Rencontre avec la communauté écologiste Bishnoi'],
    itinerary: [],
    inclusions: ['Chauffeur privé francophone', 'Hébergements de caractère', 'Excursion Bishnoi'],
    exclusions: ['Vols internationaux']
  },
  {
    title: 'Voyage Nord de l’Inde et Nepal',
    slug: 'voyage-nord-de-linde-et-nepal',
    subtitle: 'Circuit atypique du nord central et est de l’Inde jusqu’à la vallée sacrée de Katmandou au Népal',
    duration: '23 Jours / 22 Nuits',
    daysCount: 23,
    location: 'Delhi, Gwalior, Orchha, Khajuraho, Chitrakoot, Allahabad, Varanasi, Bodhgaya, Patna, Kolkata, Katmandou, Pokhara',
    region: 'inde-du-nord',
    theme: 'Spiritualité & Patrimoine',
    badge: 'Inde & Népal',
    price: 1850,
    priceUnit: '€ / pers',
    rating: 4.9,
    reviewCount: 36,
    featured: false,
    published: true,
    image: '/images/dest-varanasi.jpg',
    gallery: ['/images/dest-varanasi.jpg', '/images/dest-nepal.jpg'],
    overview: 'Circuit atypique se concentrant sur le Nord central et est de l’Inde avant d’atterrir au Népal. Au programme : grandes attractions culturelles de Varanasi, temples d\'Orchha, Bodhgaya et les cités royales de Katmandou.',
    highlights: [
      'Temples érotiques de Khajuraho et palais d\'Orchha',
      'Cérémonies sacrées sur le Gange à Varanasi',
      'Site saint de Bodhgaya sous l\'arbre de la Bodhi',
      'Cités royales de Katmandou, Patan et Pokhara au Népal'
    ],
    itinerary: [],
    inclusions: ['Chauffeur privé climatisé', '22 nuits en hôtels de charme', 'Visites guidées et vols intérieurs'],
    exclusions: ['Vols internationaux', 'Visas']
  },
  {
    title: 'Voyage au Rajasthan, Agra, Khajuraho et la rivière du Gange',
    slug: 'voyage-au-rajasthan-agra-khajuraho-et-la-riviere-du-gange',
    subtitle: 'Cités royales rajasthanies, Taj Mahal d\'Agra, temples d\'Khajuraho et Ghats de Varanasi',
    duration: '22 Jours / 21 Nuits',
    daysCount: 22,
    location: 'Delhi, Nawalgarh, Bikaner, Jaisalmer, Osian, Jodhpur, Ranakpur, Kumbhalgarh, Udaipur, Pushkar, Jaipur, Ranthambore, Agra, Gwalior, Orchha, Khajuraho, Varanasi',
    region: 'inde-du-nord',
    theme: 'Grand Tour Inde du Nord',
    badge: 'Grand Tour',
    price: 1790,
    priceUnit: '€ / pers',
    rating: 5.0,
    reviewCount: 48,
    featured: false,
    published: true,
    image: '/images/dest-tajmahal.jpg',
    gallery: ['/images/dest-tajmahal.jpg', '/images/dest-rajasthan.jpg'],
    overview: 'Ce circuit regroupe les palais, les forts et les temples du Rajasthan avec les jungles de Ranthambore, les rivières et l’architecture spirituelle de la vallée du Gange.',
    highlights: [
      'Grand tour intégral des palais et forteresses du Rajasthan',
      'Safari tigres dans le parc national de Ranthambore',
      'Le Taj Mahal au lever du soleil',
      'Temples de Khajuraho et cérémonies Aarti à Varanasi'
    ],
    itinerary: [],
    inclusions: ['Chauffeur privé climatisé', '21 nuits en hôtels de patrimoine', 'Safari Ranthambore & barque sur le Gange'],
    exclusions: ['Vols internationaux']
  },
  {
    title: 'Circuit de Rajasthan et Tigre',
    slug: 'circuit-de-rajasthan-et-tigre',
    subtitle: 'Palais royaux du Rajasthan, Taj Mahal d\'Agra et safaris sauvages à Bandhavgarh & Ranthambore',
    duration: '14 Jours / 13 Nuits',
    daysCount: 14,
    location: 'Delhi, Umaria, Bandhavgarh, Agra, Bharatpur, Ranthambore, Delhi',
    region: 'inde-du-nord',
    theme: 'Safari & Patrimoine',
    badge: 'Safari Tigre',
    price: 1420,
    priceUnit: '€ / pers',
    rating: 4.9,
    reviewCount: 31,
    featured: false,
    published: true,
    image: '/images/image-9.jpg',
    gallery: ['/images/image-9.jpg', '/images/dest-tajmahal.jpg'],
    overview: 'Combinez les plus beaux sanctuaires de faune sauvage d\'Inde avec la visite du Taj Mahal. Safaris en jeep pour observer les tigres du Bengale à Bandhavgarh et Ranthambore.',
    highlights: [
      { icon: 'fa-cat', title: 'Safaris Tigres du Bengale', desc: 'Safaris en jeep dans les parcs de Bandhavgarh et Ranthambore.' },
      { icon: 'fa-monument', title: 'Taj Mahal & Fort d\'Agra', desc: 'Visite guidée des monuments impériaux moghouls.' },
      { icon: 'fa-feather', title: 'Réserve d\'Oiseaux de Bharatpur', desc: 'Observation des oiseaux migrateurs rares à Keoladeo.' }
    ],
    itinerary: [],
    inclusions: ['Chauffeur privé', 'Safaris en jeep inclus avec naturalist', '13 nuits en hôtels et lodges'],
    exclusions: ['Vols internationaux']
  },
  {
    title: 'Circuit Moto Royal Enfield en Himalaya & Ladakh',
    slug: 'circuit-moto-royal-enfield-ladakh',
    subtitle: 'La grande traversée mythique des plus hauts cols du monde au guidon d’une moto de légende',
    duration: '10 Jours / 9 Nuits',
    daysCount: 10,
    location: 'Leh, Vallée de la Nubra, Lac Pangong, Col de Khardung La',
    region: 'ladakh',
    theme: 'Aventure & Moto',
    badge: 'Aventure',
    price: 1590,
    priceUnit: '€ / pers',
    rating: 5.0,
    reviewCount: 19,
    featured: false,
    published: true,
    image: '/images/dest-ladakh.jpg',
    gallery: ['/images/dest-ladakh.jpg'],
    overview: 'Pour les passionnés de deux-roues et de paysages grandioses. Parcourez les routes mythiques de l’Himalaya et franchissez le Khardung La, plus haut col carrossable au monde.',
    highlights: [
      'Moto Royal Enfield 500cc fournie avec assistance mécanique',
      'Véhicule d’assistance avec pièces détachées',
      'Nuit au bord du lac Pangong sous tente tout confort',
      'Monastères tibétains et paysages lunaires spectaculaires'
    ],
    itinerary: [],
    inclusions: ['Location moto Royal Enfield', 'Véhicule d’assistance et mécanicien', 'Carburant et hébergements'],
    exclusions: ['Vols internationaux et vers Leh']
  },
  {
    title: 'Grand Tour du Gujarat et Faune Sauvage',
    slug: 'grand-tour-du-gujarat',
    subtitle: 'Désert de sel blanc de Kutch, sanctuaire des lions de Gir et temples sacrés de Palitana',
    duration: '13 Jours / 12 Nuits',
    daysCount: 13,
    location: 'Ahmedabad, Dasada, Bhuj, Parc de Gir, Palitana, Diu',
    region: 'gujarat',
    theme: 'Culture & Safari',
    badge: 'Faune & Désert',
    price: 1350,
    priceUnit: '€ / pers',
    rating: 4.8,
    reviewCount: 22,
    featured: false,
    published: true,
    image: '/images/dest-gujarat.jpg',
    gallery: ['/images/dest-gujarat.jpg'],
    overview: 'Une aventure hors du commun dans l’un des États les plus authentiques de l’Inde, entre artisanat textile nomade, immensités salines et safaris sauvages.',
    highlights: [
      'Safari en jeep dans le sanctuaire des ânes sauvages du Little Rann',
      'Villages artisanaux et broderies traditionnelles du Kutch',
      'Observation des derniers lions d’Asie dans le Parc National de Gir',
      'Ascension aux 863 temples de marbre de Palitana'
    ],
    itinerary: [],
    inclusions: ['Véhicule privé', 'Safaris en jeep inclus avec rangers', 'Hébergement 12 nuits'],
    exclusions: ['Vols internationaux', 'Repas libres']
  },
  {
    title: 'Circuit Kerala : Lagunes d’Émeraude & Terres des Épices',
    slug: 'circuit-kerala-lagunes-et-epices',
    subtitle: 'Houseboat privé sur les Backwaters, collines de thé de Munnar et massages Ayurvédiques',
    duration: '11 Jours / 10 Nuits',
    daysCount: 11,
    location: 'Cochin, Munnar, Thekkady (Periyar), Alleppey, Marari Beach',
    region: 'inde-du-sud',
    theme: 'Nature & Détente',
    badge: 'Détente',
    price: 1090,
    priceUnit: '€ / pers',
    rating: 4.9,
    reviewCount: 31,
    featured: false,
    published: true,
    image: '/images/dest-kerala.jpg',
    gallery: ['/images/dest-kerala.jpg'],
    overview: 'L’Inde du Sud dans toute sa douceur et sa verdure. Naviguez sur les canaux paisibles à bord d’un bateau traditionnel, respirez l’air frais des collines de thé et détendez-vous sur les plages de sable blanc.',
    highlights: [
      'Filets de pêche chinois et quartier colonial de Cochin',
      'Nuit et repas gastronomique kéralais à bord d’un Houseboat privé',
      'Plantations de cardamome et safari au Parc de Periyar',
      'Séjour balnéaire et soins ayurvédiques sur la plage de Marari'
    ],
    itinerary: [],
    inclusions: ['Véhicule privé', 'Nuit en Houseboat privé en pension complète', 'Hôtels de charme'],
    exclusions: ['Vols internationaux']
  },
  {
    title: 'Grand Tour du Tamil Nadu et Kerala : Temples Dravidiens & Backwaters',
    slug: 'grand-tour-tamil-nadu-kerala',
    subtitle: 'Pondichéry, temples colossaux de Madurai et Tanjore, et croisière sur les Backwaters',
    duration: '17 Jours / 16 Nuits',
    daysCount: 17,
    location: 'Chennai, Mahabalipuram, Pondichéry, Tanjore, Madurai, Periyar, Munnar, Alleppey, Cochin',
    region: 'inde-du-sud',
    theme: 'Culture & Nature',
    badge: 'Grand Tour',
    price: 1480,
    priceUnit: '€ / pers',
    rating: 4.9,
    reviewCount: 27,
    featured: false,
    published: true,
    image: '/images/dest-karnataka.jpg',
    gallery: ['/images/dest-karnataka.jpg', '/images/dest-kerala.jpg'],
    overview: 'L’Inde du Sud intégrale : des chefs-d’œuvre sculptés de Mahabalipuram aux gopurams géants de Madurai, jusqu’aux plantations de thé et lagunes du Kerala.',
    highlights: ['Temples UNESCO de Mahabalipuram et Tanjore', 'Ambiance coloniale de Pondichéry', 'Houseboat sur les Backwaters'],
    itinerary: [],
    inclusions: ['Chauffeur privé', '16 nuits d\'hôtels de charme', 'Croisière Houseboat'],
    exclusions: ['Vols internationaux']
  },
  {
    title: 'Grand Voyage au Népal – Cités Royales & Annapurnas',
    slug: 'grand-voyage-au-nepal-cites-royales-et-annapurnas',
    subtitle: 'Stupas sacrés de Katmandou, safari dans la jungle de Chitwan et lacs de Pokhara',
    duration: '14 Jours / 13 Nuits',
    daysCount: 14,
    location: 'Katmandou, Patan, Bhaktapur, Parc National de Chitwan, Pokhara, Bandipur',
    region: 'nepal',
    theme: 'Himalaya & Safari',
    badge: 'Népal',
    price: 1290,
    priceUnit: '€ / pers',
    rating: 4.9,
    reviewCount: 24,
    featured: false,
    published: true,
    image: '/images/dest-nepal.jpg',
    gallery: ['/images/dest-nepal.jpg'],
    overview: 'Entre spiritualité hindoue et bouddhiste au cœur de la vallée de Katmandou, safaris rhinocéros à Chitwan et panoramas grandioses sur les Annapurnas.',
    highlights: ['Stupas sacrés de Swayambhunath et Boudhanath', 'Safari rhinocéros à Chitwan', 'Lever de soleil sur les Annapurnas à Sarangkot'],
    itinerary: [],
    inclusions: ['Véhicule privé avec chauffeur', 'Hôtels de charme', 'Safaris à Chitwan inclus'],
    exclusions: ['Vols internationaux', 'Visa Népal']
  },
  {
    title: 'Circuit Bhoutan – Le Royaume du Dragon : Thimphu, Paro & Punakha',
    slug: 'circuit-bhoutan-thimphu-paro-punakha',
    subtitle: 'Forteresses sacrées Dzongs de Punakha, capitale paisible de Thimphu et Nid du Tigre à Paro',
    duration: '10 Jours / 9 Nuits',
    daysCount: 10,
    location: 'Thimphu, Paro, Punakha, Col de Dochula, Phobjikha, Bhoutan',
    region: 'bhoutan',
    theme: 'Spiritualité & Himalaya',
    badge: 'Bhoutan Exclusif',
    price: 1890,
    priceUnit: '€ / pers',
    rating: 5.0,
    reviewCount: 19,
    featured: false,
    published: true,
    image: '/images/jaipur-travel.jpg',
    gallery: ['/images/jaipur-travel.jpg', '/images/dest-himachal.jpg'],
    overview: 'Explorez le mythique royaume du Bhoutan, terre du Bonheur National Brut. Visitez la majestueuse forteresse de Punakha Dzong au confluent des deux rivières sacrées, traversez le spectaculaire col de Dochula (3 100 m) et gravissez les marches vers le légendaire monastère du Nid du Tigre (Paro Taktshang).',
    highlights: [
      'Visite de la somptueuse forteresse de Punakha Dzong (Pungtang Dechen Photrang)',
      'Ascension inoubliable vers le monastère perché du Nid du Tigre (Taktshang) à Paro',
      'Vue panoramique sur les sommets himalayens enneigés depuis le Col de Dochula',
      'Découverte de Thimphu, ses marchés d\'artisanat et la statue géante de Bouddha Dordenma',
      'Guide francophone et chauffeur privé bhoutanais dédié'
    ],
    itinerary: [
      { day: 1, title: 'Arrivée à Paro – Transfert à Thimphu', description: 'Vol spectaculaire vers Paro avec vue sur l\'Everest. Accueil et route vers Thimphu (2 320 m).', meals: 'Dîner inclus', accommodation: 'Hôtel 4* à Thimphu' },
      { day: 2, title: 'Thimphu – Cité et Traditions', description: 'Visite du Memorial Chorten, de l\'Institut des Arts Zorig Chusum et du Tashichho Dzong.', meals: 'Pension complète', accommodation: 'Hôtel 4* à Thimphu' },
      { day: 3, title: 'Thimphu – Col de Dochula – Vallée de Punakha', description: 'Passage du col de Dochula aux 108 chortens avec vue à 360° sur l\'Himalaya. Descente vers la douce vallée subtropicale de Punakha (1 300 m).', meals: 'Pension complète', accommodation: 'Hôtel de charme à Punakha' },
      { day: 4, title: 'Punakha – Forteresse de Punakha Dzong & Chimi Lhakhang', description: 'Visite de l\'impressionnant Punakha Dzong, chef-d\'œuvre d\'architecture bhoutanaise au bord de la rivière Mo Chhu. Balade champêtre vers le temple de Chimi Lhakhang.', meals: 'Pension complète', accommodation: 'Hôtel de charme à Punakha' },
      { day: 5, title: 'Punakha – Vallée glaciaire de Phobjikha (Gangtey)', description: 'Excursion dans la vallée protégée de Phobjikha et visite du monastère de Gangtey.', meals: 'Pension complète', accommodation: 'Lodge de charme à Gangtey' },
      { day: 6, title: 'Punakha / Gangtey – Paro', description: 'Route retour panoramique vers la pittoresque vallée de Paro. Visite du musée national Ta Dzong.', meals: 'Pension complète', accommodation: 'Hôtel de charme à Paro' },
      { day: 7, title: 'Paro – Ascension du Nid du Tigre (Taktshang)', description: 'Randonnée mythique vers le monastère de Taktshang agrippé à une falaise rocheuse de 900 m.', meals: 'Pension complète', accommodation: 'Hôtel de charme à Paro' },
      { day: 8, title: 'Paro – Vallée de Haa & Col de Chele La', description: 'Excursion au plus haut col carrossable du Bhoutan (Chele La à 3 988 m) vers la vallée préservée de Haa.', meals: 'Pension complète', accommodation: 'Hôtel à Paro' },
      { day: 9, title: 'Paro – Découverte rurale & Détente aux pierres chaudes', description: 'Visite de fermes traditionnelles, découverte de l\'artisanat local et bain revigorant aux pierres chaudes (Hot Stone Bath).', meals: 'Pension complète', accommodation: 'Hôtel à Paro' },
      { day: 10, title: 'Paro – Vol international retour', description: 'Transfert à l\'aéroport international de Paro pour votre vol de retour.', meals: 'Petit-déjeuner', accommodation: 'Fin du séjour' }
    ],
    inclusions: [
      'Visa officiel et taxe de développement durable (SDF) du Bhoutan inclus',
      'Pension complète durant tout le séjour au Bhoutan',
      'Guide francophone diplômé et chauffeur privé',
      'Tous les frais d\'entrée aux Dzongs, monastères et parcs',
      'Véhicule 4x4 tout confort'
    ],
    exclusions: ['Vols internationaux vers Paro', 'Assurance voyage']
  },
  {
    title: 'Grand Tour Bhoutan & Népal Combiné – De Katmandou à Punakha',
    slug: 'grand-tour-bhoutan-nepal-combine',
    subtitle: 'Le combiné himalayen d\'exception : Cités Royales du Népal et Monastères Sacrés du Bhoutan',
    duration: '15 Jours / 14 Nuits',
    daysCount: 15,
    location: 'Katmandou, Bhaktapur, Pokhara, Thimphu, Punakha, Paro, Népal, Bhoutan',
    region: 'bhoutan',
    theme: 'Himalaya & Cités Royales',
    badge: 'Combiné Mythique',
    price: 2490,
    priceUnit: '€ / pers',
    rating: 5.0,
    reviewCount: 14,
    featured: true,
    published: true,
    image: '/images/dest-nepal.jpg',
    gallery: ['/images/dest-nepal.jpg', '/images/jaipur-travel.jpg'],
    overview: 'Un grand voyage reliant les deux royaumes sacrés de l\'Himalaya : les trésors de la vallée de Katmandou et Pokhara au Népal, puis les forteresses Dzongs de Punakha, Thimphu et le Nid du Tigre au Bhoutan.',
    highlights: ['Punakha Dzong et Nid du Tigre au Bhoutan', 'Stupas sacrés et cités impériales de Katmandou', 'Vue sur la chaîne des Annapurnas'],
    itinerary: [],
    inclusions: ['Tous transferts privés', 'Hôtels 4*', 'Visas et taxes inclus'],
    exclusions: ['Vols internationaux']
  }
];

export const reviewsData = [
  {
    authorName: 'Jean-Pierre & Martine Dubois',
    authorCity: 'Lyon, France',
    tourTitle: 'Voyage au Rajasthan 14 Jours',
    category: 'rajasthan',
    rating: 5,
    travelDate: 'Février 2026',
    comment: 'Un voyage extraordinaire et sans la moindre fausse note ! Notre chauffeur Singh a été d’une gentillesse, d’une prudence et d’une ponctualité exemplaires. Les havelis et hôtels choisis avaient tous un charme fou. Bravo à l’équipe de Jodhpur Voyage pour l’organisation parfaite et le suivi WhatsApp quotidien.',
    featured: true,
    status: 'approved'
  },
  {
    authorName: 'Sophie & Marc Laurent',
    authorCity: 'Paris, France',
    tourTitle: 'Rajasthan & Bénarès',
    category: 'rajasthan',
    rating: 5,
    travelDate: 'Janvier 2026',
    comment: 'C’était notre premier voyage en Inde et nous avions quelques appréhensions. Grâce à Jodhpur Voyage, nous avons voyagé en toute sérénité ! Varanasi à l’aube et le Taj Mahal restent gravés à jamais dans nos cœurs. Merci encore pour vos précieux conseils.',
    featured: true,
    status: 'approved'
  },
  {
    authorName: 'Claire & Michel V.',
    authorCity: 'Genève, Suisse',
    tourTitle: 'Sur Mesure - Rajasthan et Désert de Jaisalmer',
    category: 'rajasthan',
    rating: 5,
    travelDate: 'Novembre 2025',
    comment: 'L’agence a su construire un itinéraire sur mesure qui collait exactement à nos envies d’authenticité. La nuit dans le désert du Thar et la rencontre avec la communauté Bishnoi étaient magiques. Nous recommandons Jodhpur Voyage les yeux fermés !',
    featured: true,
    status: 'approved'
  },
  {
    authorName: 'Patrick Moreau',
    authorCity: 'Bruxelles, Belgique',
    tourTitle: 'Circuit Spirituel : Amritsar & Rishikesh',
    category: 'inde-du-nord',
    rating: 5,
    travelDate: 'Décembre 2025',
    comment: 'Un grand merci à toute l’équipe francophone pour l’accueil chaleureux. Le Temple d’Or d’Amritsar et les bords du Gange à Rishikesh sont d’une intensité rare. Organisation fluide et chauffeur très professionnel.',
    featured: true,
    status: 'approved'
  },
  {
    authorName: 'Nathalie & Bernard Petit',
    authorCity: 'Bordeaux, France',
    tourTitle: 'Circuit Kerala & Backwaters',
    category: 'inde-du-sud',
    rating: 5,
    travelDate: 'Janvier 2026',
    comment: 'Douceur de vivre absolue dans le Kerala. Le séjour sur le Houseboat était féérique, avec un cuisinier privé qui nous a régalés de spécialités locales. Tout était très bien orchestré.',
    featured: false,
    status: 'approved'
  },
  {
    authorName: 'François & Valérie Leroy',
    authorCity: 'Toulouse, France',
    tourTitle: 'Rajasthan Hors des Sentiers Battus',
    category: 'rajasthan',
    rating: 5,
    travelDate: 'Février 2026',
    comment: '15 jours inoubliables loin de la foule. Des havelis du Shekhawati aux forteresses méconnues, chaque journée réservait une merveille. Chauffeur formidable, très attentionné et discret.',
    featured: false,
    status: 'approved'
  },
  {
    authorName: 'Éric & Sylvie Dumas',
    authorCity: 'Marseille, France',
    tourTitle: 'Circuit Grand Tour du Gujarat',
    category: 'gujarat',
    rating: 5,
    travelDate: 'Novembre 2025',
    comment: 'Le Gujarat est une destination fabuleuse et encore très préservée. Nous avons pu voir les lions dans le parc de Gir et gravir les marches de Palitana. Merci à notre conseiller pour ce beau programme.',
    featured: false,
    status: 'approved'
  },
  {
    authorName: 'Isabelle Garnier',
    authorCity: 'Nantes, France',
    tourTitle: 'Voyage Spirituel en Inde du Nord',
    category: 'inde-du-nord',
    rating: 5,
    travelDate: 'Octobre 2025',
    comment: 'Une expérience de vie bouleversante et magnifique. Tout s’est déroulé à la perfection du premier au dernier jour. Je repartirai sans hésiter avec Jodhpur Voyage.',
    featured: false,
    status: 'approved'
  }
];

export const blogPostsData = [
  {
    title: 'Quand partir au Rajasthan et en Inde du Nord ? Guide complet des saisons',
    slug: 'quand-partir-au-rajasthan-guide-saisons',
    excerpt: 'Climat, températures, festivals et meilleure période pour explorer les palais des maharajas sans souffrir de la chaleur.',
    coverImage: '/images/dest-rajasthan.jpg',
    category: 'Conseils Voyage',
    readTime: '6 min de lecture',
    tags: ['Rajasthan', 'Météo', 'Climat', 'Conseils'],
    content: `
# Quand partir au Rajasthan ? Notre guide saisonnier détaillé

Le Rajasthan possède un climat semi-aride avec de grandes variations thermiques selon les saisons. Pour profiter au maximum de votre voyage, il est primordial de choisir la période idéale.

## 1. La Haute Saison : D’Octobre à Mars (La période idéale)
C'est incontestablement **la meilleure saison** pour voyager au Rajasthan et en Inde du Nord. 
- **Températures :** Les journées sont ensoleillées et agréables (20°C à 28°C), idéales pour visiter les forteresses et marcher dans les bazars.
- **Nuits fraîches :** Dans le désert (Jaisalmer, Bikaner), les nuits peuvent être fraîches (8°C à 12°C), prévoyez une petite laine !
- **Festivals :** Vous pourrez assister à Diwali (fête des lumières en octobre/novembre), à la Foire aux chameaux de Pushkar (novembre) ou au festival du désert de Jaisalmer (janvier/février).

## 2. La Période Chaude : D’Avril à Juin
Les températures montent fortement (35°C à 44°C). C'est toutefois une bonne période pour :
- Les safaris dans les parcs nationaux (Ranthambore, Gir) car les animaux se rassemblent autour des points d'eau.
- Bénéficier de tarifs hôteliers très avantageux.

## 3. La Mousson : De Juillet à Septembre
La mousson apporte des averses régulières qui rafraîchissent l'atmosphère et redonnent aux collines des Aravalli une couleur vert émeraude spectaculaire, notamment autour d'Udaipur.

## Nos conseils d'experts
Pour une première découverte de l'Inde, privilégiez les mois de **novembre, janvier et février**. Notre équipe basée à Jodhpur se tient à votre disposition pour planifier vos dates !
    `
  },
  {
    title: 'Formalités, Visa et Santé : Tout ce qu’il faut savoir avant de partir en Inde',
    slug: 'formalites-visa-sante-inde-guide-pratique',
    excerpt: 'e-Visa indien, vaccins recommandés, monnaie, change et astuces pour un séjour 100% serein.',
    coverImage: '/images/dest-tajmahal.jpg',
    category: 'Infos Pratiques',
    readTime: '8 min de lecture',
    tags: ['Visa', 'Santé', 'Formalités', 'Sécurité'],
    content: `
# Formalités d'entrée et conseils pratiques pour l'Inde

Préparer son voyage en Inde est simple lorsque l'on dispose des bonnes informations à jour. Voici l'essentiel à retenir.

## 1. Le Visa Électronique (e-Visa)
Tous les ressortissants français, belges, suisses et canadiens doivent être munis d'un visa :
- **Demande en ligne :** Se fait directement sur le site officiel du gouvernement indien (*indianvisaonline.gov.in*).
- **Délais :** Faites la demande au moins 10 à 15 jours avant votre départ.
- **Validité :** Le e-Visa touristique de 30 jours ou 1 an permet de multiples entrées.
- **Passeport :** Doit être valable au moins 6 mois après votre date de retour avec 2 pages vierges.

## 2. Santé et Vaccinations
- Aucun vaccin n'est obligatoire pour les voyageurs arrivant d'Europe.
- **Recommandés :** Vaccins universels (DTP, ROR), Hépatite A et B, Fièvre typhoïde.
- **Eau et Alimentation :** Buvez exclusivement de l'eau en bouteille capsulée scellée et privilégiez les plats cuits et chauds.

## 3. Monnaie et Moyens de Paiement
- La monnaie locale est la **Roupie Indienne (INR)**.
- Des distributeurs automatiques (ATM) acceptant les cartes Visa et Mastercard sont disponibles dans toutes les villes.
- Il est très facile de changer des Euros directement à votre arrivée ou dans les hôtels de patrimoine.
    `
  },
  {
    title: 'Top 5 des forteresses et palais incontournables au Rajasthan',
    slug: 'top-5-forteresses-palais-rajasthan',
    excerpt: 'De l’imprenable Fort de Mehrangarh à Jodhpur jusqu’aux palais féériques d’Udaipur et Jaïpur.',
    coverImage: '/images/dest-jodhpur.jpg',
    category: 'Patrimoine',
    readTime: '5 min de lecture',
    tags: ['Rajasthan', 'Monuments', 'Histoire', 'Culture'],
    content: `
# Les 5 plus beaux palais et forts du Rajasthan

Le Rajasthan concentre les plus spectaculaires prouesses architecturales d'Asie. Voici notre sélection coup de cœur à ne pas manquer lors de votre voyage.

## 1. Le Fort de Mehrangarh (Jodhpur)
Dominant la ville bleue depuis un piton rocheux de 120 mètres, Mehrangarh est souvent qualifié par les historiens de « chef-d'œuvre de géants ». Ses cours intérieures dentelées et sa collection d'armures et palanquins royaux sont exceptionnelles.

## 2. Le City Palace & le Lac Pichola (Udaipur)
Édifié sur près de quatre siècles au bord de l'eau, le City Palace d'Udaipur mêle architecture rajput et moghole. La vue sur le Lake Palace immaculé au soleil couchant est inoubliable.

## 3. Le Fort d’Amber (Jaïpur)
Avec ses remparts serpentant sur les collines, sa cour des miroirs (Sheesh Mahal) et ses façades de marbre jaune et rose, Amber est l'un des joyaux les plus visités du pays.

## 4. La Forteresse de Jaisalmer (Sonar Qila)
Une forteresse vivante sculptée dans le grès jaune où résident encore aujourd'hui plus de 4 000 habitants, abritant sept temples jaïns aux sculptures d'une finesse incomparable.

## 5. Le Fort de Junagarh (Bikaner)
Contrairement aux autres forteresses perchées, Junagarh est construite en plaine et renferme des appartements royaux aux plafonds en bois de santal et fresques dorées d'une conservation parfaite.
    `
  }
];

export const sampleBookings = [
  {
    bookingType: 'custom_trip',
    destinations: ['Rajasthan', 'Varanasi'],
    departureDate: '2026-11-15',
    durationDays: '14 jours',
    adultsCount: 2,
    childrenCount: 0,
    accommodationType: 'Hôtel de Charme / Haveli 4*',
    budgetPerPerson: '1200 - 1800 €',
    interests: ['Histoire & Architecture', 'Maharajas & Luxe', 'Cuisine locale'],
    notes: 'Nous aimerions visiter Jaïpur, Jodhpur et faire une balade en bateau sur le Gange à Bénarès. Chauffeur francophone si possible.',
    fullName: 'Laurent Mercier',
    email: 'laurent.mercier75@gmail.com',
    phone: '+33 6 12 34 56 78',
    country: 'France',
    preferredContact: 'whatsapp',
    status: 'nouveau'
  },
  {
    bookingType: 'tour_quote',
    tourTitle: 'Séjour au Rajasthan et Bénarès – Le Rajasthan et la rivière Gange',
    tourSlug: 'sejour-au-rajasthan-et-benares',
    destinations: ['Rajasthan', 'Agra', 'Varanasi'],
    departureDate: '2026-12-20',
    durationDays: '14 Jours / 13 Nuits',
    adultsCount: 4,
    childrenCount: 2,
    accommodationType: 'Hôtel de Charme / Haveli',
    budgetPerPerson: '1500 - 2000 €',
    interests: ['Culture & Patrimoine', 'Famille'],
    notes: 'Voyage en famille pour les fêtes de fin d’année. Nous serons 6 personnes au total.',
    fullName: 'Céline & Thomas Bernard',
    email: 'celine.bernard@yahoo.fr',
    phone: '+33 6 98 76 54 32',
    country: 'France',
    preferredContact: 'email',
    status: 'contacte'
  }
];

export const sampleMessages = [
  {
    fullName: 'Alain Roussel',
    email: 'alain.roussel@orange.fr',
    phone: '+33 6 45 67 89 01',
    subject: 'Demande de devis circuit combiné Rajasthan et Népal',
    message: 'Bonjour, nous prévoyons un voyage d’environ 3 semaines en mars prochain combinant le Rajasthan et Katmandou. Pourriez-vous nous contacter pour étudier un itinéraire ? Merci d’avance.',
    status: 'unread'
  },
  {
    fullName: 'Brigitte Morel',
    email: 'b.morel@laposte.net',
    phone: '+33 7 89 12 34 56',
    subject: 'Renseignements chauffeur privé à Jodhpur',
    message: 'Bonjour, nous serons à Jodhpur pendant 4 jours en octobre. Proposez-vous un service de véhicule privé avec chauffeur pour visiter les environs (Osian, Ranakpur) ? Cordialement.',
    status: 'read'
  }
];
