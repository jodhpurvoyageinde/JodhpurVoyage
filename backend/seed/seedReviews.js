import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Review from '../models/Review.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

export const rawReviews = [
  {
    id: '1',
    category: 'rajasthan',
    link: '/tour-rajasthan',
    img: 'https://www.jodhpurvoyage.com/wp-content/uploads/2026/07/Voyage-Jaisalmer.jpg',
    fallbackImg: '/images/Voyage-Jaisalmer.jpg',
    tag: 'Rajasthan • 14 Jours',
    tagIcon: 'fas fa-map-marker-alt',
    title: 'Voyage au Rajasthan 14 Jours',
    rating: 5,
    excerpt: '"Bonjour Monsieur Singh, Nous tenons à vous dire à quel point nous avons été ravis par votre organisation : chauffeur exceptionnel, véhicules très confortables, choix des hôtels patrimoniaux magiques et écoute permanente tout au long de notre parcours au Rajasthan."',
    authorAvatar: 'MS',
    authorName: 'Famille & Voyageurs Francophones',
    reviewDate: 'Avis Vérifié • Organisé par Jodhpur Voyage'
  },
  {
    id: '2',
    category: 'ladakh',
    link: '/tours',
    img: 'https://www.jodhpurvoyage.com/wp-content/uploads/2026/08/voyage-au-ladakh-inde.jpg',
    fallbackImg: '/images/dest-ladakh.jpg',
    tag: 'Ladakh & Tibet • Circuit Montagne',
    tagIcon: 'fas fa-mountain',
    title: 'Séjour au Ladakh – Le petit Tibet de l\'Inde',
    rating: 5,
    excerpt: '"Le séjour au Ladakh organisé par l\'agence Jodhpur Voyage s\'est déroulé dans les meilleures conditions possibles. Notre chauffeur dans l\'Himalaya était extrêmement fiable, prudent et compétent. Nous avons découvert des monastères bouddhistes uniques et des paysages à couper le souffle."',
    authorAvatar: 'LD',
    authorName: 'Voyageurs du Ladakh',
    reviewDate: 'Avis Vérifié • Séjour sur mesure'
  },
  {
    id: '3',
    category: 'inde-du-nord',
    link: '/tours',
    img: 'https://www.jodhpurvoyage.com/wp-content/uploads/2026/05/Voyage-au-Himachal-en-Inde.jpg',
    fallbackImg: '/images/dest-himachal.jpg',
    tag: 'Punjab & Himachal Pradesh',
    tagIcon: 'fas fa-place-of-worship',
    title: 'Circuit & Séjour Punjab & Himachal Pradesh',
    rating: 5,
    excerpt: '"Bonjour M. Singh, Comme convenu je reviens vers vous pour faire un petit point sur notre magnifique voyage au Punjab et dans l\'Himachal Pradesh. Du Temple d\'Or d\'Amritsar aux vallées de Dharamsala, la prise en charge, la sécurité et la flexibilité sur le terrain étaient irréprochables."',
    authorAvatar: 'PH',
    authorName: 'Groupe d\'Amis Francophones',
    reviewDate: 'Avis Vérifié • Inde du Nord'
  },
  {
    id: '4',
    category: 'rajasthan',
    link: '/tour-rajasthan',
    img: 'https://www.jodhpurvoyage.com/wp-content/uploads/2026/05/Sejour-au-Rajasthan-avec-chauffeur.jpg',
    fallbackImg: '/images/dest-rajasthan.jpg',
    tag: 'Chauffeur Privé • Rajasthan',
    tagIcon: 'fas fa-car-side',
    title: 'Séjour au Rajasthan avec Chauffeur Privé',
    rating: 5,
    excerpt: '"Nous avons particulièrement apprécié l\'organisation impeccable, les voitures spacieuses et toujours climatisées, les chauffeurs d\'une gentillesse rare, le suivi quotidien de l\'agence et les attentions de chaque instant avec les bouteilles d\'eau fournies tous les jours dans le véhicule."',
    authorAvatar: 'CR',
    authorName: 'Chantal & Robert',
    reviewDate: 'Avis Vérifié • Circuit Privé avec Chauffeur'
  },
  {
    id: '5',
    category: 'ladakh',
    link: '/tours',
    img: 'https://www.jodhpurvoyage.com/wp-content/uploads/2022/03/voyage-ladakh.jpeg',
    fallbackImg: '/images/dest-ladakh.jpg',
    tag: 'Trek & Aventure • 8 Jours',
    tagIcon: 'fas fa-hiking',
    title: 'Voyage au Ladakh (8 Jours)',
    rating: 5,
    excerpt: '"Voici le résumé de notre voyage de 8 jours au Ladakh programmé de main de maître par l\'agence Jodhpur Voyage. Mr. Singh a su faire preuve d\'une grande réactivité avant et pendant le parcours. Chaque étape et chaque nuitée en altitude étaient parfaitement planifiées."',
    authorAvatar: 'VL',
    authorName: 'Voyageurs Aventuriers',
    reviewDate: 'Avis Vérifié • Himalaya & Ladakh'
  },
  {
    id: '6',
    category: 'rajasthan',
    link: '/tour-rajasthan',
    img: 'https://www.jodhpurvoyage.com/wp-content/uploads/2026/05/Voyage-au-Rajasthan-Hors-des-sentiers-battus-avec-Taj-Mahal.jpg',
    fallbackImg: '/images/dest-tajmahal.jpg',
    tag: 'Hors des sentiers battus • Taj Mahal',
    tagIcon: 'fas fa-compass',
    title: 'Rajasthan Hors Sentiers Battus & Taj Mahal',
    rating: 5,
    excerpt: '"Bonjour, Comme promis nous vous envoyons notre évaluation détaillée : 1. Préparation du voyage : l\'écoute de Mr Singh a permis de composer exactement le voyage personnalisé que nous espérions. 2. Le chauffeur : prévenant et très prudent sur la route. Une expérience magique hors des sentiers battus !"',
    authorAvatar: 'HB',
    authorName: 'Famille & Amis Francophones',
    reviewDate: 'Avis Vérifié • Rajasthan Authentique'
  },
  {
    id: '7',
    category: 'inde-du-nord',
    link: '/tours',
    img: 'https://www.jodhpurvoyage.com/wp-content/uploads/2026/04/Voyage-Inde-du-nord_Jodhpur-Voyage.jpg',
    fallbackImg: '/images/dest-jodhpur.jpg',
    tag: 'Guide Francophone • Inde du Nord',
    tagIcon: 'fas fa-user-tie',
    title: 'Voyage Inde du Nord avec Guide Francophone',
    rating: 5,
    excerpt: '"Bonjour M. Singh, Comme promis, voici nos impressions chaleureuses sur le voyage. Tout d\'abord merci beaucoup pour nous avoir permis de réaliser ce magnifique périple. Avoir un guide francophone passionné nous a permis de comprendre l\'histoire et les coutumes indiennes au plus près !"',
    authorAvatar: 'GF',
    authorName: 'Voyageurs Passionnés de Culture',
    reviewDate: 'Avis Vérifié • Circuit Culturel'
  },
  {
    id: '8',
    category: 'inde-du-nord',
    link: '/tour-rajasthan',
    img: 'https://www.jodhpurvoyage.com/wp-content/uploads/2026/04/Voyage-inde-du-nord-le-rajasthan-agra-benares.jpg',
    fallbackImg: '/images/dest-varanasi.jpg',
    tag: 'Rajasthan, Agra & Varanasi (Gange)',
    tagIcon: 'fas fa-om',
    title: 'Le Rajasthan & Vallée du Gange à Varanasi',
    rating: 5,
    excerpt: '"Bonjour M. Singh, Désolés pour ce message tardif après notre retour en France. Nous tenions absolument à exprimer notre profonde gratitude envers Jodhpur Voyage. De la majesté d\'Agra aux cérémonies sacrées des ghats de Varanasi, tout était orchestré à la perfection."',
    authorAvatar: 'VG',
    authorName: 'Pierre & Hélène Martin',
    reviewDate: 'Avis Vérifié • Rajasthan & Benares'
  },
  {
    id: '9',
    category: 'inde-du-sud',
    link: '/destinations',
    img: 'https://www.jodhpurvoyage.com/wp-content/uploads/2026/04/Voyage-au-Kerala.jpg',
    fallbackImg: '/images/dest-kerala.jpg',
    tag: 'Kerala & Mysore • Inde du Sud',
    tagIcon: 'fas fa-water',
    title: 'Voyage au Kerala et Palais de Mysore',
    rating: 5,
    excerpt: '"Nous revenons enchantés d\'un voyage au Kérala organisé par Jodhpur Voyage. Comme pour notre précédent voyage au Rajasthan avec cette même agence locale, l\'accueil, les péniches d\'eau douce (Houseboat) et le palais de Mysore ont comblé toutes nos attentes !"',
    authorAvatar: 'KM',
    authorName: 'Clients Fidèles (2ème Voyage)',
    reviewDate: 'Avis Vérifié • Inde du Sud & Kerala'
  },
  {
    id: '10',
    category: 'rajasthan',
    link: '/tour-rajasthan',
    img: 'https://www.jodhpurvoyage.com/wp-content/uploads/2026/04/Voyage-au-Rajasthan-et-Taj-Mahal-avec-agence-locale.jpg',
    fallbackImg: '/images/image-6.jpg',
    tag: 'Rajasthan, Agra & Varanasi',
    tagIcon: 'fas fa-monument',
    title: 'Voyage Rajasthan, Agra & Varanasi',
    rating: 5,
    excerpt: '"Nous avons vécu un magnifique voyage à travers le Rajasthan ainsi qu\'à Agra et Varanasi grâce aux conseils avisés de l\'agence Jodhpur Voyage. Un itinéraire rythmé sans aucune fatigue excessive, avec un suivi téléphonique régulier de l\'équipe locale."',
    authorAvatar: 'AV',
    authorName: 'Couple de Voyageurs Francophones',
    reviewDate: 'Avis Vérifié • Agence Locale Directe'
  },
  {
    id: '11',
    category: 'rajasthan',
    link: '/tour-rajasthan',
    img: 'https://www.jodhpurvoyage.com/wp-content/uploads/2026/03/voyage-au-rajasthan-inde.jpeg',
    fallbackImg: '/images/dest-rajasthan.jpg',
    tag: 'Circuit 14 Jours • Rajasthan',
    tagIcon: 'fas fa-calendar-alt',
    title: 'Voyage au Rajasthan 14 Jours',
    rating: 5,
    excerpt: '"Bonjour Monsieur Singh, Nous voici bien rentrés dans notre commune bien calme. Notre esprit reste rempli de souvenirs précieux et colorés du Rajasthan. Merci pour votre professionnalisme, vos conseils de visite et pour le choix méticuleux des guides dans chaque cité royale."',
    authorAvatar: 'RJ',
    authorName: 'Monique & Bernard',
    reviewDate: 'Avis Vérifié • Circuit Classique 14 Jours'
  },
  {
    id: '12',
    category: 'gujarat',
    link: '/destinations',
    img: 'https://www.jodhpurvoyage.com/wp-content/uploads/2026/03/Sejour-au-Gujarat.jpg',
    fallbackImg: '/images/dest-gujarat.jpg',
    tag: 'Gujarat • 3ème Voyage',
    tagIcon: 'fas fa-city',
    title: 'Séjour au Gujarat avec Guide Francophone',
    rating: 5,
    excerpt: '"Bonjour M. Singh, Nous sommes bien rentrées de notre tour au Gujarat. C\'est le 3ème voyage consécutif que nous confions à votre agence locale ! Comme toujours, l\'organisation était irréprochable et la découverte des tribus du Gujarat était inoubliable."',
    authorAvatar: 'GJ',
    authorName: 'Voyageuses Fidèles (3ème Séjour)',
    reviewDate: 'Avis Vérifié • Gujarat & Tribus'
  },
  {
    id: '13',
    category: 'ladakh',
    link: '/tours',
    img: 'https://www.jodhpurvoyage.com/wp-content/uploads/2025/11/zanskar.jpg',
    fallbackImg: '/images/dest-ladakh.jpg',
    tag: 'Zanskar & Ladakh • Hautes Altitudes',
    tagIcon: 'fas fa-snowflake',
    title: 'Voyage Exceptionnel Ladakh & Zanskar',
    rating: 5,
    excerpt: '"Nous étions deux amis et souhaitions faire un voyage précis au Zanskar et Ladakh. Nous avons soumis notre itinéraire exigeant à Mr. Singh qui a orchestré la logistique de chaque col de montagne, des jeeps 4x4 et des hébergements de manière fabuleuse."',
    authorAvatar: 'LZ',
    authorName: 'Deux Amis Aventuriers',
    reviewDate: 'Avis Vérifié • Expédition Zanskar'
  },
  {
    id: '14',
    category: 'rajasthan',
    link: '/voyage-sur-mesure',
    img: 'https://www.jodhpurvoyage.com/wp-content/uploads/2025/11/Voyage-en-famille-en-Inde.jpg',
    fallbackImg: '/images/image-12.jpg',
    tag: 'Voyage Famille • Rajasthan & Taj Mahal',
    tagIcon: 'fas fa-users',
    title: 'Voyage en Famille Rajasthan & Taj Mahal',
    rating: 5,
    excerpt: '"Bonjour Monsieur Singh, Nous vous remercions pour le magnifique séjour et les merveilleuses découvertes effectués avec nos trois enfants. L\'attention portée à la sécurité de la famille et le confort des véhicules minibus étaient exceptionnels !"',
    authorAvatar: 'FA',
    authorName: 'Famille Moreau (5 personnes)',
    reviewDate: 'Avis Vérifié • Séjour Famille'
  }
];

