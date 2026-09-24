import express from 'express';
import Tour from '../models/Tour.js';
import Destination from '../models/Destination.js';
import Booking from '../models/Booking.js';
import ContactMessage from '../models/ContactMessage.js';
import Review from '../models/Review.js';
import BlogPost from '../models/BlogPost.js';
import { isMongoConnected, memoryStore } from '../store.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, adminOnly, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const [
        totalBookings,
        newBookings,
        confirmedBookings,
        totalTours,
        totalDestinations,
        approvedReviews,
        pendingReviews,
        totalBlogs,
        unreadContacts,
        recentBookings,
        recentMessages
      ] = await Promise.all([
        Booking.countDocuments(),
        Booking.countDocuments({ status: 'nouveau' }),
        Booking.countDocuments({ status: 'confirme' }),
        Tour.countDocuments(),
        Destination.countDocuments(),
        Review.countDocuments({ status: { $ne: 'rejected' } }),
        Review.countDocuments({ status: 'pending' }),
        BlogPost.countDocuments(),
        ContactMessage.countDocuments({ status: 'unread' }),
        Booking.find().sort({ createdAt: -1 }).limit(6),
        ContactMessage.find().sort({ createdAt: -1 }).limit(5)
      ]);

      return res.json({
        metrics: {
          totalBookings,
          newBookings,
          confirmedBookings,
          totalTours,
          totalDestinations,
          approvedReviews,
          pendingReviews,
          totalBlogs,
          unreadContacts
        },
        recentBookings,
        recentMessages
      });
    }

    // Memory Store metrics
    res.json({
      metrics: {
        totalBookings: memoryStore.bookings.length,
        newBookings: memoryStore.bookings.filter((b) => b.status === 'nouveau').length,
        confirmedBookings: memoryStore.bookings.filter((b) => b.status === 'confirme').length,
        totalTours: memoryStore.tours.length,
        totalDestinations: memoryStore.destinations.length,
        approvedReviews: memoryStore.reviews.filter((r) => r.status === 'approved').length,
        pendingReviews: memoryStore.reviews.filter((r) => r.status === 'pending').length,
        totalBlogs: memoryStore.blogs.length,
        unreadContacts: memoryStore.contacts.filter((c) => c.status === 'unread').length
      },
      recentBookings: memoryStore.bookings.slice(0, 6),
      recentMessages: memoryStore.contacts.slice(0, 5)
    });
  } catch (error) {
    console.error('Erreur dashboard stats:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
});

export default router;
