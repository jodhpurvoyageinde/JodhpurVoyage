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

    // 1. Check MongoDB first if connected
    if (isMongoConnected()) {
      const user = await User.findOne({ email: cleanEmail });
      if (user) {
        const isMatch = await user.matchPassword(password);
        if (isMatch) {
          return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
          });
        }
        // If user exists in DB and password didn't match, reject
        return res.status(401).json({ message: 'Identifiants invalides (email ou mot de passe incorrect)' });
      }
    }

    // 2. Check memory store
    const memUser = (memoryStore.users || []).find((u) => u.email.toLowerCase() === cleanEmail);
    if (memUser) {
      const isMatch = await bcrypt.compare(password, memUser.password);
      if (isMatch) {
        return res.json({
          _id: memUser._id,
          name: memUser.name,
          email: memUser.email,
          role: memUser.role,
          token: generateToken(memUser._id)
        });
      }
      return res.status(401).json({ message: 'Identifiants invalides (email ou mot de passe incorrect)' });
    }

    // 3. Fallback initial bootstrap admin credentials only if no user exists in DB/memory
    if (cleanEmail === 'admin@jodhpurvoyage.com' && password === 'admin123456') {
      return res.json({
        _id: 'user_admin_super',
        name: 'Admin Jodhpur Voyage',
        email: 'admin@jodhpurvoyage.com',
        role: 'admin',
        token: generateToken('user_admin_super')
      });
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

// PUT /api/auth/change-password
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Veuillez renseigner le mot de passe actuel et le nouveau mot de passe.' });
    }

    if (typeof newPassword !== 'string' || newPassword.length < 6) {
      return res.status(400).json({ message: 'Le nouveau mot de passe doit comporter au moins 6 caractères.' });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ message: 'Le nouveau mot de passe doit être différent du mot de passe actuel.' });
    }

    const email = (req.user?.email || 'admin@jodhpurvoyage.com').toLowerCase().trim();
    let user = null;

    if (isMongoConnected()) {
      if (req.user._id && String(req.user._id).match(/^[0-9a-fA-F]{24}$/)) {
        user = await User.findById(req.user._id);
      }
      if (!user) {
        user = await User.findOne({ email });
      }
    }

    let isCurrentValid = false;

    if (user) {
      isCurrentValid = await user.matchPassword(currentPassword);
      if (!isCurrentValid && user.password === currentPassword) {
        isCurrentValid = true;
      }
    } else {
      const memUser = (memoryStore.users || []).find((u) => u.email.toLowerCase() === email);
      if (memUser) {
        isCurrentValid = await bcrypt.compare(currentPassword, memUser.password);
        if (!isCurrentValid && memUser.password === currentPassword) {
          isCurrentValid = true;
        }
      } else if (currentPassword === 'admin123456') {
        isCurrentValid = true;
      }
    }

    if (!isCurrentValid) {
      return res.status(400).json({ message: 'Le mot de passe actuel est incorrect.' });
    }

    // Save new password to MongoDB
    if (isMongoConnected()) {
      if (user) {
        user.password = newPassword; // userSchema.pre('save') handles bcrypt hashing
        await user.save();
      } else {
        user = new User({
          name: req.user.name || 'Admin Jodhpur Voyage',
          email: email,
          password: newPassword,
          role: 'admin'
        });
        await user.save();
      }
    }

    // Sync memoryStore
    const hashed = await bcrypt.hash(newPassword, 10);
    if (!memoryStore.users) memoryStore.users = [];
    const memIdx = memoryStore.users.findIndex((u) => u.email.toLowerCase() === email);
    if (memIdx !== -1) {
      memoryStore.users[memIdx].password = hashed;
    } else {
      memoryStore.users.push({
        _id: user?._id || 'user_admin_super',
        name: req.user.name || 'Admin Jodhpur Voyage',
        email: email,
        password: hashed,
        role: 'admin'
      });
    }

    res.json({
      success: true,
      message: 'Mot de passe mis à jour avec succès !'
    });
  } catch (error) {
    console.error('Erreur changement mot de passe:', error);
    res.status(500).json({ message: error.message || 'Erreur lors du changement de mot de passe' });
  }
});

export default router;
