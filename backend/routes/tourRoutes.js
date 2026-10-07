import express from 'express';
import Tour from '../models/Tour.js';
import { isMongoConnected, memoryStore } from '../store.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

const createSlug = (text) => {
  return (text || '')
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

const normalizeTour = (tour) => {
  if (!tour) return null;
  const doc = tour && tour.toObject ? tour.toObject() : tour;

  const cleanTitle = stripHtmlTags(doc.title) || 'Circuit Touristique';
  const cleanExcerpt = stripHtmlTags(doc.subtitle || doc.excerpt || doc.overview || '').trim();

  let rawContent = doc.overview || doc.content || doc.subtitle || '';
  let cleanOverview = cleanHtml(rawContent);

  // Format connected cities array
  let cities = [];
  if (Array.isArray(doc.cities) && doc.cities.length > 0) {
    cities = doc.cities.map(c => {
      if (typeof c === 'string') {
        const clean = stripHtmlTags(c).trim();
        return { name: clean, slug: clean.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-') };
      }
      return {
        cityId: c.cityId || c._id || '',
        name: stripHtmlTags(c.name || ''),
        slug: c.slug || (c.name ? c.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-') : '')
      };
    }).filter(c => c.name);
  } else if (doc.cityName) {
    cities = [{
      cityId: doc.cityId || '',
      name: stripHtmlTags(doc.cityName),
      slug: (doc.cityName || '').toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-')
    }];
  } else if (doc.location && typeof doc.location === 'string') {
    const parts = doc.location.split(',').map(s => s.trim()).filter(Boolean);
    if (parts.length > 0) {
      cities = parts.map(p => ({
        cityId: '',
        name: stripHtmlTags(p),
        slug: p.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-')
      }));
    }
  }

  const validHighlights = Array.isArray(doc.highlights) && doc.highlights.length > 0
    ? doc.highlights
    : (Array.isArray(doc.tags) && doc.tags.length > 0 ? doc.tags : [
      `Circuit 100% privatif et personnalisable à ${doc.category || 'destination'}`,
      'Chauffeur privé expérimenté & véhicule climatisé',
      'Hébergements de charme avec petits-déjeuners inclus',
      'Assistance locale francophone 24h/24 et 7j/7'
    ]);

  return {
    _id: doc._id,
    title: cleanTitle,
    slug: doc.slug || (cleanTitle ? createSlug(cleanTitle) : String(doc._id)),
    customUrl: doc.customUrl || '',
    subtitle: doc.subtitle || cleanExcerpt,
    duration: doc.duration || '10 Jours / 9 Nuits',
    daysCount: doc.daysCount || 10,
    location: doc.location || (cities.length > 0 ? cities.map(c => c.name).join(', ') : 'Inde'),
    category: doc.category || doc.region || 'Rajasthan',
    categoryId: doc.categoryId || '',
    cities: cities,
    region: (doc.region || doc.category || 'rajasthan').toLowerCase().replace(/\s+/g, '-'),
    theme: doc.theme || 'Culture & Patrimoine',
    badge: doc.badge || 'Circuit Privé',
    price: doc.price || 950,
    priceUnit: doc.priceUnit || '€ / pers',
    rating: doc.rating || 4.9,
    reviewCount: doc.reviewCount || 35,
    featured: Boolean(doc.featured === true),
    published: doc.published !== false,
    image: doc.image || doc.coverImage || '/images/dest-rajasthan.jpg',
    gallery: Array.isArray(doc.gallery) && doc.gallery.length > 0 ? doc.gallery : [doc.image || '/images/dest-rajasthan.jpg'],
    overview: cleanOverview,
    highlights: validHighlights,
    itinerary: Array.isArray(doc.itinerary) ? doc.itinerary : [],
    inclusions: Array.isArray(doc.inclusions) ? doc.inclusions : [
      'Chauffeur privé & véhicule climatisé',
      'Guides locaux francophones',
      'Hébergements de charme'
    ],
    exclusions: Array.isArray(doc.exclusions) ? doc.exclusions : [
      'Vols internationaux',
      'Frais de visa',
      'Dépenses personnelles'
    ],
    faq: Array.isArray(doc.faq) ? doc.faq : [],
    seoTitle: doc.seoTitle || `${cleanTitle} | Circuit ${doc.duration || ''} | Jodhpur Voyage`,
    seoKeywords: doc.seoKeywords || `${cleanTitle.toLowerCase()}, circuit ${doc.category?.toLowerCase() || 'inde'}, voyage sur mesure, chauffeur prive inde`,
    seoDescription: doc.seoDescription || cleanExcerpt || `Réservez le circuit ${cleanTitle} à ${doc.category || 'l\'Inde'} avec chauffeur privé, hébergements de charme et assistance 24h/24.`,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
};

// GET /api/tours (fetches from Tour database / Tour model)
router.get('/', async (req, res) => {
  try {
    const { region, city, search, limit, featured } = req.query;

    if (isMongoConnected()) {
      const conditions = [{ published: { $ne: false } }];

      if (featured !== undefined) {
        conditions.push({ featured: featured === 'true' || featured === true });
      }

      if (region && region !== 'all') {
        const regNorm = region.toLowerCase().replace(/_/g, '-');
        let regPattern;
        if (regNorm === 'inde-du-nord' || regNorm === 'nord') {
          regPattern = 'inde[\\s-]*du[\\s-]*nord|nord|rajasthan|delhi|agra|varanasi|amritsar|dharamsala|rishikesh|ladakh|himachal|punjab|kashmir|spiti';
        } else if (regNorm === 'inde-du-sud' || regNorm === 'sud') {
          regPattern = 'inde[\\s-]*du[\\s-]*sud|sud|kerala|tamil|karnataka|goa|orissa';
        } else if (regNorm === 'inde-de-louest' || regNorm === 'inde-du-ouest' || regNorm === 'ouest') {
          regPattern = 'inde[\\s-]*d[ue][\\s-]*l?ouest|ouest|gujarat|kutch|palitana|ahmedabad|mumbai';
        } else if (regNorm === 'nepal') {
          regPattern = 'n[ée]pal|katmandou|kathmandu|chitwan|pokhara';
        } else if (regNorm === 'bhoutan') {
          regPattern = 'bhoutan|thimphu|paro|punakha';
        } else if (regNorm === 'ladakh' || regNorm === 'himalaya') {
          regPattern = 'ladakh|himalaya|spiti|zanskar|leh';
        } else if (regNorm === 'rajasthan') {
          regPattern = 'rajasthan|jodhpur|jaipur|udaipur|jaisalmer';
        } else if (regNorm === 'gujarat') {
          regPattern = 'gujarat|kutch|palitana';
        } else {
          regPattern = region.replace(/-/g, ' ');
        }
        const regRegex = new RegExp(regPattern, 'i');
        conditions.push({
          $or: [
            { category: regRegex },
            { region: regRegex },
            { location: regRegex },
            { highlights: regRegex },
            { title: regRegex }
          ]
        });
      }

      if (city && city !== 'all') {
        const rawCity = city.trim();
        const cityClean = rawCity.replace(/-/g, ' ');
        const citySlug = rawCity.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
        const cityRegex = new RegExp(cityClean, 'i');
        const slugRegex = new RegExp(citySlug, 'i');
        conditions.push({
          $or: [
            { 'cities.name': cityRegex },
            { 'cities.slug': slugRegex },
            { cityName: cityRegex },
            { location: cityRegex },
            { title: cityRegex },
            { category: cityRegex },
            { region: cityRegex },
            { highlights: cityRegex },
            { overview: cityRegex },
            { 'itinerary.title': cityRegex },
            { 'itinerary.description': cityRegex }
          ]
        });
      }

      if (search && search.trim()) {
        const sRegex = new RegExp(search.trim(), 'i');
        conditions.push({
          $or: [
            { title: sRegex },
            { subtitle: sRegex },
            { overview: sRegex },
            { category: sRegex },
            { location: sRegex },
            { region: sRegex },
            { theme: sRegex },
            { badge: sRegex },
            { highlights: sRegex },
            { 'cities.name': sRegex },
            { 'itinerary.title': sRegex },
            { 'itinerary.description': sRegex },
            { seoTitle: sRegex },
            { seoKeywords: sRegex },
            { seoDescription: sRegex }
          ]
        });
      }

      const query = conditions.length > 1 ? { $and: conditions } : conditions[0];

      let tq = Tour.find(query).sort({ createdAt: -1 });
      if (limit) tq = tq.limit(Number(limit));
      let rawTours = await tq.exec();

      return res.json(rawTours.map(normalizeTour));
    }

    // Memory Store Fallback
    let list = (memoryStore.tours || []).filter((t) => t.published !== false);
    if (featured !== undefined) {
      list = list.filter((t) => t.featured === (featured === 'true' || featured === true));
    }
    if (region && region !== 'all') {
      const reg = region.toLowerCase().replace(/-/g, ' ');
      list = list.filter((t) =>
        t.category?.toLowerCase().includes(reg) ||
        t.region?.toLowerCase().includes(reg) ||
        t.location?.toLowerCase().includes(reg) ||
        t.title?.toLowerCase().includes(reg)
      );
    }
    if (city && city !== 'all') {
      const c = city.toLowerCase().replace(/-/g, ' ');
      list = list.filter((t) =>
        t.cities?.some((ct) => (typeof ct === 'string' ? ct : ct.name)?.toLowerCase().includes(c) || ct.slug?.toLowerCase().includes(c)) ||
        t.location?.toLowerCase().includes(c) ||
        t.title?.toLowerCase().includes(c) ||
        t.category?.toLowerCase().includes(c)
      );
    }
    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      list = list.filter((t) =>
        t.title?.toLowerCase().includes(s) ||
        t.subtitle?.toLowerCase().includes(s) ||
        t.overview?.toLowerCase().includes(s) ||
        t.category?.toLowerCase().includes(s) ||
        t.location?.toLowerCase().includes(s)
      );
    }
    if (limit) list = list.slice(0, Number(limit));
    res.json(list.map(normalizeTour));
  } catch (error) {
    console.error('Erreur get tours:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des circuits' });
  }
});

// GET /api/tours/admin/all (All tours for Admin Panel)
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const tours = await Tour.find().sort({ createdAt: -1 });
      return res.json(tours.map(normalizeTour));
    }
    res.json((memoryStore.tours || []).map(normalizeTour));
  } catch (error) {
    console.error('Erreur admin tours:', error);
    res.status(500).json({ message: 'Erreur récupération circuits' });
  }
});