export const formatReviewForDb = (r, index) => {
  const cleanComment = r.excerpt ? r.excerpt.replace(/^"|"$/g, '').trim() : (r.comment || '');
  const cleanExcerpt = r.excerpt || (cleanComment ? `"${cleanComment}"` : '');
  
  // Extract or generate travel date
  let travelDate = 'Janvier 2026';
  if (r.reviewDate && r.reviewDate.includes('•')) {
    travelDate = r.reviewDate.split('•')[1]?.trim() || 'Janvier 2026';
  }

  // Location/City hints from author
  let authorCity = 'France';
  if (r.authorName && r.authorName.includes('Suisse')) authorCity = 'Genève, Suisse';
  else if (r.authorName && r.authorName.includes('Belgique')) authorCity = 'Bruxelles, Belgique';

  const cleanSlug = `avis-${r.category || 'inde'}-${index + 1}-${(r.authorName || 'client').toLowerCase().replace(/[^a-z0-9]/g, '-')}`.replace(/-+/g, '-');

  return {
    slug: cleanSlug,
    authorName: r.authorName,
    authorAvatar: r.authorAvatar || 'JV',
    avatar: r.authorAvatar || 'JV',
    authorCity: r.authorCity || authorCity,
    tourTitle: r.title,
    title: r.title,
    category: r.category || 'rajasthan',
    rating: Number(r.rating) || 5,
    travelDate: r.travelDate || travelDate,
    reviewDate: r.reviewDate || `Avis Vérifié • ${travelDate}`,
    comment: cleanComment,
    excerpt: cleanExcerpt,
    image: r.img,
    img: r.img,
    fallbackImg: r.fallbackImg || '/images/image-8.jpg',
    tag: r.tag,
    tagIcon: r.tagIcon || 'fas fa-map-marker-alt',
    link: r.link || '/tour-rajasthan',
    status: 'approved',
    featured: index < 6
  };
};

