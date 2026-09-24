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

// GET /api/blogs
router.get('/', async (req, res) => {
  try {
    const { category, search, tag, limit } = req.query;

    if (isMongoConnected()) {
      let query = { published: { $ne: false } };
      if (category && category !== 'all') query.category = category;
      if (tag) query.tags = tag;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { excerpt: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } }
        ];
      }

      let bq = BlogPost.find(query).sort({ createdAt: -1 });
      if (limit) bq = bq.limit(Number(limit));
      const blogs = await bq.exec();
      return res.json(blogs);
    }

    let list = memoryStore.blogs.filter((b) => b.published !== false);
    if (category && category !== 'all') list = list.filter((b) => b.category === category);
    if (tag) list = list.filter((b) => b.tags?.includes(tag));
    if (search) {
      const s = search.toLowerCase();
      list = list.filter((b) =>
        b.title?.toLowerCase().includes(s) ||
        b.excerpt?.toLowerCase().includes(s) ||
        b.content?.toLowerCase().includes(s)
      );
    }
    if (limit) list = list.slice(0, Number(limit));
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération articles de blog' });
  }
});

// GET /api/blogs/admin/all
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const blogs = await BlogPost.find().sort({ createdAt: -1 });
      return res.json(blogs);
    }
    res.json(memoryStore.blogs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération articles admin' });
  }
});

// GET /api/blogs/:identifier
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;

    if (isMongoConnected()) {
      let blog;
      if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
        blog = await BlogPost.findById(identifier);
      }
      if (!blog) {
        blog = await BlogPost.findOne({ slug: identifier });
      }
      if (!blog) {
        return res.status(404).json({ message: 'Article non trouvé' });
      }
      return res.json(blog);
    }

    const blog = memoryStore.blogs.find((b) => b.slug === identifier || b._id === identifier);
    if (!blog) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    res.json(blog);
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
      const blog = new BlogPost(blogData);
      const saved = await blog.save();
      return res.status(201).json(saved);
    }

    const saved = {
      _id: `blog_${Date.now()}`,
      ...blogData,
      createdAt: new Date().toISOString()
    };
    memoryStore.blogs.unshift(saved);
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Erreur création article' });
  }
});

// PUT /api/blogs/:id
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const blog = await BlogPost.findById(req.params.id);
      if (!blog) return res.status(404).json({ message: 'Article introuvable' });
      Object.assign(blog, req.body);
      const updated = await blog.save();
      return res.json(updated);
    }

    const idx = memoryStore.blogs.findIndex((b) => b._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Article introuvable' });
    memoryStore.blogs[idx] = { ...memoryStore.blogs[idx], ...req.body };
    res.json(memoryStore.blogs[idx]);
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

    memoryStore.blogs = memoryStore.blogs.filter((b) => b._id !== req.params.id);
    res.json({ message: 'Article supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur suppression' });
  }
});

export default router;
