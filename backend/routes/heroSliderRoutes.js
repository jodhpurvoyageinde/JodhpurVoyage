import express from 'express';
import HeroSlider from '../models/HeroSlider.js';
import { defaultHeroSlidesData } from '../seed/heroSliderSeedData.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { isMongoConnected, memoryStore } from '../store.js';

const router = express.Router();

// Helper to ensure MongoDB has initial slides if collection is empty
const ensureMongoInitialized = async () => {
  if (!isMongoConnected()) return;
  const count = await HeroSlider.countDocuments();
  if (count === 0) {
    await HeroSlider.insertMany(defaultHeroSlidesData);
    console.log('🌟 HeroSlider collection auto-seeded with 14 default slides.');
  }
};

// @desc    Get all active hero slides (for public homepage)
// @route   GET /api/hero-slider
// @access  Public
router.get('/', async (req, res) => {
  try {
    if (isMongoConnected()) {
      await ensureMongoInitialized();
      const slides = await HeroSlider.find({ isActive: { $ne: false } }).sort({ order: 1, createdAt: 1 });
      return res.json({ success: true, count: slides.length, data: slides });
    }

    // In-memory fallback
    const slides = (memoryStore.heroSliders || [])
      .filter((s) => s.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    return res.json({ success: true, count: slides.length, data: slides });
  } catch (err) {
    console.error('Error fetching hero slides:', err);
    return res.status(500).json({ success: false, message: 'Erreur lors du chargement des slides', error: err.message });
  }
});

// @desc    Get all hero slides including inactive (for admin portal)
// @route   GET /api/hero-slider/admin/all
// @access  Private/Admin
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    if (isMongoConnected()) {
      await ensureMongoInitialized();
      const slides = await HeroSlider.find().sort({ order: 1, createdAt: 1 });
      return res.json({ success: true, count: slides.length, data: slides });
    }

    const slides = [...(memoryStore.heroSliders || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
    return res.json({ success: true, count: slides.length, data: slides });
  } catch (err) {
    console.error('Error fetching admin hero slides:', err);
    return res.status(500).json({ success: false, message: 'Erreur lors du chargement des slides admin', error: err.message });
  }
});

// @desc    Get single hero slide by ID
// @route   GET /api/hero-slider/:id
// @access  Public/Admin
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (isMongoConnected()) {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const slide = await HeroSlider.findById(id);
        if (slide) return res.json({ success: true, data: slide });
      }
    }

    const found = (memoryStore.heroSliders || []).find((s) => String(s._id) === String(id));
    if (found) {
      return res.json({ success: true, data: found });
    }

    return res.status(404).json({ success: false, message: 'Slide introuvable' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur recherche slide', error: err.message });
  }
});

// @desc    Create new hero slide
// @route   POST /api/hero-slider
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { image, badge, badgeIcon, title, titleHighlight, description, order, isActive } = req.body;

    if (!image || !title) {
      return res.status(400).json({ success: false, message: 'L’image et le titre sont obligatoires.' });
    }

    const newSlideData = {
      image: image.trim(),
      badge: (badge || '').trim(),
      badgeIcon: (badgeIcon || 'fa-star').trim(),
      title: title.trim(),
      titleHighlight: (titleHighlight || '').trim(),
      description: (description || '').trim(),
      order: typeof order === 'number' ? order : 999,
      isActive: isActive !== undefined ? Boolean(isActive) : true
    };

    if (isMongoConnected()) {
      // Determine auto order if needed
      if (newSlideData.order === 999) {
        const count = await HeroSlider.countDocuments();
        newSlideData.order = count;
      }
      const createdSlide = await HeroSlider.create(newSlideData);

      // Keep in-memory store in sync
      if (!memoryStore.heroSliders) memoryStore.heroSliders = [];
      memoryStore.heroSliders.push(createdSlide.toObject());

      return res.status(201).json({
        success: true,
        message: 'Slide créée avec succès',
        data: createdSlide
      });
    }

    // In-memory fallback
    if (!memoryStore.heroSliders) memoryStore.heroSliders = [];
    if (newSlideData.order === 999) {
      newSlideData.order = memoryStore.heroSliders.length;
    }
    const memSlide = {
      _id: `slide_${Date.now()}`,
      ...newSlideData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memoryStore.heroSliders.push(memSlide);

    return res.status(201).json({
      success: true,
      message: 'Slide créée avec succès (mémoire)',
      data: memSlide
    });
  } catch (err) {
    console.error('Error creating hero slide:', err);
    return res.status(500).json({ success: false, message: 'Erreur lors de la création de la slide', error: err.message });
  }
});

