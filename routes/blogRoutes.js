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

const cleanHtml = (rawStr) => {
  if (!rawStr || typeof rawStr !== 'string') return '';
  return rawStr
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/\[\/?vc_[^\]]*\]/gi, '')
    .trim();
};

const stripHtmlTags = (rawStr) => {
  if (!rawStr || typeof rawStr !== 'string') return '';
  return cleanHtml(rawStr)
    .replace(/<[^>]*>?/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const normalizeTourToBlog = (tour) => {
  const doc = tour && tour.toObject ? tour.toObject() : (tour || {});
  const cleanTitle = stripHtmlTags(doc.title) || 'Article Circuit Inde';
  const cleanSubtitle = stripHtmlTags(doc.subtitle || doc.overview || '').slice(0, 160);

  let formattedContent = cleanHtml(doc.overview || doc.subtitle || '');
  if (Array.isArray(doc.itinerary) && doc.itinerary.length > 0) {
    formattedContent += '\n\n### Itinéraire Détaillé du Voyage\n\n' +
      doc.itinerary.map((i) => `**Jour ${i.day}: ${stripHtmlTags(i.title)}**\n${stripHtmlTags(i.description)}`).join('\n\n');
  }

  return {
    _id: doc._id,
    title: cleanTitle,
    slug: doc.slug || (cleanTitle ? cleanTitle.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-') : doc._id),
    excerpt: cleanSubtitle || 'Découvrez cet itinéraire unique en Inde.',
    content: formattedContent,
    coverImage: doc.image || doc.coverImage || '/images/dest-rajasthan.jpg',
    category: doc.theme || (doc.region ? doc.region.toUpperCase() : 'Conseils Voyage'),
    readTime: doc.duration || '8 min de lecture',
    author: {
      name: 'Jodhpur Voyage Team',
      role: 'Spécialiste Circuits Inde',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    tags: Array.isArray(doc.highlights) && doc.highlights.length > 0 ? doc.highlights.map(stripHtmlTags) : [doc.location || 'Inde'],
    published: doc.published !== false,
    createdAt: doc.createdAt || new Date().toISOString()
  };
};

// GET /api/blogs (fetches from Tour Database)
router.get('/', async (req, res) => {
  try {
    const { category, search, tag, limit } = req.query;

    if (isMongoConnected()) {
      let query = { published: { $ne: false } };
      if (category && category !== 'all') {
        const cRegex = new RegExp(category, 'i');
        query.$or = [
          { theme: cRegex },
          { region: cRegex },
          { location: cRegex }
        ];
      }
      if (tag) {
        query.highlights = tag;
      }
      if (search) {
        const sRegex = new RegExp(search.trim(), 'i');
        query.$or = [
          { title: sRegex },
          { subtitle: sRegex },
          { overview: sRegex },
          { location: sRegex },
          { region: sRegex }
        ];
      }

      let tq = Tour.find(query).sort({ createdAt: -1 });
      if (limit) tq = tq.limit(Number(limit));
      let rawTours = await tq.exec();

      if (rawTours.length === 0) {
        let memList = memoryStore.tours.filter((t) => t.published !== false);
        if (search) {
          const s = search.toLowerCase();
          memList = memList.filter((t) =>
            t.title?.toLowerCase().includes(s) ||
            t.subtitle?.toLowerCase().includes(s) ||
            t.overview?.toLowerCase().includes(s) ||
            t.location?.toLowerCase().includes(s)
          );
        }
        if (memList.length > 0) {
          rawTours = memList;
        }
      }

      return res.json(rawTours.map(normalizeTourToBlog));
    }

    // Memory Store Fallback
    let list = memoryStore.tours.filter((t) => t.published !== false);
    if (category && category !== 'all') {
      const c = category.toLowerCase();
      list = list.filter((t) =>
        t.theme?.toLowerCase().includes(c) ||
        t.region?.toLowerCase().includes(c) ||
        t.location?.toLowerCase().includes(c)
      );
    }
    if (tag) {
      list = list.filter((t) => t.highlights?.includes(tag));
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter((t) =>
        t.title?.toLowerCase().includes(s) ||
        t.subtitle?.toLowerCase().includes(s) ||
        t.overview?.toLowerCase().includes(s) ||
        t.location?.toLowerCase().includes(s)
      );
    }
    if (limit) list = list.slice(0, Number(limit));
    res.json(list.map(normalizeTourToBlog));
  } catch (error) {
    console.error('Erreur get blogs:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des articles depuis la base tour' });
  }
});

// GET /api/blogs/admin/all
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const tours = await Tour.find().sort({ createdAt: -1 });
      return res.json(tours.map(normalizeTourToBlog));
    }
    res.json(memoryStore.tours.map(normalizeTourToBlog));
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération articles admin' });
  }
});

