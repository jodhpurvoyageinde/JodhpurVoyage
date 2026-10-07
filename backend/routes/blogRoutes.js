import express from 'express';
import BlogPost from '../models/BlogPost.js';
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

const formatBlogPost = (post) => {
  if (!post) return null;
  const doc = post.toObject ? post.toObject() : post;

  const cleanTitle = stripHtmlTags(doc.title) || 'Article de Voyage';
  let excerpt = doc.excerpt ? stripHtmlTags(doc.excerpt) : '';
  if (!excerpt && doc.content) {
    excerpt = stripHtmlTags(doc.content).slice(0, 180) + '...';
  }

  // Cover image fallback
  let cover = doc.coverImage || doc.image || '/images/dest-rajasthan.jpg';
  if (cover.startsWith('http://') || cover.startsWith('https://')) {
    // Keep absolute CDN URL
  } else if (!cover.startsWith('/')) {
    cover = '/' + cover;
  }

  return {
    _id: doc._id,
    title: cleanTitle,
    slug: doc.slug || createSlug(cleanTitle),
    customUrl: doc.customUrl || '',
    originalUrl: doc.originalUrl || '',
    excerpt: excerpt || 'Découvrez cet article et carnet de voyage exclusif.',
    content: doc.content || '',
    coverImage: cover,
    category: doc.category || 'Travel Guide',
    categories: doc.categories || [],
    readTime: doc.readTime || '5 min de lecture',
    author: {
      name: doc.author?.name || 'Jodhpur Voyage',
      role: doc.author?.role || 'Spécialiste Circuits Inde & Népal',
      avatar: doc.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    tags: Array.isArray(doc.tags) && doc.tags.length > 0 ? doc.tags : ['Voyage', doc.category || 'Inde'],
    published: doc.published !== false,
    featured: doc.featured === true,
    publishedAt: doc.publishedAt || doc.createdAt || new Date().toISOString(),
    createdAt: doc.createdAt || new Date().toISOString(),
    cities: doc.cities || [],
    seoTitle: doc.seoTitle || '',
    seoKeywords: doc.seoKeywords || '',
    seoDescription: doc.seoDescription || '',
    metaTitle: doc.seoTitle || '',
    metaKeywords: doc.seoKeywords || '',
    metaDescription: doc.seoDescription || ''
  };
};

// Fallback tour to blog formatter
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
    slug: doc.slug || (cleanTitle ? createSlug(cleanTitle) : doc._id),
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

// GET /api/blogs (fetches from real BlogPost Database)
router.get('/', async (req, res) => {
  try {
    const { category, search, tag, limit } = req.query;

    if (isMongoConnected()) {
      let query = { published: { $ne: false } };

      // Category matching
      if (category && category !== 'all') {
        const cLower = category.toLowerCase().trim();
        if (cLower === 'nepal' || cLower === 'nepal-2' || cLower === 'népal') {
          query.$or = [
            { category: /n[ée]pal/i },
            { slug: /n[ée]pal|nepal/i },
            { title: /n[ée]pal|nepal/i }
          ];
        } else if (cLower === 'inde') {
          // All India blogs (excluding Nepal)
          query.$and = [
            { category: { $ne: 'Népal' } },
            { slug: { $not: /nepal/i } },
            { title: { $not: /n[ée]pal/i } }
          ];
        } else {
          const cRegex = new RegExp(category, 'i');
          query.$or = [
            { category: cRegex },
            { 'categories.name': cRegex },
            { 'categories.slug': cRegex },
            { tags: cRegex }
          ];
        }
      }

      // Tag filter
      if (tag) {
        query.tags = tag;
      }

      // Search keyword
      if (search && search.trim()) {
        const sRegex = new RegExp(search.trim(), 'i');
        const searchConditions = [
          { title: sRegex },
          { excerpt: sRegex },
          { content: sRegex },
          { slug: sRegex }
        ];

        if (query.$and) {
          query.$and.push({ $or: searchConditions });
        } else if (query.$or) {
          query = { $and: [query, { $or: searchConditions }] };
        } else {
          query.$or = searchConditions;
        }
      }

      let bq = BlogPost.find(query).sort({ publishedAt: -1, createdAt: -1 });
      if (limit) bq = bq.limit(Number(limit));
      let rawBlogs = await bq.exec();

      // If no blogs returned from BlogPost, check if memoryStore has any
      if (rawBlogs.length === 0 && (!category || category === 'all') && !search) {
        const fallbackTours = await Tour.find({ published: { $ne: false } }).limit(9);
        return res.json(fallbackTours.map(normalizeTourToBlog));
      }

      return res.json(rawBlogs.map(formatBlogPost));
    }

    // Memory Store Fallback
    let list = (memoryStore.blogs || memoryStore.tours || []).filter((t) => t.published !== false);
    if (limit) list = list.slice(0, Number(limit));
    res.json(list.map(b => b.content ? formatBlogPost(b) : normalizeTourToBlog(b)));
  } catch (error) {
    console.error('Erreur get blogs:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des articles de blog' });
  }
});