// GET /api/tours/:identifier
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
        tour = (memoryStore.tours || []).find((t) => t.slug === cleanId || t.customUrl === cleanId || String(t._id) === identifier);
      }
      if (!tour) {
        return res.status(404).json({ message: 'Circuit non trouvé' });
      }
      return res.json(normalizeTour(tour));
    }

    const tour = (memoryStore.tours || []).find((t) => t.slug === cleanId || t.customUrl === cleanId || String(t._id) === identifier);
    if (!tour) {
      return res.status(404).json({ message: 'Circuit non trouvé' });
    }
    res.json(normalizeTour(tour));
  } catch (error) {
    console.error('Erreur get tour detail:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du circuit' });
  }
});

// POST /api/tours
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const tourData = { ...req.body };
    if (!tourData.slug && tourData.title) {
      tourData.slug = createSlug(tourData.title);
    }

    // Format connected cities array
    let formattedCities = [];
    if (Array.isArray(tourData.cities)) {
      formattedCities = tourData.cities.map(c => {
        if (typeof c === 'string') {
          const clean = stripHtmlTags(c).trim();
          return { name: clean, slug: clean.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-') };
        }
        return {
          cityId: c.cityId || c._id || '',
          name: stripHtmlTags(c.name || ''),
          slug: c.slug || (c.name ? c.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-') : '')
        };
      }).filter(c => c.name);
    }
    tourData.cities = formattedCities;

    if (!tourData.image && tourData.coverImage) {
      tourData.image = tourData.coverImage;
    }
    if (!tourData.overview && tourData.content) {
      tourData.overview = tourData.content;
    }
    if (!tourData.overview && tourData.subtitle) {
      tourData.overview = tourData.subtitle;
    }
    if (!tourData.category && tourData.region) {
      tourData.category = tourData.region;
    }

    if (isMongoConnected()) {
      const tour = new Tour(tourData);
      const created = await tour.save();
      return res.status(201).json(normalizeTour(created));
    }

    const newTour = {
      _id: `tour_${Date.now()}`,
      ...tourData,
      createdAt: new Date().toISOString()
    };
    if (!memoryStore.tours) memoryStore.tours = [];
    memoryStore.tours.unshift(newTour);
    res.status(201).json(normalizeTour(newTour));
  } catch (error) {
    console.error('Erreur create tour:', error);
    res.status(400).json({ message: error.message || 'Erreur création circuit' });
  }
});

