import express from 'express';
import BlogPost from '../models/BlogPost.js';
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

const normalizeBlogToTour = (blog) => {
  const doc = blog && blog.toObject ? blog.toObject() : (blog || {});
  const cleanTitle = stripHtmlTags(doc.title) || 'Circuit Blog';
  const cleanExcerpt = stripHtmlTags(doc.excerpt || doc.summary || doc.content || '').slice(0, 160);
  const cleanOverview = cleanHtml(doc.content || doc.excerpt || '');

  return {
    _id: doc._id,
    title: cleanTitle,
    slug: doc.slug || (cleanTitle ? cleanTitle.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-') : doc._id),
    subtitle: cleanExcerpt,
    duration: doc.readTime || '5 Jours / 4 Nuits',
    daysCount: 5,
    location: doc.category || 'Inde du Nord',
    region: (doc.category || 'rajasthan').toLowerCase().replace(/\s+/g, '-'),
    theme: doc.category || 'Culture & Patrimoine',
    badge: doc.category || 'Article Blog',
    price: doc.price || 950,
    priceUnit: '€ / pers',
    rating: 4.9,
    reviewCount: 35,
    featured: true,
    published: doc.published !== false,
    image: doc.coverImage || doc.image || '/images/dest-rajasthan.jpg',
    gallery: doc.gallery || [doc.coverImage || '/images/dest-rajasthan.jpg'],
    overview: cleanOverview,
    highlights: Array.isArray(doc.tags) && doc.tags.length > 0 ? doc.tags : ['Points d’intérêt culturels', 'Conseils d’experts', 'Circuit authentique'],
    itinerary: Array.isArray(doc.itinerary) && doc.itinerary.length > 0 ? doc.itinerary : [
      {
        day: 1,
        title: `Découverte: ${cleanTitle}`,
        description: cleanExcerpt || 'Accueil et présentation du séjour.',
        meals: 'Petit-déjeuner inclus',
        accommodation: 'Hôtel de charme'
      },
      {
        day: 2,
        title: 'Exploration & Récit de Voyage',
        description: stripHtmlTags(cleanOverview).slice(0, 300) || 'Visites guidées et découvertes locales.',
        meals: 'Petit-déjeuner & Dîner',
        accommodation: 'Haveli de patrimoine'
      }
    ],
    inclusions: doc.inclusions || ['Chauffeur privé & véhicule climatisé', 'Guides locaux francophones', 'Hébergements de charme'],
    exclusions: doc.exclusions || ['Vols internationaux', 'Frais de visa', 'Dépenses personnelles'],
    createdAt: doc.createdAt
  };
};

// GET /api/tours (fetches from Blog Database)
router.get('/', async (req, res) => {
  try {
    const { region, search, limit } = req.query;

    if (isMongoConnected()) {
      let query = { published: { $ne: false } };
      if (region && region !== 'all') {
        const regRegex = new RegExp(region.replace(/-/g, ' '), 'i');
        query.$or = [
          { category: regRegex },
          { tags: regRegex },
          { title: regRegex }
        ];
      }
      if (search) {
        const sRegex = new RegExp(search.trim(), 'i');
        query.$or = [
          { title: sRegex },
          { excerpt: sRegex },
          { content: sRegex },
          { category: sRegex },
          { tags: sRegex }
        ];
      }

      let bq = BlogPost.find(query).sort({ createdAt: -1 });
      if (limit) bq = bq.limit(Number(limit));
      let rawBlogs = await bq.exec();

      if (rawBlogs.length === 0) {
        let memList = memoryStore.blogs.filter((b) => b.published !== false);
        if (search) {
          const s = search.toLowerCase();
          memList = memList.filter((b) =>
            b.title?.toLowerCase().includes(s) ||
            b.excerpt?.toLowerCase().includes(s) ||
            b.content?.toLowerCase().includes(s) ||
            b.category?.toLowerCase().includes(s)
          );
        }
        if (memList.length > 0) {
          rawBlogs = memList;
        }
      }

      return res.json(rawBlogs.map(normalizeBlogToTour));
    }

    // Memory Store Fallback
    let list = memoryStore.blogs.filter((b) => b.published !== false);
    if (region && region !== 'all') {
      const reg = region.toLowerCase().replace(/-/g, ' ');
      list = list.filter((b) =>
        b.category?.toLowerCase().includes(reg) ||
        b.title?.toLowerCase().includes(reg) ||
        b.tags?.some((t) => t.toLowerCase().includes(reg))
      );
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter((b) =>
        b.title?.toLowerCase().includes(s) ||
        b.excerpt?.toLowerCase().includes(s) ||
        b.content?.toLowerCase().includes(s) ||
        b.category?.toLowerCase().includes(s)
      );
    }
    if (limit) list = list.slice(0, Number(limit));
    res.json(list.map(normalizeBlogToTour));
  } catch (error) {
    console.error('Erreur get tours:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des circuits depuis le blog' });
  }
});