// GET /api/blogs/admin/all
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const blogs = await BlogPost.find().sort({ createdAt: -1 });
      return res.json(blogs.map(formatBlogPost));
    }
    res.json((memoryStore.blogs || []).map(formatBlogPost));
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération articles admin' });
  }
});

// GET /api/blogs/:identifier
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const cleanId = identifier.toLowerCase().trim();

    if (isMongoConnected()) {
      let post;
      if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
        post = await BlogPost.findById(identifier);
      }
      if (!post) {
        post = await BlogPost.findOne({
          $or: [
            { slug: cleanId },
            { customUrl: cleanId },
            { customUrl: `/${cleanId}` },
            { originalUrl: new RegExp(`/blog/${cleanId}/?`, 'i') }
          ]
        });
      }

      if (post) {
        return res.json(formatBlogPost(post));
      }

      // Fallback: check Tour collection
      let tour;
      if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
        tour = await Tour.findById(identifier);
      }
      if (!tour) {
        tour = await Tour.findOne({
          $or: [
            { slug: cleanId },
            { customUrl: cleanId }
          ]
        });
      }
      if (tour) {
        return res.json(normalizeTourToBlog(tour));
      }

      return res.status(404).json({ message: 'Article non trouvé' });
    }

    const post = (memoryStore.blogs || []).find((b) => b.slug === cleanId || b._id === identifier);
    if (!post) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    res.json(formatBlogPost(post));
  } catch (error) {
    console.error('Erreur récupération article:', error);
    res.status(500).json({ message: 'Erreur récupération article' });
  }
});

// POST /api/blogs
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const blogData = { ...req.body };
    if (!blogData.slug && blogData.title) {
      blogData.slug = createSlug(blogData.title);
    }

    if (blogData.metaTitle && !blogData.seoTitle) blogData.seoTitle = blogData.metaTitle;
    if (blogData.metaKeywords && !blogData.seoKeywords) blogData.seoKeywords = blogData.metaKeywords;
    if (blogData.metaDescription && !blogData.seoDescription) blogData.seoDescription = blogData.metaDescription;

    if (isMongoConnected()) {
      const blog = new BlogPost({
        title: blogData.title,
        slug: blogData.slug,
        excerpt: blogData.excerpt || '',
        content: blogData.content || '',
        coverImage: blogData.coverImage || '/images/dest-rajasthan.jpg',
        category: blogData.category || 'Travel Guide',
        readTime: blogData.readTime || '5 min de lecture',
        tags: blogData.tags || ['Inde'],
        published: blogData.published !== false,
        seoTitle: blogData.seoTitle || '',
        seoKeywords: blogData.seoKeywords || '',
        seoDescription: blogData.seoDescription || ''
      });
      const saved = await blog.save();
      return res.status(201).json(formatBlogPost(saved));
    }

    const saved = {
      _id: `blog_${Date.now()}`,
      ...blogData,
      createdAt: new Date().toISOString()
    };
    if (!memoryStore.blogs) memoryStore.blogs = [];
    memoryStore.blogs.unshift(saved);
    res.status(201).json(formatBlogPost(saved));
  } catch (error) {
    res.status(400).json({ message: error.message || 'Erreur création article' });
  }
});

// PUT /api/blogs/:id
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData._id;

    if (updateData.metaTitle && !updateData.seoTitle) updateData.seoTitle = updateData.metaTitle;
    if (updateData.metaKeywords && !updateData.seoKeywords) updateData.seoKeywords = updateData.metaKeywords;
    if (updateData.metaDescription && !updateData.seoDescription) updateData.seoDescription = updateData.metaDescription;

    if (isMongoConnected()) {
      const blog = await BlogPost.findById(req.params.id);
      if (!blog) return res.status(404).json({ message: 'Article introuvable' });
      Object.assign(blog, updateData);
      const updated = await blog.save();
      return res.json(formatBlogPost(updated));
    }

    if (!memoryStore.blogs) memoryStore.blogs = [];
    const idx = memoryStore.blogs.findIndex((b) => b._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Article introuvable' });
    memoryStore.blogs[idx] = { ...memoryStore.blogs[idx], ...updateData };
    res.json(formatBlogPost(memoryStore.blogs[idx]));
  } catch (error) {
    res.status(400).json({ message: error.message || 'Erreur mise à jour' });
  }
});

// DELETE /api/blogs/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (isMongoConnected()) {
      await BlogPost.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Article supprimé avec succès' });
    }

    if (memoryStore.blogs) {
      memoryStore.blogs = memoryStore.blogs.filter((b) => b._id !== req.params.id);
    }
    res.json({ message: 'Article supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur suppression' });
  }
});

export default router;