// PUT /api/tours/:id
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.cities && Array.isArray(updateData.cities)) {
      updateData.cities = updateData.cities.map(c => {
        if (typeof c === 'string') {
          const clean = stripHtmlTags(c).trim();
          return { name: clean, slug: clean.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-') };
        }
        return {
          cityId: c.cityId || c._id || '',
          name: stripHtmlTags(c.name || ''),
          slug: c.slug || (c.name ? c.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-') : '')
        };
      }).filter(c => c.name);
    }

    if (updateData.coverImage && !updateData.image) {
      updateData.image = updateData.coverImage;
    }
    if (updateData.content && !updateData.overview) {
      updateData.overview = updateData.content;
    }

    if (isMongoConnected()) {
      let query;
      if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
        query = { _id: id };
      } else {
        const cleanId = (id || '').toLowerCase();
        query = {
          $or: [
            { slug: cleanId },
            { customUrl: cleanId },
            { customUrl: `/${cleanId}` }
          ]
        };
      }

      const updated = await Tour.findOneAndUpdate(
        query,
        { $set: updateData },
        { new: true, runValidators: false }
      );
      if (!updated) return res.status(404).json({ message: 'Circuit introuvable' });
      return res.json(normalizeTour(updated));
    }

    const idx = (memoryStore.tours || []).findIndex((t) => String(t._id) === id || t.slug === id.toLowerCase());
    if (idx === -1) return res.status(404).json({ message: 'Circuit introuvable' });
    memoryStore.tours[idx] = { ...memoryStore.tours[idx], ...updateData };
    res.json(normalizeTour(memoryStore.tours[idx]));
  } catch (error) {
    console.error('Erreur update tour:', error);
    res.status(400).json({ message: error.message || 'Erreur mise à jour' });
  }
});

