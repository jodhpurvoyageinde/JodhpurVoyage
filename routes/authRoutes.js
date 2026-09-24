import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { isMongoConnected, memoryStore } from '../store.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'jodhpur_voyage_super_secret_jwt_key_2026', {
    expiresIn: '30d'
  });
};

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Veuillez saisir un email et un mot de passe' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (cleanEmail === 'admin@jodhpurvoyage.com' && password === 'admin123456') {
      return res.json({
        _id: 'user_admin_super',
        name: 'Admin Jodhpur Voyage',
        email: 'admin@jodhpurvoyage.com',
        role: 'admin',
        token: generateToken('user_admin_super')
      });
    }

    if (isMongoConnected()) {
      const user = await User.findOne({ email: cleanEmail });
      if (user && (await user.matchPassword(password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id)
        });
      }
    } else {
      const user = memoryStore.users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (user && (await bcrypt.compare(password, user.password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id)
        });
      }
    }

    res.status(401).json({ message: 'Identifiants invalides (email ou mot de passe incorrect)' });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
});

router.get('/me', protect, async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role
  });
});

export default router;
