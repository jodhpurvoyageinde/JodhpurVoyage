import express from 'express';
import Destination from '../models/Destination.js';
import DestinationCategory from '../models/DestinationCategory.js';
import { isMongoConnected, memoryStore } from '../store.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

const createSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

const DEST_IMAGE_FALLBACKS = {
  'rajasthan': '/images/dest-rajasthan.jpg',
  'jodhpur': '/images/dest-jodhpur.jpg',
  'delhi': '/images/dest-tajmahal.jpg',
  'delhi-agra': '/images/dest-tajmahal.jpg',
  'agra': '/images/dest-tajmahal.jpg',
  'varanasi': '/images/dest-varanasi.jpg',
  'amritsar': '/images/dest-jodhpur.jpg',
  'amritsar-punjab': '/images/dest-jodhpur.jpg',
  'dharamsala': '/images/dest-himachal.jpg',
  'dharamsala-himachal': '/images/dest-himachal.jpg',
  'himachal-pradesh': '/images/dest-himachal.jpg',
  'rishikesh': '/images/image-12.jpg',
  'rishikesh-uttarakhand': '/images/image-12.jpg',
  'ladakh': '/images/dest-ladakh.jpg',
  'kerala': '/images/dest-kerala.jpg',
  'tamil-nadu': '/images/dest-karnataka.jpg',
  'karnataka': '/images/dest-karnataka.jpg',
  'gujarat': '/images/dest-gujarat.jpg',
  'goa': '/images/dest-goa.jpg',
  'orissa': '/images/dest-orissa.jpg',
  'madhya-pradesh': '/images/image-8.jpg',
  'darjeeling-sikkim': '/images/slide8-300x176.jpg',
  'nepal': '/images/dest-nepal.jpg',
  'kathmandu': '/images/dest-nepal.jpg',
  'chitwan': '/images/slide8-300x176.jpg',
  'pokhara': '/images/dest-nepal.jpg',
  'bhoutan': '/images/jaipur-travel.jpg',
  'punakha': '/images/Voyage-Jaisalmer.jpg',
  'paro': '/images/image-9.jpg',
  'thimphu': '/images/jaipur-travel.jpg'
};

const normalizeDestination = (d) => {
  const doc = d && d.toObject ? d.toObject() : (d || {});
  const slug = doc.slug || (doc.name ? doc.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-') : doc._id);

  let validImage = doc.image || doc.bannerImage || doc.coverImage;
  if (!validImage || validImage.includes('undefined') || validImage === '/images/dest-punakha.jpg') {
    validImage = DEST_IMAGE_FALLBACKS[slug] || DEST_IMAGE_FALLBACKS[doc.name?.toLowerCase()] || '/images/dest-rajasthan.jpg';
  }

  return {
    ...doc,
    name: doc.name || 'Destination',
    slug: slug,
    tagline: doc.tagline || doc.heroTitle || 'Explorez cette destination féérique',
    shortDescription: doc.shortDescription || doc.metaDescription || doc.description || `${doc.name} - découvrez nos offres et circuits sur mesure.`,
    image: validImage,
    gallery: Array.isArray(doc.gallery) && doc.gallery.length > 0 ? doc.gallery : [validImage],
    highlights: Array.isArray(doc.highlights) && doc.highlights.length > 0 ? doc.highlights : ['Monuments historiques', 'Culture et traditions', 'Circuits avec chauffeur privé'],
    region: (doc.region || doc.categoryName || 'inde-du-nord').toLowerCase().replace(/\s+/g, '-')
  };
};

// GET /api/destinations
router.get('/', async (req, res) => {
  try {
    const { region, featured } = req.query;

    if (isMongoConnected()) {
      let query = { published: { $ne: false } };
      if (region && region !== 'all') query.region = region;
      if (featured === 'true') query.featured = true;
      const destinations = await Destination.find(query).sort({ featured: -1, name: 1 });
      return res.json(destinations.map(normalizeDestination));
    }

    let list = memoryStore.destinations.filter((d) => d.published !== false);
    if (region && region !== 'all') list = list.filter((d) => d.region === region);
    if (featured === 'true') list = list.filter((d) => d.featured);
    res.json(list.map(normalizeDestination));
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération destinations' });
  }
});

// GET /api/destinations/admin/all
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const destinations = await Destination.find().sort({ createdAt: -1 });
      return res.json(destinations.map(normalizeDestination));
    }
    res.json(memoryStore.destinations.map(normalizeDestination));
  } catch (error) {
    res.status(500).json({ message: 'Erreur admin destinations' });
  }
});

// GET /api/destinations/categories
router.get('/categories', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const categories = await DestinationCategory.find({ status: { $ne: 'Inactive' } }).sort({ order: 1, name: 1 });
      return res.json(categories);
    }
    const fallbackCategories = [
      { name: 'Rajasthan', slug: 'rajasthan' },
      { name: 'North India', slug: 'north-india' },
      { name: 'South India', slug: 'south-india' },
      { name: 'Himalaya & Ladakh', slug: 'ladakh' },
      { name: 'Gujarat', slug: 'gujarat' },
      { name: 'Nepal', slug: 'nepal' },
      { name: 'Bhoutan', slug: 'bhoutan' }
    ];
    res.json(fallbackCategories);
  } catch (error) {
    console.error('Erreur récupération catégories:', error);
    res.status(500).json({ message: 'Erreur récupération catégories destinations' });
  }
});

// GET /api/destinations/:identifier
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const cleanId = identifier.toLowerCase();

    if (isMongoConnected()) {
      let destination;
      if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
        destination = await Destination.findById(identifier);
      }
      if (!destination) {
        destination = await Destination.findOne({
          $or: [
            { slug: cleanId },
            { customUrl: cleanId },
            { customUrl: `/${cleanId}` }
          ]
        });
      }
      if (!destination) {
        return res.status(404).json({ message: 'Destination non trouvée' });
      }
      return res.json(normalizeDestination(destination));
    }

    const destination = memoryStore.destinations.find((d) => d.slug === cleanId || d.customUrl === cleanId || d._id === identifier);
    if (!destination) {
      return res.status(404).json({ message: 'Destination non trouvée' });
    }
    res.json(normalizeDestination(destination));
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération destination' });
  }
});

// POST /api/destinations
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const destData = req.body;
    if (!destData.slug && destData.name) {
      destData.slug = createSlug(destData.name);
    }

    if (isMongoConnected()) {
      const destination = new Destination(destData);
      const saved = await destination.save();
      return res.status(201).json(saved);
    }

    const newDest = {
      _id: `dest_${Date.now()}`,
      ...destData,
      createdAt: new Date().toISOString()
    };
    memoryStore.destinations.unshift(newDest);
    res.status(201).json(newDest);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Erreur création destination' });
  }
});

// PUT /api/destinations/:id
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const destination = await Destination.findById(req.params.id);
      if (!destination) return res.status(404).json({ message: 'Destination introuvable' });
      Object.assign(destination, req.body);
      const updated = await destination.save();
      return res.json(updated);
    }

    const idx = memoryStore.destinations.findIndex((d) => d._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Destination introuvable' });
    memoryStore.destinations[idx] = { ...memoryStore.destinations[idx], ...req.body };
    res.json(memoryStore.destinations[idx]);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Erreur mise à jour' });
  }
});

// DELETE /api/destinations/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (isMongoConnected()) {
      await Destination.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Destination supprimée avec succès' });
    }

    memoryStore.destinations = memoryStore.destinations.filter((d) => d._id !== req.params.id);
    res.json({ message: 'Destination supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur suppression' });
  }
});

export default router;
