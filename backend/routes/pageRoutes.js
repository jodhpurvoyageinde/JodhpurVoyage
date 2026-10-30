import express from 'express';
import PageContent from '../models/PageContent.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { isMongoConnected } from '../store.js';

const router = express.Router();

let inMemoryPages = {};

// @desc    Get all available editable pages metadata
// @route   GET /api/pages
// @access  Public
router.get('/', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const pages = await PageContent.find({}, { pageKey: 1, title: 1 }).lean();
      const pagesList = pages.map((p) => ({
        pageKey: p.pageKey,
        title: p.title || p.pageKey,
        url: `/${p.pageKey}`
      }));
      return res.json(pagesList);
    }
    const pageKeys = Object.keys(inMemoryPages);
    const pagesList = pageKeys.map((k) => ({
      pageKey: k,
      title: inMemoryPages[k].title || k,
      url: `/${k}`
    }));
    return res.json(pagesList);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur lors de la récupération des pages', error: err.message });
  }
});

// @desc    Get page content by pageKey
// @route   GET /api/pages/:pageKey
// @access  Public
router.get('/:pageKey', async (req, res) => {
  const { pageKey } = req.params;

  try {
    if (isMongoConnected()) {
      const pageDoc = await PageContent.findOne({ pageKey });
      if (pageDoc) {
        return res.json(pageDoc.content || pageDoc);
      }
      return res.json({ pageKey, title: pageKey, content: {} });
    }

    const memoryPage = inMemoryPages[pageKey] || { pageKey, title: pageKey, content: {} };
    return res.json(memoryPage);
  } catch (err) {
    console.error(`Error fetching page ${pageKey}:`, err);
    return res.json({ pageKey, title: pageKey, content: {} });
  }
});

// @desc    Update page content
// @route   PUT /api/pages/:pageKey
// @access  Private/Admin
router.put('/:pageKey', protect, adminOnly, async (req, res) => {
  const { pageKey } = req.params;
  const newContent = req.body;

  try {
    if (isMongoConnected()) {
      const pageDoc = await PageContent.findOneAndUpdate(
        { pageKey },
        {
          pageKey,
          title: newContent.title || pageKey,
          content: newContent
        },
        { new: true, upsert: true }
      );
      inMemoryPages[pageKey] = pageDoc.content || newContent;
      return res.json({ message: `Page ${pageKey} mise à jour avec succès`, data: pageDoc.content || pageDoc });
    }

    inMemoryPages[pageKey] = newContent;
    return res.json({ message: `Page ${pageKey} mise à jour en mémoire`, data: newContent });
  } catch (err) {
    console.error(`Error updating page ${pageKey}:`, err);
    return res.status(500).json({ message: 'Erreur lors de la mise à jour de la page', error: err.message });
  }
});

// @desc    Reset page content
// @route   POST /api/pages/:pageKey/reset
// @access  Private/Admin
router.post('/:pageKey/reset', protect, adminOnly, async (req, res) => {
  const { pageKey } = req.params;
  try {
    if (isMongoConnected()) {
      const pageDoc = await PageContent.findOne({ pageKey });
      return res.json({ message: `Page ${pageKey} réinitialisée`, data: pageDoc ? pageDoc.content : {} });
    }
    return res.json({ message: `Page ${pageKey} réinitialisée`, data: inMemoryPages[pageKey] || {} });
  } catch (err) {
    console.error(`Error resetting page ${pageKey}:`, err);
    return res.status(500).json({ message: 'Erreur lors de la réinitialisation de la page', error: err.message });
  }
});

export default router;
