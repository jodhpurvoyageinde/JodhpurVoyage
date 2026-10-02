import express from 'express';
import ContactMessage from '../models/ContactMessage.js';
import { isMongoConnected, memoryStore } from '../store.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { sendContactNotificationEmail } from '../utils/emailService.js';

const router = express.Router();

// POST /api/contacts
router.post('/', async (req, res) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({ message: 'Veuillez remplir le nom, email et votre message.' });
    }

    const data = {
      fullName,
      email,
      phone,
      subject: subject || 'Demande générale',
      message,
      status: 'unread'
    };

    // Trigger email notification to Info@jodhpurvoyage.com from jodhpurvoyageinde@gmail.com
    sendContactNotificationEmail(data).catch((err) => {
      console.error('Erreur envoi notification mail contact:', err);
    });

    if (isMongoConnected()) {
      const contact = new ContactMessage(data);
      const saved = await contact.save();
      return res.status(201).json({
        message: 'Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.',
        contact: saved
      });
    }

    const saved = {
      _id: `contact_${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString()
    };
    memoryStore.contacts.unshift(saved);

    res.status(201).json({
      message: 'Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.',
      contact: saved
    });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Erreur lors de l\'envoi du message' });
  }
});

// GET /api/contacts
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.query;

    if (isMongoConnected()) {
      let query = {};
      if (status && status !== 'all') query.status = status;
      const messages = await ContactMessage.find(query).sort({ createdAt: -1 });
      return res.json(messages);
    }

    let list = [...memoryStore.contacts];
    if (status && status !== 'all') list = list.filter((m) => m.status === status);
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération messages' });
  }
});

// PUT /api/contacts/:id/status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    if (isMongoConnected()) {
      const msg = await ContactMessage.findById(req.params.id);
      if (!msg) return res.status(404).json({ message: 'Message introuvable' });
      if (status) msg.status = status;
      if (adminNotes !== undefined) msg.adminNotes = adminNotes;
      const updated = await msg.save();
      return res.json(updated);
    }

    const idx = memoryStore.contacts.findIndex((m) => m._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Message introuvable' });
    if (status) memoryStore.contacts[idx].status = status;
    if (adminNotes !== undefined) memoryStore.contacts[idx].adminNotes = adminNotes;
    res.json(memoryStore.contacts[idx]);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Erreur mise à jour' });
  }
});

// DELETE /api/contacts/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (isMongoConnected()) {
      await ContactMessage.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Message supprimé' });
    }

    memoryStore.contacts = memoryStore.contacts.filter((m) => m._id !== req.params.id);
    res.json({ message: 'Message supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur suppression' });
  }
});

export default router;