// DELETE /api/tours/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected()) {
      let query;
      if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
        query = { _id: id };
      } else {
        const cleanId = (id || '').toLowerCase();
        query = {
          $or: [
            { slug: cleanId },
            { customUrl: cleanId },
            { customUrl: `/${cleanId}` }
          ]
        };
      }

      const deleted = await Tour.findOneAndDelete(query);
      if (!deleted) return res.status(404).json({ message: 'Circuit supprimé ou non trouvé' });
      return res.json({ message: 'Circuit supprimé avec succès' });
    }

    const idx = (memoryStore.tours || []).findIndex((t) => String(t._id) === id || t.slug === id.toLowerCase());
    if (idx !== -1) {
      memoryStore.tours.splice(idx, 1);
    }
    res.json({ message: 'Circuit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur suppression circuit' });
  }
});

// POST /api/tours/unfeature-all
router.post('/unfeature-all', protect, adminOnly, async (req, res) => {
  try {
    if (isMongoConnected()) {
      await Tour.updateMany({}, { $set: { featured: false } });
    }
    if (Array.isArray(memoryStore.tours)) {
      memoryStore.tours.forEach((t) => { t.featured = false; });
    }
    res.json({ message: 'Tous les circuits ont été retirés de la page d’accueil avec succès' });
  } catch (error) {
    console.error('Erreur unfeature all:', error);
    res.status(500).json({ message: 'Erreur lors du retrait' });
  }
});

export default router;
