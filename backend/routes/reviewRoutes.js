import express from 'express';
import Review from '../models/Review.js';
import { isMongoConnected, memoryStore } from '../store.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { defaultReviewsData } from '../seed/reviewsSeedData.js';

const router = express.Router();

const normalizeReview = (r) => {
  const doc = r && r.toObject ? r.toObject() : (r || {});
  const authorName = doc.authorName || doc.author?.name || doc.name || 'Client Jodhpur Voyage';
  const authorAvatar = doc.avatar || (authorName ? authorName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'JV');
  const cat = (doc.category || 'rajasthan').toLowerCase();

  let defaultTagIcon = 'fas fa-map-marker-alt';
  if (cat.includes('ladakh') || cat.includes('himalaya')) defaultTagIcon = 'fas fa-mountain';
  else if (cat.includes('sud') || cat.includes('kerala')) defaultTagIcon = 'fas fa-water';
  else if (cat.includes('nord')) defaultTagIcon = 'fas fa-place-of-worship';
  else if (cat.includes('gujarat')) defaultTagIcon = 'fas fa-compass';

  let defaultImg = '/images/image-8.jpg';
  if (cat === 'rajasthan') defaultImg = '/images/Voyage-Jaisalmer.jpg';
  else if (cat === 'ladakh') defaultImg = '/images/dest-ladakh.jpg';
  else if (cat === 'inde-du-nord') defaultImg = '/images/dest-himachal.jpg';
  else if (cat === 'inde-du-sud') defaultImg = '/images/dest-kerala.jpg';
  else if (cat === 'gujarat') defaultImg = '/images/dest-gujarat.jpg';

  const tTitle = doc.tourTitle || doc.tourName || doc.title || 'Voyage en Inde';
  const tCity = doc.authorCity || doc.author?.location || doc.location || 'France';
  const rawComment = doc.comment || doc.excerpt || doc.content || '';
  const cleanExcerpt = doc.excerpt || (rawComment ? (rawComment.startsWith('"') ? rawComment : `"${rawComment}"`) : '');

  return {
    _id: doc._id,
    id: String(doc._id || doc.id),
    authorName,
    authorAvatar,
    authorCity: tCity,
    tourTitle: tTitle,
    title: doc.title || tTitle,
    category: cat,
    rating: typeof doc.rating === 'number' ? doc.rating : 5,
    travelDate: doc.travelDate || (doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : 'Janvier 2026'),
    reviewDate: doc.reviewDate || `Avis Vérifié • ${doc.travelDate || 'Organisé par Jodhpur Voyage'}`,
    comment: rawComment,
    excerpt: cleanExcerpt,
    image: doc.image || doc.img || defaultImg,
    img: doc.img || doc.image || defaultImg,
    fallbackImg: doc.fallbackImg || defaultImg,
    tag: doc.tag || `${tTitle} • ${tCity}`,
    tagIcon: doc.tagIcon || defaultTagIcon,
    link: doc.link || (cat === 'rajasthan' ? '/tour-rajasthan' : '/tours'),
    status: doc.status === 'Published' || doc.status === 'approved' ? 'approved' : (doc.status || 'approved'),
    featured: Boolean(doc.featured === true),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
};

// GET /api/reviews (Public approved reviews)
router.get('/', async (req, res) => {
  try {
    const { category, search, limit } = req.query;

    if (isMongoConnected()) {
      // Auto-seed default reviews if collection is empty
      const countTotal = await Review.countDocuments();
      if (countTotal === 0 && defaultReviewsData.length > 0) {
        await Review.insertMany(defaultReviewsData);
      }

      let query = { status: { $ne: 'rejected' } };
      if (category && category !== 'all') query.category = category;
      if (search) {
        query.$or = [
          { authorName: { $regex: search, $options: 'i' } },
          { authorCity: { $regex: search, $options: 'i' } },
          { comment: { $regex: search, $options: 'i' } },
          { excerpt: { $regex: search, $options: 'i' } },
          { tourTitle: { $regex: search, $options: 'i' } },
          { title: { $regex: search, $options: 'i' } },
          { tag: { $regex: search, $options: 'i' } }
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

    if (!memoryStore.reviews || memoryStore.reviews.length === 0) {
      memoryStore.reviews = defaultReviewsData.map((r, i) => ({
        _id: `review_${i + 1}`,
        ...r,
        createdAt: new Date().toISOString()
      }));
    }

    let list = memoryStore.reviews.filter((r) => r.status === 'approved' || r.status === 'Published');
    if (category && category !== 'all') list = list.filter((r) => r.category === category);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter((r) =>
        r.authorName?.toLowerCase().includes(s) ||
        r.comment?.toLowerCase().includes(s) ||
        r.tourTitle?.toLowerCase().includes(s) ||
        r.tag?.toLowerCase().includes(s)
      );
    }
    const totalCount = list.length;
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

    const cat = (category || 'rajasthan').toLowerCase();
    let defaultImg = '/images/image-8.jpg';
    if (cat === 'rajasthan') defaultImg = '/images/Voyage-Jaisalmer.jpg';
    else if (cat === 'ladakh') defaultImg = '/images/dest-ladakh.jpg';
    else if (cat === 'inde-du-nord') defaultImg = '/images/dest-himachal.jpg';
    else if (cat === 'inde-du-sud') defaultImg = '/images/dest-kerala.jpg';

    const reviewData = {
      authorName,
      authorCity: authorCity || 'France',
      tourTitle: tourTitle || 'Voyage en Inde',
      title: tourTitle || 'Voyage en Inde',
      category: cat,
      rating: Number(rating) || 5,
      travelDate: travelDate || 'Récent',
      comment,
      excerpt: comment.startsWith('"') ? comment : `"${comment}"`,
      image: defaultImg,
      img: defaultImg,
      fallbackImg: defaultImg,
      tag: `${tourTitle || 'Voyage en Inde'} • ${authorCity || 'Avis Client'}`,
      link: cat === 'rajasthan' ? '/tour-rajasthan' : '/tours',
      status: 'pending'
    };

    if (isMongoConnected()) {
      const review = new Review(reviewData);
      const saved = await review.save();
      return res.status(201).json({
        message: 'Merci infiniment pour votre avis ! Il sera publié dès validation par notre équipe.',
        review: normalizeReview(saved)
      });
    }

    const saved = {
      _id: `review_${Date.now()}`,
      ...reviewData,
      createdAt: new Date().toISOString()
    };
    if (!memoryStore.reviews) memoryStore.reviews = [];
    memoryStore.reviews.unshift(saved);

    res.status(201).json({
      message: 'Merci infiniment pour votre avis ! Il sera publié dès validation par notre équipe.',
      review: normalizeReview(saved)
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
      const countTotal = await Review.countDocuments();
      if (countTotal === 0 && defaultReviewsData.length > 0) {
        await Review.insertMany(defaultReviewsData);
      }

      let query = {};
      if (status && status !== 'all') query.status = status;
      const reviews = await Review.find(query).sort({ createdAt: -1 });
      return res.json(reviews.map(normalizeReview));
    }

    if (!memoryStore.reviews || memoryStore.reviews.length === 0) {
      memoryStore.reviews = defaultReviewsData.map((r, i) => ({
        _id: `review_${i + 1}`,
        ...r,
        createdAt: new Date().toISOString()
      }));
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
    const data = { ...req.body };
    delete data._id;
    if (!data.status) data.status = 'approved';

    if (isMongoConnected()) {
      const review = new Review(data);
      const saved = await review.save();
      return res.status(201).json(normalizeReview(saved));
    }

    const saved = {
      _id: `review_${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString()
    };
    if (!memoryStore.reviews) memoryStore.reviews = [];
    memoryStore.reviews.unshift(saved);
    res.status(201).json(normalizeReview(saved));
  } catch (error) {
    res.status(400).json({ message: error.message || 'Erreur création avis' });
  }
});

// PUT /api/reviews/:id
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData._id; // CRITICAL: Prevent Mongo immutable _id error

    if (isMongoConnected()) {
      let updated;
      if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
        updated = await Review.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: false });
      }
      if (!updated) {
        updated = await Review.findOneAndUpdate({ _id: id }, { $set: updateData }, { new: true, runValidators: false });
      }

      if (!updated) {
        const idx = (memoryStore.reviews || []).findIndex((r) => String(r._id) === String(id));
        if (idx !== -1) {
          memoryStore.reviews[idx] = { ...memoryStore.reviews[idx], ...updateData };
          return res.json(normalizeReview(memoryStore.reviews[idx]));
        }
        return res.status(404).json({ message: 'Avis introuvable' });
      }

      return res.json(normalizeReview(updated));
    }

    const idx = (memoryStore.reviews || []).findIndex((r) => String(r._id) === String(id));
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
      if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
        await Review.findByIdAndDelete(id);
      } else {
        await Review.deleteOne({ _id: id });
      }
      if (memoryStore.reviews) {
        memoryStore.reviews = memoryStore.reviews.filter((r) => String(r._id) !== String(id));
      }
      return res.json({ message: 'Avis supprimé avec succès' });
    }

    if (memoryStore.reviews) {
      memoryStore.reviews = memoryStore.reviews.filter((r) => String(r._id) !== String(id));
    }
    res.json({ message: 'Avis supprimé avec succès' });
  } catch (error) {
    console.error('Erreur delete review:', error);
    res.status(500).json({ message: 'Erreur suppression' });
  }
});

export default router;
