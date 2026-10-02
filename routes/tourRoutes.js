import express from 'express';
import BlogPost from '../models/BlogPost.js';
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

const normalizeBlogToTour = (blog) => {
  const doc = blog && blog.toObject ? blog.toObject() : (blog || {});
  const cleanTitle = stripHtmlTags(doc.title) || 'Circuit Blog';
  const cleanExcerpt = stripHtmlTags(doc.excerpt || doc.summary || doc.subtitle || '').slice(0, 160);
  
  let rawContent = doc.overview || doc.content || doc.excerpt || doc.summary || doc.subtitle || '';
  let cleanOverview = cleanHtml(rawContent);

  if (stripHtmlTags(cleanOverview).length < 25) {
    const loc = doc.category || doc.location || 'l\'Inde';
    const dur = doc.readTime || doc.duration || 'plusieurs jours';
    cleanOverview = `<p>Embarquez pour une expérience de voyage exceptionnelle avec notre itinéraire <strong>${cleanTitle}</strong>. Ce circuit privatif de <strong>${dur}</strong> à travers <strong>${loc}</strong> a été conçu sur mesure pour vous offrir une immersion totale entre monuments mythiques, traditions séculaires et paysages grandioses.</p><p>Voyagez en toute sérénité grâce à un véhicule privé climatisé avec chauffeur dédié, des hébergements de charme rigoureusement sélectionnés et une assistance francophone disponible 24h/24 tout au long de votre séjour.</p>`;
  }

  // Format connected cities array (Many-to-Many Tags)
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

  const validHighlights = Array.isArray(doc.tags) && doc.tags.length > 0 && doc.tags.some(t => typeof t === 'string' && t.trim().length > 3)
    ? doc.tags
    : [
        `Circuit 100% privatif et personnalisable à ${doc.category || 'destination'}`,
        'Chauffeur privé expérimenté & véhicule climatisé',
        'Hébergements de charme avec petits-déjeuners inclus',
        'Assistance locale francophone 24h/24 et 7j/7'
      ];

  const defaultSeoTitle = doc.seoTitle || `${cleanTitle} | Circuit ${doc.readTime || doc.duration || ''} | Jodhpur Voyage`;
  const defaultSeoKeywords = doc.seoKeywords || `${cleanTitle.toLowerCase()}, circuit ${doc.category?.toLowerCase() || 'inde'}, voyage sur mesure, chauffeur prive inde`;
  const defaultSeoDescription = doc.seoDescription || cleanExcerpt || `Réservez le circuit ${cleanTitle} à ${doc.category || 'l\'Inde'} avec chauffeur privé, hébergements de charme et assistance 24h/24.`;

  return {
    _id: doc._id,
    title: cleanTitle,
    slug: doc.slug || (cleanTitle ? cleanTitle.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-') : doc._id),
    subtitle: cleanExcerpt || `Circuit privatif sur mesure à ${doc.category || 'l\'Inde'} avec chauffeur dédié.`,
    duration: doc.readTime || doc.duration || '5 Jours / 4 Nuits',
    daysCount: 5,
    location: (cities.length > 0 ? cities.map(c => c.name).join(', ') : (doc.location || doc.category || 'Inde')),
    category: doc.category || doc.region || 'Rajasthan',
    categoryId: doc.categoryId || '',
    cities: cities,
    region: (doc.region || doc.category || 'rajasthan').toLowerCase().replace(/\s+/g, '-'),
    theme: doc.theme || doc.category || 'Culture & Patrimoine',
    badge: doc.badge || doc.category || 'Circuit Privé',
    price: doc.price || 950,
    priceUnit: '€ / pers',
    rating: 4.9,
    reviewCount: 35,
    featured: Boolean(doc.featured === true),
    published: doc.published !== false,
    image: doc.coverImage || doc.image || '/images/dest-rajasthan.jpg',
    gallery: doc.gallery || [doc.coverImage || '/images/dest-rajasthan.jpg'],
    overview: cleanOverview,
    highlights: validHighlights,
    itinerary: Array.isArray(doc.itinerary) && doc.itinerary.length > 0 ? doc.itinerary : [
      {
        day: 1,
        title: `Découverte: ${cleanTitle}`,
        description: cleanExcerpt || 'Accueil par votre chauffeur privé et transfert vers votre hôtel de charme.',
        meals: 'Petit-déjeuner inclus',
        accommodation: 'Hôtel de charme / Haveli de patrimoine'
      },
      {
        day: 2,
        title: 'Visites Guidées & Exploration Locale',
        description: stripHtmlTags(cleanOverview).slice(0, 300) || 'Visites guidées des édifices historiques, bazars authentiques et panoramas majeurs.',
        meals: 'Petit-déjeuner & Dîner',
        accommodation: 'Haveli de patrimoine'
      }
    ],
    inclusions: doc.inclusions || ['Chauffeur privé & véhicule climatisé', 'Guides locaux francophones', 'Hébergements de charme'],
    exclusions: doc.exclusions || ['Vols internationaux', 'Frais de visa', 'Dépenses personnelles'],
    seoTitle: defaultSeoTitle,
    seoKeywords: defaultSeoKeywords,
    seoDescription: defaultSeoDescription,
    createdAt: doc.createdAt
  };
};

// GET /api/tours (fetches from Blog Database)
router.get('/', async (req, res) => {
  try {
    const { region, city, search, limit } = req.query;

    if (isMongoConnected()) {
      const conditions = [{ published: { $ne: false } }];

      if (region && region !== 'all') {
        const regNorm = region.toLowerCase().replace(/_/g, '-');
        let regPattern;
        if (regNorm === 'inde-du-nord' || regNorm === 'nord') {
          regPattern = 'inde[\\s-]*du[\\s-]*nord|nord|rajasthan|delhi|agra|varanasi|amritsar|dharamsala|rishikesh|ladakh|himachal|punjab|kashmir|spiti';
        } else if (regNorm === 'inde-du-sud' || regNorm === 'sud') {
          regPattern = 'inde[\\s-]*du[\\s-]*sud|sud|kerala|tamil|karnataka|gujarat|goa|orissa';
        } else if (regNorm === 'nepal') {
          regPattern = 'n[ée]pal|katmandou|kathmandu|chitwan|pokhara';
        } else if (regNorm === 'bhoutan') {
          regPattern = 'bhoutan|thimphu|paro|punakha';
        } else if (regNorm === 'ladakh' || regNorm === 'himalaya') {
          regPattern = 'ladakh|himalaya|spiti|zanskar|leh';
        } else if (regNorm === 'rajasthan') {
          regPattern = 'rajasthan|jodhpur|jaipur|udaipur|jaisalmer';
        } else if (regNorm === 'gujarat') {
          regPattern = 'gujarat|kutch';
        } else {
          regPattern = region.replace(/-/g, ' ');
        }
        const regRegex = new RegExp(regPattern, 'i');
        conditions.push({
          $or: [
            { category: regRegex },
            { region: regRegex },
            { location: regRegex },
            { tags: regRegex },
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
            { tags: cityRegex },
            { highlights: cityRegex },
            { excerpt: cityRegex },
            { content: cityRegex },
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
            { excerpt: sRegex },
            { summary: sRegex },
            { content: sRegex },
            { overview: sRegex },
            { category: sRegex },
            { location: sRegex },
            { region: sRegex },
            { theme: sRegex },
            { badge: sRegex },
            { tags: sRegex },
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

      let bq = BlogPost.find(query).sort({ createdAt: -1 });
      if (limit) bq = bq.limit(Number(limit));
      let rawBlogs = await bq.exec();

      if (rawBlogs.length === 0) {
        let memList = memoryStore.blogs.filter((b) => b.published !== false);
        if (region && region !== 'all') {
          const reg = region.toLowerCase().replace(/-/g, ' ');
          memList = memList.filter((b) =>
            b.category?.toLowerCase().includes(reg) ||
            b.region?.toLowerCase().includes(reg) ||
            b.title?.toLowerCase().includes(reg) ||
            b.tags?.some((t) => typeof t === 'string' && t.toLowerCase().includes(reg))
          );
        }
        if (city && city !== 'all') {
          const c = city.toLowerCase().replace(/-/g, ' ');
          memList = memList.filter((b) =>
            b.cities?.some((ct) => (typeof ct === 'string' ? ct : ct.name)?.toLowerCase().includes(c) || ct.slug?.toLowerCase().includes(c)) ||
            b.cityName?.toLowerCase().includes(c) ||
            b.location?.toLowerCase().includes(c) ||
            b.title?.toLowerCase().includes(c) ||
            b.category?.toLowerCase().includes(c) ||
            b.overview?.toLowerCase().includes(c) ||
            b.tags?.some((t) => typeof t === 'string' && t.toLowerCase().includes(c)) ||
            b.highlights?.some((h) => typeof h === 'string' && h.toLowerCase().includes(c)) ||
            b.itinerary?.some((d) => d.title?.toLowerCase().includes(c) || d.description?.toLowerCase().includes(c))
          );
        }
        if (search && search.trim()) {
          const s = search.trim().toLowerCase();
          memList = memList.filter((b) =>
            b.title?.toLowerCase().includes(s) ||
            b.subtitle?.toLowerCase().includes(s) ||
            b.excerpt?.toLowerCase().includes(s) ||
            b.summary?.toLowerCase().includes(s) ||
            b.content?.toLowerCase().includes(s) ||
            b.overview?.toLowerCase().includes(s) ||
            b.category?.toLowerCase().includes(s) ||
            b.location?.toLowerCase().includes(s) ||
            b.theme?.toLowerCase().includes(s) ||
            b.tags?.some((t) => typeof t === 'string' && t.toLowerCase().includes(s)) ||
            b.highlights?.some((h) => typeof h === 'string' && h.toLowerCase().includes(s)) ||
            b.itinerary?.some((d) => d.title?.toLowerCase().includes(s) || d.description?.toLowerCase().includes(s))
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
        b.tags?.some((t) => typeof t === 'string' && t.toLowerCase().includes(reg))
      );
    }
    if (city && city !== 'all') {
      const c = city.toLowerCase().replace(/-/g, ' ');
      list = list.filter((b) =>
        b.cities?.some((ct) => (typeof ct === 'string' ? ct : ct.name)?.toLowerCase().includes(c) || ct.slug?.toLowerCase().includes(c)) ||
        b.cityName?.toLowerCase().includes(c) ||
        b.location?.toLowerCase().includes(c) ||
        b.title?.toLowerCase().includes(c) ||
        b.category?.toLowerCase().includes(c) ||
        b.overview?.toLowerCase().includes(c) ||
        b.tags?.some((t) => typeof t === 'string' && t.toLowerCase().includes(c)) ||
        b.highlights?.some((h) => typeof h === 'string' && h.toLowerCase().includes(c)) ||
        b.itinerary?.some((d) => d.title?.toLowerCase().includes(c) || d.description?.toLowerCase().includes(c))
      );
    }
    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      list = list.filter((b) =>
        b.title?.toLowerCase().includes(s) ||
        b.subtitle?.toLowerCase().includes(s) ||
        b.excerpt?.toLowerCase().includes(s) ||
        b.summary?.toLowerCase().includes(s) ||
        b.content?.toLowerCase().includes(s) ||
        b.overview?.toLowerCase().includes(s) ||
        b.category?.toLowerCase().includes(s) ||
        b.location?.toLowerCase().includes(s) ||
        b.theme?.toLowerCase().includes(s) ||
        b.tags?.some((t) => typeof t === 'string' && t.toLowerCase().includes(s)) ||
        b.highlights?.some((h) => typeof h === 'string' && h.toLowerCase().includes(s)) ||
        b.cities?.some((ct) => (typeof ct === 'string' ? ct : ct.name)?.toLowerCase().includes(s) || ct.slug?.toLowerCase().includes(s)) ||
        b.itinerary?.some((d) => d.title?.toLowerCase().includes(s) || d.description?.toLowerCase().includes(s))
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

    const categoryName = tourData.category || tourData.region || 'Rajasthan';

    if (isMongoConnected()) {
      const blog = new BlogPost({
        title: tourData.title,
        slug: tourData.slug,
        excerpt: tourData.subtitle || tourData.overview || '',
        content: tourData.overview || tourData.subtitle || '',
        coverImage: tourData.image || '/images/dest-rajasthan.jpg',
        category: categoryName,
        categoryId: tourData.categoryId || '',
        cities: formattedCities,
        readTime: tourData.duration || '5 min de lecture',
        tags: tourData.highlights || [],
        featured: Boolean(tourData.featured === true),
        published: tourData.published !== false,
        seoTitle: tourData.seoTitle || '',
        seoKeywords: tourData.seoKeywords || '',
        seoDescription: tourData.seoDescription || ''
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
      category: categoryName,
      categoryId: tourData.categoryId || '',
      cities: formattedCities,
      readTime: tourData.duration || '5 min de lecture',
      tags: tourData.highlights || [],
      featured: Boolean(tourData.featured === true),
      published: tourData.published !== false,
      seoTitle: tourData.seoTitle || '',
      seoKeywords: tourData.seoKeywords || '',
      seoDescription: tourData.seoDescription || '',
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
    const { id } = req.params;
    const updateData = { ...req.body };
    if (updateData.subtitle && !updateData.excerpt) updateData.excerpt = updateData.subtitle;
    if (updateData.overview && !updateData.content) updateData.content = updateData.overview;
    if (!updateData.content) updateData.content = updateData.overview || updateData.excerpt || updateData.subtitle || updateData.title || '';
    if (!updateData.excerpt) updateData.excerpt = updateData.subtitle || updateData.content || updateData.title || '';
    if (updateData.image && !updateData.coverImage) updateData.coverImage = updateData.image;
    if (updateData.duration && !updateData.readTime) updateData.readTime = updateData.duration;
    if (updateData.location && !updateData.category) updateData.category = updateData.location;

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
    if (updateData.category) {
      updateData.region = (updateData.category || '').toLowerCase().replace(/\s+/g, '-');
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

      const updated = await BlogPost.findOneAndUpdate(
        query,
        { $set: updateData },
        { new: true, runValidators: false }
      );
      if (!updated) return res.status(404).json({ message: 'Circuit introuvable' });
      return res.json(normalizeBlogToTour(updated));
    }

    const idx = memoryStore.blogs.findIndex((b) => b._id === id || b.slug === id.toLowerCase());
    if (idx === -1) return res.status(404).json({ message: 'Circuit introuvable' });
    memoryStore.blogs[idx] = { ...memoryStore.blogs[idx], ...updateData };
    res.json(normalizeBlogToTour(memoryStore.blogs[idx]));
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

      const deleted = await BlogPost.findOneAndDelete(query);
      if (!deleted) return res.status(404).json({ message: 'Circuit supprimé ou non trouvé' });
      return res.json({ message: 'Circuit supprimé avec succès' });
    }

    const idx = memoryStore.blogs.findIndex((b) => b._id === id || b.slug === id.toLowerCase());
    if (idx !== -1) {
      memoryStore.blogs.splice(idx, 1);
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
      await BlogPost.updateMany({}, { $set: { featured: false } });
    }
    if (Array.isArray(memoryStore.blogs)) {
      memoryStore.blogs.forEach((b) => { b.featured = false; });
    }
    res.json({ message: 'Tous les circuits ont été retirés de la page d’accueil avec succès' });
  } catch (error) {
    console.error('Erreur unfeature all:', error);
    res.status(500).json({ message: 'Erreur lors du retrait' });
  }
});

// Auto-unfeature all existing tours so default state is zero featured packages on homepage
setTimeout(async () => {
  try {
    if (isMongoConnected()) {
      await BlogPost.updateMany({}, { $set: { featured: false } });
    }
    if (Array.isArray(memoryStore.blogs)) {
      memoryStore.blogs.forEach((b) => { b.featured = false; });
    }
  } catch (err) {
    console.error('Initial unfeature error:', err);
  }
}, 2000);

export default router;