// GET /api/tours/admin/all
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const blogs = await BlogPost.find().sort({ createdAt: -1 });
      return res.json(blogs.map(normalizeBlogToTour));
    }
    res.json(memoryStore.blogs.map(normalizeBlogToTour));
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération circuits' });
  }
});

// GET /api/tours/:identifier
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const cleanId = identifier.toLowerCase();

    if (isMongoConnected()) {
      let blog;
      if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
        blog = await BlogPost.findById(identifier);
      }
      if (!blog) {
        blog = await BlogPost.findOne({
          $or: [
            { slug: cleanId },
            { customUrl: cleanId },
            { customUrl: `/${cleanId}` }
          ]
        });
      }
      if (!blog) {
        blog = memoryStore.blogs.find((b) => b.slug === cleanId || b.customUrl === cleanId || b._id === identifier);
      }
      if (!blog) {
        return res.status(404).json({ message: 'Circuit (Blog) non trouvé' });
      }
      return res.json(normalizeBlogToTour(blog));
    }

    const blog = memoryStore.blogs.find((b) => b.slug === cleanId || b.customUrl === cleanId || b._id === identifier);
    if (!blog) {
      return res.status(404).json({ message: 'Circuit (Blog) non trouvé' });
    }
    res.json(normalizeBlogToTour(blog));
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
      const blog = new BlogPost({
        title: tourData.title,
        slug: tourData.slug,
        excerpt: tourData.subtitle || tourData.overview || '',
        content: tourData.overview || tourData.subtitle || '',
        coverImage: tourData.image || '/images/dest-rajasthan.jpg',
        category: tourData.location || tourData.region || 'Tour Package',
        readTime: tourData.duration || '5 min de lecture',
        tags: tourData.highlights || []
      });
      const created = await blog.save();
      return res.status(201).json(normalizeBlogToTour(created));
    }

    const newBlog = {
      _id: `blog_${Date.now()}`,
      title: tourData.title,
      slug: tourData.slug,
      excerpt: tourData.subtitle || tourData.overview || '',
      content: tourData.overview || tourData.subtitle || '',
      coverImage: tourData.image || '/images/dest-rajasthan.jpg',
      category: tourData.location || tourData.region || 'Tour Package',
      readTime: tourData.duration || '5 min de lecture',
      tags: tourData.highlights || [],
      createdAt: new Date().toISOString()
    };
    memoryStore.blogs.unshift(newBlog);
    res.status(201).json(normalizeBlogToTour(newBlog));
  } catch (error) {
    res.status(400).json({ message: error.message || 'Erreur création circuit' });
  }
});

// PUT /api/tours/:id
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const blog = await BlogPost.findById(req.params.id);
      if (!blog) return res.status(404).json({ message: 'Circuit introuvable' });
      Object.assign(blog, req.body);
      const updated = await blog.save();
      return res.json(normalizeBlogToTour(updated));
    }

    const idx = memoryStore.blogs.findIndex((b) => b._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Circuit introuvable' });
    memoryStore.blogs[idx] = { ...memoryStore.blogs[idx], ...req.body };
    res.json(normalizeBlogToTour(memoryStore.blogs[idx]));
  } catch (error) {
    res.status(400).json({ message: error.message || 'Erreur mise à jour' });
  }
});

// DELETE /api/tours/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (isMongoConnected()) {
      await BlogPost.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Circuit supprimé avec succès' });
    }

    memoryStore.blogs = memoryStore.blogs.filter((b) => b._id !== req.params.id);
    res.json({ message: 'Circuit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur suppression circuit' });
  }
});

export default router;

