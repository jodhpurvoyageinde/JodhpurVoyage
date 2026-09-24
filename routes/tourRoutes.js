import express from 'express';
import Tour from '../models/Tour.js';
import { isMongoConnected, memoryStore } from '../store.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

const createSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

const getRegionFilterList = (region) => {
  if (!region || region === 'all') return null;
  if (region === 'inde-du-nord') {
    return ['inde-du-nord', 'rajasthan', 'ladakh'];
  }
  if (region === 'inde-du-sud') {
    return ['inde-du-sud', 'gujarat', 'tamil-nadu', 'kerala', 'karnataka'];
  }
  if (region === 'rajasthan') {
    return ['rajasthan'];
  }
  if (region === 'ladakh') {
    return ['ladakh'];
  }
  if (region === 'gujarat') {
    return ['gujarat'];
  }
  if (region === 'nepal') {
    return ['nepal'];
  }
  if (region === 'bhoutan') {
    return ['bhoutan'];
  }
  return [region];
};

const normalizeTour = (t) => {
  const doc = t && t.toObject ? t.toObject() : (t || {});
  const { price, priceUnit, pricing, ...safeDoc } = doc;
  return {
    ...safeDoc,
    title: doc.title || doc.name || 'Circuit Inde',
    slug: doc.slug || (doc.title ? doc.title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-') : doc._id),
    subtitle: doc.subtitle || doc.tagline || (doc.overview ? doc.overview.slice(0, 110) : ''),
    duration: doc.duration || (doc.daysCount ? `${doc.daysCount} Jours / ${doc.daysCount - 1} Nuits` : '10 Jours / 9 Nuits'),
    location: doc.location || doc.cityName || doc.category || 'Inde du Nord',
    image: doc.image || doc.coverImage || doc.bannerImage || '/images/dest-rajasthan.jpg',
    region: (doc.region || doc.category || 'inde-du-nord').toLowerCase().replace(/\s+/g, '-'),
    itinerary: Array.isArray(doc.itinerary) && doc.itinerary.length > 0 ? doc.itinerary : [],
    highlights: Array.isArray(doc.highlights) && doc.highlights.length > 0 ? doc.highlights : []
  };
};

// GET /api/tours
router.get('/', async (req, res) => {
  try {
    const { region, theme, search, featured, limit } = req.query;
    const regionList = getRegionFilterList(region);

    if (isMongoConnected()) {
      let query = { published: { $ne: false } };
      if (regionList) {
        query.region = { $in: regionList };
      }
      if (theme && theme !== 'all') query.theme = new RegExp(theme, 'i');
      if (featured === 'true') query.featured = true;
      if (search) {
        const sRegex = new RegExp(search.trim(), 'i');
        query.$or = [
          { title: sRegex },
          { location: sRegex },
          { cityName: sRegex },
          { overview: sRegex },
          { subtitle: sRegex },
          { region: sRegex },
          { category: sRegex },
          { highlights: sRegex },
          { 'itinerary.title': sRegex },
          { 'itinerary.description': sRegex },
          { 'itinerary.desc': sRegex }
        ];
      }

      let q = Tour.find(query).sort({ featured: -1, createdAt: -1 });
      if (limit) q = q.limit(Number(limit));
      let rawTours = await q.exec();

      // If specific search or region yielded 0 in MongoDB, check memoryStore fallback
      if (rawTours.length === 0) {
        let memList = memoryStore.tours.filter((t) => t.published !== false);
        if (regionList) {
          memList = memList.filter((t) => regionList.includes(t.region));
        }
        if (search) {
          const s = search.toLowerCase();
          memList = memList.filter((t) =>
            t.title?.toLowerCase().includes(s) ||
            t.location?.toLowerCase().includes(s) ||
            t.cityName?.toLowerCase().includes(s) ||
            t.overview?.toLowerCase().includes(s) ||
            t.subtitle?.toLowerCase().includes(s) ||
            t.region?.toLowerCase().includes(s) ||
            t.highlights?.some((h) => h.toLowerCase().includes(s)) ||
            t.itinerary?.some((i) => i.title?.toLowerCase().includes(s) || i.description?.toLowerCase().includes(s))
          );
        }
        if (memList.length > 0) {
          rawTours = memList;
        }
      }

      return res.json(rawTours.map(normalizeTour));
    }

    // Memory Store Fallback
    let list = memoryStore.tours.filter((t) => t.published !== false);
    if (regionList) {
      list = list.filter((t) => regionList.includes(t.region));
    }
    if (theme && theme !== 'all') list = list.filter((t) => t.theme?.toLowerCase().includes(theme.toLowerCase()));
    if (featured === 'true') list = list.filter((t) => t.featured);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter((t) =>
        t.title?.toLowerCase().includes(s) ||
        t.location?.toLowerCase().includes(s) ||
        t.cityName?.toLowerCase().includes(s) ||
        t.overview?.toLowerCase().includes(s) ||
        t.subtitle?.toLowerCase().includes(s) ||
        t.region?.toLowerCase().includes(s) ||
        t.highlights?.some((h) => h.toLowerCase().includes(s)) ||
        t.itinerary?.some((i) => i.title?.toLowerCase().includes(s) || i.description?.toLowerCase().includes(s))
      );
    }
    if (limit) list = list.slice(0, Number(limit));
    res.json(list.map(normalizeTour));
  } catch (error) {
    console.error('Erreur get tours:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des circuits' });
  }
});

