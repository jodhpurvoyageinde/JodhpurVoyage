import express from 'express';
import Review from '../models/Review.js';
import { isMongoConnected, memoryStore } from '../store.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

const normalizeReview = (r) => {
  const doc = r && r.toObject ? r.toObject() : (r || {});
  return {
    ...doc,
    authorName: doc.authorName || doc.author?.name || doc.name || 'Client Jodhpur Voyage',
    authorCity: doc.authorCity || doc.author?.location || doc.location || 'France',
    comment: doc.comment || doc.excerpt || doc.content || '',
    tourTitle: doc.tourTitle || doc.tourName || doc.title || 'Voyage en Inde',
    rating: typeof doc.rating === 'number' ? doc.rating : 5,
    travelDate: doc.travelDate || (doc.publishedAt ? new Date(doc.publishedAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : '2026'),
    status: doc.status === 'Published' || doc.status === 'approved' ? 'approved' : doc.status
  };
};

// GET /api/reviews (Public approved reviews)
router.get('/', async (req, res) => {
  try {
    const { category, search, limit } = req.query;

    if (isMongoConnected()) {
      let query = { status: { $ne: 'rejected' } };
      if (category && category !== 'all') query.category = category;
      if (search) {
        query.$or = [
          { authorName: { $regex: search, $options: 'i' } },
          { 'author.name': { $regex: search, $options: 'i' } },
          { comment: { $regex: search, $options: 'i' } },
          { excerpt: { $regex: search, $options: 'i' } },
          { tourTitle: { $regex: search, $options: 'i' } },
          { tourName: { $regex: search, $options: 'i' } },
          { title: { $regex: search, $options: 'i' } }
        ];
      }

      let rq = Review.find(query).sort({ featured: -1, createdAt: -1 });
      if (limit) rq = rq.limit(Number(limit));
      const rawReviews = await rq.exec();
      const totalCount = await Review.countDocuments(query);
      const reviews = rawReviews.map(normalizeReview);

      return res.json({
        totalCount,
        avgScore: 4.9,
        reviews
      });
    }

    let list = memoryStore.reviews.filter((r) => r.status === 'approved');
    if (category && category !== 'all') list = list.filter((r) => r.category === category);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter((r) =>
        r.authorName?.toLowerCase().includes(s) ||
        r.comment?.toLowerCase().includes(s) ||
        r.tourTitle?.toLowerCase().includes(s)
      );
    }
    const totalCount = memoryStore.reviews.filter((r) => r.status === 'approved').length;
    if (limit) list = list.slice(0, Number(limit));

    res.json({
      totalCount,
      avgScore: 4.9,
      reviews: list.map(normalizeReview)
    });
  } catch (error) {
    console.error('Erreur get reviews:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des avis' });
  }
});

// POST /api/reviews (Public user submit review)
router.post('/', async (req, res) => {
  try {
    const { authorName, authorCity, tourTitle, category, rating, travelDate, comment } = req.body;

    if (!authorName || !comment) {
      return res.status(400).json({ message: 'Veuillez renseigner votre nom et votre témoignage.' });
    }

    const reviewData = {
      authorName,
      authorCity: authorCity || 'France',
      tourTitle: tourTitle || 'Voyage au Rajasthan',
      category: category || 'rajasthan',
      rating: Number(rating) || 5,
      travelDate: travelDate || 'Récent',
      comment,
      status: 'pending'
    };

    if (isMongoConnected()) {
      const review = new Review(reviewData);
      const saved = await review.save();
      return res.status(201).json({
        message: 'Merci infiniment pour votre avis ! Il sera publié dès validation par notre équipe.',
        review: saved
      });
    }

    const saved = {
      _id: `review_${Date.now()}`,
      ...reviewData,
      createdAt: new Date().toISOString()
    };
    memoryStore.reviews.unshift(saved);

    res.status(201).json({
      message: 'Merci infiniment pour votre avis ! Il sera publié dès validation par notre équipe.',
      review: saved
    });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Erreur lors de l\'enregistrement' });
  }
});

// GET /api/reviews/admin/all
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.query;

    if (isMongoConnected()) {
      let query = {};
      if (status && status !== 'all') query.status = status;
      const reviews = await Review.find(query).sort({ createdAt: -1 });
      return res.json(reviews.map(normalizeReview));
    }

    let list = [...memoryStore.reviews];
    if (status && status !== 'all') list = list.filter((r) => r.status === status);
    res.json(list.map(normalizeReview));
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération avis' });
  }
});

// POST /api/reviews/admin
router.post('/admin', protect, adminOnly, async (req, res) => {
  try {
    const data = {
      ...req.body,
      status: req.body.status || 'approved'
    };

    if (isMongoConnected()) {
      const review = new Review(data);
      const saved = await review.save();
      return res.status(201).json(saved);
    }

    const saved = {
      _id: `review_${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString()
    };
    memoryStore.reviews.unshift(saved);
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Erreur création avis' });
  }
});

// PUT /api/reviews/:id
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (isMongoConnected()) {
      let updated;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        updated = await Review.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: false });
      }
      if (!updated) {
        updated = await Review.findOneAndUpdate({ _id: id }, { $set: updateData }, { new: true, runValidators: false });
      }

      if (!updated) {
        const idx = memoryStore.reviews.findIndex((r) => String(r._id) === String(id));
        if (idx !== -1) {
          memoryStore.reviews[idx] = { ...memoryStore.reviews[idx], ...updateData };
          return res.json(normalizeReview(memoryStore.reviews[idx]));
        }
        return res.status(404).json({ message: 'Avis introuvable' });
      }

      return res.json(normalizeReview(updated));
    }

    const idx = memoryStore.reviews.findIndex((r) => String(r._id) === String(id));
    if (idx === -1) return res.status(404).json({ message: 'Avis introuvable' });
    memoryStore.reviews[idx] = { ...memoryStore.reviews[idx], ...updateData };
    res.json(normalizeReview(memoryStore.reviews[idx]));
  } catch (error) {
    console.error('Erreur update review:', error);
    res.status(400).json({ message: error.message || 'Erreur mise à jour' });
  }
});

// DELETE /api/reviews/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected()) {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        await Review.findByIdAndDelete(id);
      } else {
        await Review.deleteOne({ _id: id });
      }
      memoryStore.reviews = memoryStore.reviews.filter((r) => String(r._id) !== String(id));
      return res.json({ message: 'Avis supprimé avec succès' });
    }

    memoryStore.reviews = memoryStore.reviews.filter((r) => String(r._id) !== String(id));
    res.json({ message: 'Avis supprimé avec succès' });
  } catch (error) {
    console.error('Erreur delete review:', error);
    res.status(500).json({ message: 'Erreur suppression' });
  }
});

export default router;
