import express from 'express';
import CustomUrl from '../models/CustomUrl.js';
import { isMongoConnected, memoryStore } from '../store.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

if (!memoryStore.customUrls) {
  memoryStore.customUrls = [];
}

const normalizePath = (p) => {
  if (!p) return '/';
  let pathStr = p.trim().toLowerCase();
  if (!pathStr.startsWith('/')) {
    pathStr = '/' + pathStr;
  }
  return pathStr;
};

// GET /api/custom-urls/config - Get current backend URL/route configuration
router.get('/config', (req, res) => {
  const currentPrefix = process.env.API_PREFIX || '/api';
  res.json({
    apiPrefix: currentPrefix,
    port: process.env.PORT || 5000,
    environment: process.env.NODE_ENV || 'development',
    availableRoutes: [
      `${currentPrefix}/auth`,
      `${currentPrefix}/tours`,
      `${currentPrefix}/destinations`,
      `${currentPrefix}/bookings`,
      `${currentPrefix}/contacts`,
      `${currentPrefix}/reviews`,
      `${currentPrefix}/blogs`,
      `${currentPrefix}/stats`,
      `${currentPrefix}/upload`,
      `${currentPrefix}/seo`,
      `${currentPrefix}/custom-urls`
    ]
  });
});

// GET /api/custom-urls - Get all custom URL routes
router.get('/', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const urls = await CustomUrl.find().sort({ createdAt: -1 });
      return res.json(urls);
    }
    res.json(memoryStore.customUrls);
  } catch (error) {
    console.error('Erreur get custom urls:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des URLs personnalisées' });
  }
});

// GET /api/custom-urls/resolve - Resolve a custom path to target URL
router.get('/resolve', async (req, res) => {
  try {
    const rawPath = req.query.path;
    if (!rawPath) {
      return res.status(400).json({ message: 'Paramètre path requis' });
    }
    const reqPath = normalizePath(rawPath);

    if (isMongoConnected()) {
      const mapping = await CustomUrl.findOne({ customPath: reqPath, active: true });
      if (mapping) {
        return res.json(mapping);
      }
    } else {
      const memMapping = memoryStore.customUrls.find(
        (item) => normalizePath(item.customPath) === reqPath && item.active !== false
      );
      if (memMapping) {
        return res.json(memMapping);
      }
    }

    res.status(404).json({ message: 'Aucune URL personnalisée trouvée pour ce chemin' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la résolution du chemin' });
  }
});

// GET /api/custom-urls/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected()) {
      const item = await CustomUrl.findById(id);
      if (item) return res.json(item);
    }
    const memItem = memoryStore.customUrls.find((u) => u._id === id);
    if (memItem) return res.json(memItem);

    res.status(404).json({ message: 'URL personnalisée non trouvée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération URL' });
  }
});

// POST /api/custom-urls - Create or update custom URL mapping
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { customPath, targetUrl, targetType, targetId, redirectType, active, description } = req.body;

    if (!customPath || !targetUrl) {
      return res.status(400).json({ message: 'customPath et targetUrl sont obligatoires' });
    }

    const normalizedCustomPath = normalizePath(customPath);

    if (isMongoConnected()) {
      const existing = await CustomUrl.findOne({ customPath: normalizedCustomPath });
      if (existing) {
        // Upsert / Update existing mapping seamlessly
        const updated = await CustomUrl.findByIdAndUpdate(
          existing._id,
          {
            customPath: normalizedCustomPath,
            targetUrl,
            targetType: targetType || 'custom',
            targetId: targetId || '',
            redirectType: redirectType || 301,
            active: active !== false,
            description: description || ''
          },
          { new: true }
        );
        return res.status(200).json(updated);
      }

      const newUrl = await CustomUrl.create({
        customPath: normalizedCustomPath,
        targetUrl,
        targetType: targetType || 'custom',
        targetId: targetId || '',
        redirectType: redirectType || 301,
        active: active !== false,
        description: description || ''
      });

      return res.status(201).json(newUrl);
    }

    const existingIndex = memoryStore.customUrls.findIndex(
      (item) => normalizePath(item.customPath) === normalizedCustomPath
    );
    if (existingIndex !== -1) {
      memoryStore.customUrls[existingIndex] = {
        ...memoryStore.customUrls[existingIndex],
        targetUrl,
        targetType: targetType || 'custom',
        targetId: targetId || '',
        redirectType: redirectType || 301,
        active: active !== false,
        description: description || '',
        updatedAt: new Date().toISOString()
      };
      return res.status(200).json(memoryStore.customUrls[existingIndex]);
    }

    const newMemUrl = {
      _id: `custom_url_${Date.now()}`,
      customPath: normalizedCustomPath,
      targetUrl,
      targetType: targetType || 'custom',
      targetId: targetId || '',
      redirectType: redirectType || 301,
      active: active !== false,
      description: description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    memoryStore.customUrls.push(newMemUrl);
    res.status(201).json(newMemUrl);
  } catch (error) {
    console.error('Erreur création custom URL:', error);
    res.status(500).json({ message: 'Erreur lors de la création de la route personnalisée' });
  }
});

// PUT /api/custom-urls/:id - Update custom URL mapping
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { customPath, targetUrl, targetType, targetId, redirectType, active, description } = req.body;

    if (customPath) {
      const normalizedCustomPath = normalizePath(customPath);
      req.body.customPath = normalizedCustomPath;
    }

    if (isMongoConnected()) {
      const updated = await CustomUrl.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!updated) {
        return res.status(404).json({ message: 'URL non trouvée' });
      }
      return res.json(updated);
    }

    const index = memoryStore.customUrls.findIndex((u) => u._id === id);
    if (index === -1) {
      return res.status(404).json({ message: 'URL non trouvée' });
    }

    memoryStore.customUrls[index] = {
      ...memoryStore.customUrls[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    res.json(memoryStore.customUrls[index]);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour' });
  }
});

// DELETE /api/custom-urls/:id - Delete custom URL mapping
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const deleted = await CustomUrl.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ message: 'URL non trouvée' });
      }
      return res.json({ message: 'URL personnalisée supprimée avec succès' });
    }

    const index = memoryStore.customUrls.findIndex((u) => u._id === id);
    if (index === -1) {
      return res.status(404).json({ message: 'URL non trouvée' });
    }

    memoryStore.customUrls.splice(index, 1);
    res.json({ message: 'URL personnalisée supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
});

export default router;
