import express from 'express';
import PageContent from '../models/PageContent.js';
import { defaultPagesData } from '../seed/pagesSeedData.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { isMongoConnected } from '../store.js';

const router = express.Router();

let inMemoryPages = JSON.parse(JSON.stringify(defaultPagesData));

// @desc    Get all available editable pages metadata
// @route   GET /api/pages
// @access  Public
router.get('/', async (req, res) => {
  try {
    const pageKeys = Object.keys(defaultPagesData);
    const pagesList = pageKeys.map(k => ({
      pageKey: k,
      title: defaultPagesData[k].title,
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
  const defaultPage = defaultPagesData[pageKey] || { pageKey, content: {} };

  try {
    if (isMongoConnected()) {
      let pageDoc = await PageContent.findOne({ pageKey });
      if (!pageDoc) {
        // Create initial default document
        pageDoc = await PageContent.create({
          pageKey,
          title: defaultPage.title || pageKey,
          content: defaultPage
        });
      }
      return res.json(pageDoc.content || pageDoc);
    }

    const memoryPage = inMemoryPages[pageKey] || defaultPage;
    return res.json(memoryPage);
  } catch (err) {
    console.error(`Error fetching page ${pageKey}:`, err);
    return res.json(defaultPage);
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

// @desc    Reset page content to default seed
// @route   POST /api/pages/:pageKey/reset
// @access  Private/Admin
router.post('/:pageKey/reset', protect, adminOnly, async (req, res) => {
  const { pageKey } = req.params;
  const defaultPage = defaultPagesData[pageKey];

  if (!defaultPage) {
    return res.status(404).json({ message: 'Valeurs par défaut non trouvées pour cette page' });
  }

  try {
    const freshDefault = JSON.parse(JSON.stringify(defaultPage));

    if (isMongoConnected()) {
      const pageDoc = await PageContent.findOneAndUpdate(
        { pageKey },
        {
          pageKey,
          title: freshDefault.title || pageKey,
          content: freshDefault
        },
        { new: true, upsert: true }
      );
      inMemoryPages[pageKey] = pageDoc.content;
      return res.json({ message: `Page ${pageKey} réinitialisée aux valeurs d’origine`, data: pageDoc.content });
    }

    inMemoryPages[pageKey] = freshDefault;
    return res.json({ message: `Page ${pageKey} réinitialisée`, data: freshDefault });
  } catch (err) {
    console.error(`Error resetting page ${pageKey}:`, err);
    return res.status(500).json({ message: 'Erreur lors de la réinitialisation de la page', error: err.message });
  }
});

export default router;