export const seedReviews = async () => {
  let uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('<db_password>')) {
    uri = process.env.LOCAL_MONGODB_URI || 'mongodb://127.0.0.1:27017/jodhpurvoyage';
  }

  console.log('🔄 Connexion à MongoDB pour le seed des avis...');
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log(`✅ Connecté à MongoDB: ${conn.connection.host} (Base: ${conn.connection.name})`);

    // Drop legacy conflicting index if exists
    try {
      const indexes = await Review.collection.indexes();
      const hasSlugIndex = indexes.some(idx => idx.name === 'slug_1');
      if (hasSlugIndex) {
        await Review.collection.dropIndex('slug_1');
        console.log('🗑️ Ancien index "slug_1" supprimé de la collection.');
      }
    } catch (idxErr) {
      console.log('ℹ️ Note sur index:', idxErr.message);
    }

    const formattedData = rawReviews.map(formatReviewForDb);

    console.log(`🧹 Nettoyage de l'ancienne collection de commentaires...`);
    await Review.deleteMany({});

    console.log(`📥 Insertion des ${formattedData.length} avis voyageurs en base...`);
    const inserted = await Review.insertMany(formattedData);

    console.log(`\n🎉 SUCCÈS: ${inserted.length} avis insérés dans la base de données !`);
    inserted.forEach((r, idx) => {
      console.log(`  [${idx + 1}] ⭐ ${r.rating}/5 - ${r.authorName} ("${r.title}") [Cat: ${r.category}]`);
    });

    await mongoose.disconnect();
    console.log('🔌 Déconnexion de MongoDB réussie.');
    return true;
  } catch (err) {
    console.error('❌ Erreur lors du seed des avis:', err.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    return false;
  }
};

// If run directly via node seedReviews.js
if (process.argv[1] && process.argv[1].endsWith('seedReviews.js')) {
  seedReviews().then((success) => {
    process.exit(success ? 0 : 1);
  });
}