// GET /api/tours/admin/all
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const tours = await Tour.find().sort({ createdAt: -1 });
      return res.json(tours.map(normalizeTour));
    }
    res.json(memoryStore.tours.map(normalizeTour));
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération circuits' });
  }
});

// GET /api/tours/:identifier
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;

    if (isMongoConnected()) {
      let tour;
      if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
        tour = await Tour.findById(identifier);
      }
      if (!tour) {
        tour = await Tour.findOne({ slug: identifier });
      }
      if (!tour) {
        tour = memoryStore.tours.find((t) => t.slug === identifier || t._id === identifier);
      }
      if (!tour) {
        return res.status(404).json({ message: 'Circuit non trouvé' });
      }
      return res.json(normalizeTour(tour));
    }

    const tour = memoryStore.tours.find((t) => t.slug === identifier || t._id === identifier);
    if (!tour) {
      return res.status(404).json({ message: 'Circuit non trouvé' });
    }
    res.json(normalizeTour(tour));
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du circuit' });
  }
});

// POST /api/tours
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const tourData = req.body;
    if (!tourData.slug && tourData.title) {
      tourData.slug = createSlug(tourData.title);
    }

    if (isMongoConnected()) {
      const tour = new Tour(tourData);
      const created = await tour.save();
      return res.status(201).json(created);
    }

    const newTour = {
      _id: `tour_${Date.now()}`,
      ...tourData,
      createdAt: new Date().toISOString()
    };
    memoryStore.tours.unshift(newTour);
    res.status(201).json(newTour);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Erreur création circuit' });
  }
});

// PUT /api/tours/:id
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const tour = await Tour.findById(req.params.id);
      if (!tour) return res.status(404).json({ message: 'Circuit introuvable' });
      Object.assign(tour, req.body);
      const updated = await tour.save();
      return res.json(updated);
    }

    const idx = memoryStore.tours.findIndex((t) => t._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Circuit introuvable' });
    memoryStore.tours[idx] = { ...memoryStore.tours[idx], ...req.body };
    res.json(memoryStore.tours[idx]);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Erreur mise à jour' });
  }
});

// DELETE /api/tours/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (isMongoConnected()) {
      await Tour.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Circuit supprimé avec succès' });
    }

    memoryStore.tours = memoryStore.tours.filter((t) => t._id !== req.params.id);
    res.json({ message: 'Circuit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur suppression circuit' });
  }
});

export default router;
