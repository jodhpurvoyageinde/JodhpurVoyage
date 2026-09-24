import express from 'express';
import Booking from '../models/Booking.js';
import { isMongoConnected, memoryStore } from '../store.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/bookings
router.post('/', async (req, res) => {
  try {
    const body = req.body || {};
    const client = body.client || {};

    // Extract fullName from various payload structures
    let fullName = body.fullName || body.name || '';
    if (!fullName && (client.firstName || client.lastName)) {
      fullName = `${client.civility ? client.civility + ' ' : ''}${client.firstName || ''} ${client.lastName || ''}`.trim();
    }
    if (!fullName && (body.first_name || body.last_name)) {
      fullName = `${body.civility ? body.civility + ' ' : ''}${body.first_name || ''} ${body.last_name || ''}`.trim();
    }
    if (!fullName && body.full_name) {
      fullName = body.full_name.trim();
    }

    const email = (body.email || client.email || body.your_email || '').trim();
    const phone = (body.phone || client.phone || body.your_phone || '').trim();

    if (!fullName || !email || !phone) {
      return res.status(400).json({ 
        message: 'Veuillez remplir vos coordonnées obligatoires (Nom, Email et Téléphone).' 
      });
    }

    const bookingData = {
      bookingType: body.bookingType || (body.tourSlug ? 'tour_quote' : 'custom_trip'),
      tourTitle: body.tourTitle || body.tourName || 'Demande de devis voyage',
      tourSlug: body.tourSlug || '',
      destinations: Array.isArray(body.destinations) 
        ? body.destinations 
        : (body.destinations ? [body.destinations] : []),
      departureDate: body.departureDate || body.departure_date || '',
      durationDays: body.durationDays || body.duration || '',
      adultsCount: Number(body.adultsCount || body.adults || body.adults_count || 2),
      childrenCount: Number(body.childrenCount || body.children || body.children_count || 0),
      accommodationType: body.accommodationType || body.accommodation || body.accommodation_style || 'Hôtel de Charme / Haveli',
      budgetPerPerson: body.budgetPerPerson || body.budget || '',
      interests: Array.isArray(body.interests) ? body.interests : (body.interests ? [body.interests] : []),
      notes: body.notes || body.specialRequests || body.comments || body.your_message || '',
      fullName,
      email,
      phone,
      country: body.country || client.country || 'France',
      preferredContact: body.preferredContact || 'email',
      status: 'nouveau'
    };

    if (isMongoConnected()) {
      const booking = new Booking(bookingData);
      const savedBooking = await booking.save();
      return res.status(201).json({
        message: 'Votre demande de voyage sur mesure a été enregistrée avec succès ! Notre équipe locale vous répondra sous 24h.',
        booking: savedBooking
      });
    }

    const savedBooking = {
      _id: `booking_${Date.now()}`,
      ...bookingData,
      createdAt: new Date().toISOString()
    };
    memoryStore.bookings.unshift(savedBooking);

    res.status(201).json({
      message: 'Votre demande de voyage sur mesure a été enregistrée avec succès ! Notre équipe locale vous répondra sous 24h.',
      booking: savedBooking
    });
  } catch (error) {
    console.error('Erreur create booking:', error);
    res.status(400).json({ message: error.message || 'Erreur lors de l\'enregistrement de votre demande' });
  }
});

// GET /api/bookings
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, type } = req.query;

    if (isMongoConnected()) {
      let query = {};
      if (status && status !== 'all') query.status = status;
      if (type && type !== 'all') query.bookingType = type;
      const bookings = await Booking.find(query).sort({ createdAt: -1 });
      return res.json(bookings);
    }

    let list = [...memoryStore.bookings];
    if (status && status !== 'all') list = list.filter((b) => b.status === status);
    if (type && type !== 'all') list = list.filter((b) => b.bookingType === type);
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération demandes' });
  }
});

// PUT /api/bookings/:id/status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    if (isMongoConnected()) {
      const booking = await Booking.findById(req.params.id);
      if (!booking) return res.status(404).json({ message: 'Demande introuvable' });
      if (status) booking.status = status;
      if (adminNotes !== undefined) booking.adminNotes = adminNotes;
      const updated = await booking.save();
      return res.json(updated);
    }

    const idx = memoryStore.bookings.findIndex((b) => b._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Demande introuvable' });
    if (status) memoryStore.bookings[idx].status = status;
    if (adminNotes !== undefined) memoryStore.bookings[idx].adminNotes = adminNotes;
    res.json(memoryStore.bookings[idx]);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Erreur mise à jour' });
  }
});

// DELETE /api/bookings/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (isMongoConnected()) {
      await Booking.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Demande supprimée avec succès' });
    }

    memoryStore.bookings = memoryStore.bookings.filter((b) => b._id !== req.params.id);
    res.json({ message: 'Demande supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur suppression' });
  }
});

export default router;
