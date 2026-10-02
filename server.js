import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import tourRoutes from './routes/tourRoutes.js';
import destinationRoutes from './routes/destinationRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import seoRoutes from './routes/seoRoutes.js';
import customUrlRoutes from './routes/customUrlRoutes.js';
import megaMenuRoutes from './routes/megaMenuRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_PREFIX = (process.env.API_PREFIX || '/api').replace(/\/+$/, '');

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Static files for images (serve images from the root images folder and uploaded images)
const rootImagesPath = path.join(__dirname, '../images');
app.use('/images', express.static(rootImagesPath));

const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// API Routes setup with configurable API_PREFIX
const registerRoutes = (prefix) => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/tours`, tourRoutes);
  app.use(`${prefix}/destinations`, destinationRoutes);
  app.use(`${prefix}/bookings`, bookingRoutes);
  app.use(`${prefix}/contacts`, contactRoutes);
  app.use(`${prefix}/reviews`, reviewRoutes);
  app.use(`${prefix}/blogs`, blogRoutes);
  app.use(`${prefix}/stats`, statsRoutes);
  app.use(`${prefix}/upload`, uploadRoutes);
  app.use(`${prefix}/seo`, seoRoutes);
  app.use(`${prefix}/custom-urls`, customUrlRoutes);
  app.use(`${prefix}/mega-menu`, megaMenuRoutes);
};

// Mount configured API prefix
registerRoutes(API_PREFIX);

// If custom API_PREFIX is set, also maintain /api alias for backward compatibility
if (API_PREFIX !== '/api') {
  registerRoutes('/api');
}

// Health check endpoint
app.get(`${API_PREFIX}/health`, (req, res) => {
  res.json({
    status: 'OK',
    app: 'Jodhpur Voyage API',
    apiPrefix: API_PREFIX,
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

if (API_PREFIX !== '/api') {
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'OK',
      app: 'Jodhpur Voyage API',
      apiPrefix: API_PREFIX,
      mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  });
}

// Root API info
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l’API Jodhpur Voyage',
    version: '1.0.0',
    apiPrefix: API_PREFIX,
    documentation: `${API_PREFIX}/health`,
    customUrlsEndpoint: `${API_PREFIX}/custom-urls`
  });
});

// Global 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Route non trouvée: ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Erreur API non interceptée:', err.stack);
  res.status(500).json({
    message: 'Une erreur interne est survenue sur le serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// MongoDB Connection
const connectMongoDB = async () => {
  let uri = process.env.MONGODB_URI;

  if (uri && uri.includes('<db_password>')) {
    console.log('⚠️ Note: <db_password> détecté dans MONGODB_URI. Tentative avec base locale ou attente de configuration...');
    uri = process.env.LOCAL_MONGODB_URI || 'mongodb://127.0.0.1:27017/jodhpurvoyage';
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('🌟 MongoDB connecté avec succès !');
  } catch (err) {
    console.error('⚠️ Attention: Connexion MongoDB en attente de configuration valide.');
    console.log('👉 Pour activer MongoDB Atlas, renseignez votre vrai mot de passe dans backend/.env');
  }
};

app.listen(PORT, () => {
  console.log(`🚀 Serveur Backend Jodhpur Voyage démarré sur http://localhost:${PORT}`);
  console.log(`📡 API Health Check disponible sur http://localhost:${PORT}/api/health`);
  connectMongoDB();
});

export default app;