// @desc    Update existing hero slide
// @route   PUT /api/hero-slider/:id
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    if (isMongoConnected()) {
      let updatedSlide = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        updatedSlide = await HeroSlider.findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true, runValidators: true }
        );
      } else {
        // ID might be a memory-style string from initial seed
        updatedSlide = await HeroSlider.findOneAndUpdate(
          { _id: id },
          { $set: updateData },
          { new: true }
        );
      }

      if (updatedSlide) {
        // Sync in-memory store
        const memIdx = (memoryStore.heroSliders || []).findIndex((s) => String(s._id) === String(id));
        if (memIdx !== -1) {
          memoryStore.heroSliders[memIdx] = updatedSlide.toObject();
        }
        return res.json({
          success: true,
          message: 'Slide mise à jour avec succès',
          data: updatedSlide
        });
      }
    }

    // In-memory store fallback
    const memIdx = (memoryStore.heroSliders || []).findIndex((s) => String(s._id) === String(id));
    if (memIdx === -1) {
      return res.status(404).json({ success: false, message: 'Slide introuvable pour mise à jour' });
    }

    memoryStore.heroSliders[memIdx] = {
      ...memoryStore.heroSliders[memIdx],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return res.json({
      success: true,
      message: 'Slide mise à jour avec succès',
      data: memoryStore.heroSliders[memIdx]
    });
  } catch (err) {
    console.error('Error updating hero slide:', err);
    return res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour de la slide', error: err.message });
  }
});

// @desc    Delete hero slide
// @route   DELETE /api/hero-slider/:id
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  const { id } = req.params;

  try {
    if (isMongoConnected()) {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        await HeroSlider.findByIdAndDelete(id);
      } else {
        await HeroSlider.findOneAndDelete({ _id: id });
      }
    }

    // Sync in-memory store
    if (memoryStore.heroSliders) {
      memoryStore.heroSliders = memoryStore.heroSliders.filter((s) => String(s._id) !== String(id));
    }

    return res.json({ success: true, message: 'Slide supprimée avec succès' });
  } catch (err) {
    console.error('Error deleting hero slide:', err);
    return res.status(500).json({ success: false, message: 'Erreur lors de la suppression de la slide', error: err.message });
  }
});

// @desc    Reorder hero slides
// @route   POST /api/hero-slider/reorder
// @access  Private/Admin
router.post('/reorder', protect, adminOnly, async (req, res) => {
  const { slideIds } = req.body; // Array of IDs in new order

  if (!Array.isArray(slideIds)) {
    return res.status(400).json({ success: false, message: 'slideIds doit être un tableau d’identifiants' });
  }

  try {
    if (isMongoConnected()) {
      const bulkOps = slideIds.map((id, index) => ({
        updateOne: {
          filter: { _id: id },
          update: { $set: { order: index } }
        }
      }));

      if (bulkOps.length > 0) {
        await HeroSlider.bulkWrite(bulkOps);
      }
    }

    // Reorder memory store
    if (memoryStore.heroSliders) {
      slideIds.forEach((id, index) => {
        const found = memoryStore.heroSliders.find((s) => String(s._id) === String(id));
        if (found) {
          found.order = index;
        }
      });
      memoryStore.heroSliders.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    return res.json({ success: true, message: 'Ordre des slides mis à jour avec succès' });
  } catch (err) {
    console.error('Error reordering hero slides:', err);
    return res.status(500).json({ success: false, message: 'Erreur lors du réordonnancement', error: err.message });
  }
});

// @desc    Reset hero slides to default seed slides
// @route   POST /api/hero-slider/reset
// @access  Private/Admin
router.post('/reset', protect, adminOnly, async (req, res) => {
  try {
    if (isMongoConnected()) {
      await HeroSlider.deleteMany();
      await HeroSlider.insertMany(defaultHeroSlidesData);
      const freshSlides = await HeroSlider.find().sort({ order: 1 });

      memoryStore.heroSliders = freshSlides.map((s) => s.toObject());
      return res.json({
        success: true,
        message: 'Slides réinitialisées aux 14 valeurs par défaut avec succès',
        data: freshSlides
      });
    }

    // In-memory reset
    memoryStore.heroSliders = defaultHeroSlidesData.map((slide, idx) => ({
      _id: `slide_${idx + 1}`,
      ...slide,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    return res.json({
      success: true,
      message: 'Slides réinitialisées aux 14 valeurs par défaut avec succès',
      data: memoryStore.heroSliders
    });
  } catch (err) {
    console.error('Error resetting hero slides:', err);
    return res.status(500).json({ success: false, message: 'Erreur lors de la réinitialisation', error: err.message });
  }
});

export default router;