// GET /api/blogs/:identifier
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const cleanId = identifier.toLowerCase();

    if (isMongoConnected()) {
      let tour;
      if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
        tour = await Tour.findById(identifier);
      }
      if (!tour) {
        tour = await Tour.findOne({
          $or: [
            { slug: cleanId },
            { customUrl: cleanId },
            { customUrl: `/${cleanId}` }
          ]
        });
      }
      if (!tour) {
        tour = memoryStore.tours.find((t) => t.slug === cleanId || t.customUrl === cleanId || t._id === identifier);
      }
      if (!tour) {
        return res.status(404).json({ message: 'Article (Tour) non trouvé' });
      }
      return res.json(normalizeTourToBlog(tour));
    }

    const tour = memoryStore.tours.find((t) => t.slug === cleanId || t.customUrl === cleanId || t._id === identifier);
    if (!tour) {
      return res.status(404).json({ message: 'Article (Tour) non trouvé' });
    }
    res.json(normalizeTourToBlog(tour));
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération article' });
  }
});

// POST /api/blogs
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const blogData = req.body;
    if (!blogData.slug && blogData.title) {
      blogData.slug = createSlug(blogData.title);
    }

    if (isMongoConnected()) {
      const tour = new Tour({
        title: blogData.title,
        slug: blogData.slug,
        subtitle: blogData.excerpt,
        overview: blogData.content || blogData.excerpt,
        image: blogData.coverImage || '/images/dest-rajasthan.jpg',
        location: blogData.category || 'Inde',
        duration: blogData.readTime || '5 Jours',
        highlights: blogData.tags || []
      });
      const saved = await tour.save();
      return res.status(201).json(normalizeTourToBlog(saved));
    }

    const saved = {
      _id: `tour_${Date.now()}`,
      title: blogData.title,
      slug: blogData.slug,
      subtitle: blogData.excerpt,
      overview: blogData.content || blogData.excerpt,
      image: blogData.coverImage || '/images/dest-rajasthan.jpg',
      location: blogData.category || 'Inde',
      duration: blogData.readTime || '5 Jours',
      highlights: blogData.tags || [],
      createdAt: new Date().toISOString()
    };
    memoryStore.tours.unshift(saved);
    res.status(201).json(normalizeTourToBlog(saved));
  } catch (error) {
    res.status(400).json({ message: error.message || 'Erreur création article' });
  }
});

// PUT /api/blogs/:id
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const tour = await Tour.findById(req.params.id);
      if (!tour) return res.status(404).json({ message: 'Article introuvable' });
      Object.assign(tour, req.body);
      const updated = await tour.save();
      return res.json(normalizeTourToBlog(updated));
    }

    const idx = memoryStore.tours.findIndex((t) => t._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Article introuvable' });
    memoryStore.tours[idx] = { ...memoryStore.tours[idx], ...req.body };
    res.json(normalizeTourToBlog(memoryStore.tours[idx]));
  } catch (error) {
    res.status(400).json({ message: error.message || 'Erreur mise à jour' });
  }
});

// DELETE /api/blogs/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (isMongoConnected()) {
      await Tour.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Article supprimé avec succès' });
    }

    memoryStore.tours = memoryStore.tours.filter((t) => t._id !== req.params.id);
    res.json({ message: 'Article supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur suppression' });
  }
});

export default router;

