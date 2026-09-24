import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../models/User.js';
import Tour from '../models/Tour.js';
import Destination from '../models/Destination.js';
import Booking from '../models/Booking.js';
import ContactMessage from '../models/ContactMessage.js';
import Review from '../models/Review.js';
import BlogPost from '../models/BlogPost.js';

import {
  adminUser,
  destinationsData,
  toursData,
  reviewsData,
  blogPostsData,
  sampleBookings,
  sampleMessages
} from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
  let uri = process.env.MONGODB_URI;

  // Check if password placeholder is still present
  if (uri && uri.includes('<db_password>')) {
    console.log('\n⚠️  ATTENTION: Votre MONGODB_URI contient encore "<db_password>".');
    console.log('💡 Tentative de connexion sur la base locale (LOCAL_MONGODB_URI) ou vérification...');
    uri = process.env.LOCAL_MONGODB_URI || 'mongodb://127.0.0.1:27017/jodhpurvoyage';
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅ MongoDB Connecté avec succès: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur connexion MongoDB: ${error.message}`);
    console.log('\n💡 Pour connecter votre cluster MongoDB Atlas :');
    console.log('   Ouvrez le fichier backend/.env et remplacez <db_password> par votre vrai mot de passe Atlas.');
    return false;
  }
};

const seedDatabase = async () => {
  const connected = await connectDB();
  if (!connected) {
    process.exit(1);
  }

  try {
    console.log('\n🧹 Nettoyage des anciennes données...');
    await User.deleteMany();
    await Tour.deleteMany();
    await Destination.deleteMany();
    await Review.deleteMany();
    await BlogPost.deleteMany();
    await Booking.deleteMany();
    await ContactMessage.deleteMany();

    console.log('👤 Création du compte administrateur...');
    await User.create(adminUser);
    console.log(`   👉 Admin: ${adminUser.email} / ${adminUser.password}`);

    console.log('🗺️  Insertion des destinations...');
    await Destination.insertMany(destinationsData);
    console.log(`   👉 ${destinationsData.length} destinations insérées`);

    console.log('🚗 Insertion des circuits & offres de voyage...');
    await Tour.insertMany(toursData);
    console.log(`   👉 ${toursData.length} circuits avec itinéraires insérés`);

    console.log('⭐ Insertion des avis & témoignages authentiques...');
    await Review.insertMany(reviewsData);
    console.log(`   👉 ${reviewsData.length} avis voyageurs insérés`);

    console.log('✍️  Insertion des articles de blog...');
    await BlogPost.insertMany(blogPostsData);
    console.log(`   👉 ${blogPostsData.length} articles de blog insérés`);

    console.log('📋 Insertion des demandes de devis et messages d’exemple...');
    await Booking.insertMany(sampleBookings);
    await ContactMessage.insertMany(sampleMessages);
    console.log(`   👉 Demandes & messages insérés pour le tableau de bord`);

    console.log('\n🎉 INITIALISATION DE LA BASE DE DONNÉES RÉUSSIE !');
    console.log('===================================================');
    console.log('Tous les contenus du prototype sont désormais en base MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l’initialisation des données:', error);
    process.exit(1);
  }
};

seedDatabase();
