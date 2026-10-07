import express from 'express';
import Seo from '../models/Seo.js';
import CustomUrl from '../models/CustomUrl.js';
import { isMongoConnected, memoryStore } from '../store.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { defaultSeoData } from '../seed/seoData.js';

const router = express.Router();

const normalizeCustomPath = (p) => {
  if (!p) return '';
  let pathStr = p.trim().toLowerCase();
  if (!pathStr.startsWith('/') && pathStr.length > 0) {
    pathStr = '/' + pathStr;
  }
  return pathStr;
};

// GET /api/seo -> Get all SEO page configurations
router.get('/', async (req, res) => {
  try {
    if (isMongoConnected()) {
      let configs = await Seo.find().sort({ pageName: 1 });
      if (configs.length === 0) {
        await Seo.insertMany(defaultSeoData);
        configs = await Seo.find().sort({ pageName: 1 });
      }
      return res.json(configs);
    }
    return res.json(memoryStore.seo || defaultSeoData);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la configuration SEO' });
  }
});

// GET /api/seo/by-path -> Lookup SEO config by custom URL path (e.g. ?path=/voyage-sur-mesure)
router.get('/by-path', async (req, res) => {
  try {
    const rawPath = req.query.path;
    if (!rawPath) {
      return res.status(400).json({ message: 'Paramètre query path requis' });
    }
    const cleanPath = normalizeCustomPath(rawPath);

    if (isMongoConnected()) {
      let config = await Seo.findOne({
        $or: [
          { customUrl: cleanPath },
          { customUrl: rawPath },
          { pageKey: cleanPath.replace(/^\//, '') },
          { pageKey: rawPath }
        ]
      });

      if (!config) {
        const defaultItem = defaultSeoData.find(
          (s) => s.customUrl === cleanPath || s.pageKey === cleanPath.replace(/^\//, '')
        );
        if (defaultItem) {
          config = new Seo(defaultItem);
          await config.save();
        }
      }

      if (!config) {
        return res.status(404).json({ message: 'Configuration SEO non trouvée pour ce chemin' });
      }
      return res.json(config);
    }

    const list = memoryStore.seo || defaultSeoData;
    const item = list.find((s) => s.customUrl === cleanPath || s.pageKey === cleanPath.replace(/^\//, ''));
    if (!item) {
      return res.status(404).json({ message: 'Configuration SEO non trouvée' });
    }
    return res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la recherche SEO par chemin' });
  }
});

// GET /api/seo/:pageKey -> Get SEO meta config by pageKey or customUrl
router.get('/:pageKey', async (req, res) => {
  try {
    const rawKey = req.params.pageKey.toLowerCase();
    const cleanPath = normalizeCustomPath(rawKey);

    if (isMongoConnected()) {
      let config = await Seo.findOne({
        $or: [
          { pageKey: rawKey },
          { customUrl: cleanPath },
          { customUrl: rawKey }
        ]
      });

      if (!config) {
        const defaultItem = defaultSeoData.find(
          (s) => s.pageKey === rawKey || s.customUrl === cleanPath
        );
        if (defaultItem) {
          config = new Seo(defaultItem);
          await config.save();
        }
      }

      if (!config) {
        return res.status(404).json({ message: 'Configuration SEO non trouvée pour cette page' });
      }
      return res.json(config);
    }

    const list = memoryStore.seo || defaultSeoData;
    const item = list.find((s) => s.pageKey === rawKey || s.customUrl === cleanPath);
    if (!item) {
      return res.status(404).json({ message: 'Configuration SEO non trouvée' });
    }
    return res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération SEO page' });
  }
});

// PUT /api/seo/:pageKey -> Update/Upsert SEO configuration & sync customUrl (Admin Protected)
router.put('/:pageKey', protect, adminOnly, async (req, res) => {
  try {
    const pageKey = req.params.pageKey.toLowerCase();
    const seoData = { ...req.body };
    delete seoData._id;

    if (seoData.customUrl) {
      seoData.customUrl = normalizeCustomPath(seoData.customUrl);
    }

    if (isMongoConnected()) {
      let config = await Seo.findOne({ pageKey });
      if (config) {
        Object.assign(config, seoData);
        await config.save();
      } else {
        config = new Seo({ ...seoData, pageKey });
        await config.save();
      }

      // Sync customUrl mapping if customUrl is present
      if (config.customUrl) {
        try {
          await CustomUrl.findOneAndUpdate(
            { targetId: config._id.toString() },
            {
              customPath: config.customUrl,
              targetUrl: `/${config.pageKey}`,
              targetType: 'custom',
              description: `SEO Custom Path for ${config.pageName || config.pageKey}`
            },
            { upsert: true, new: true }
          );
        } catch (syncErr) {
          console.warn('Sync CustomUrl non bloquant:', syncErr.message);
        }
      }

      return res.json(config);
    }

    const idx = memoryStore.seo.findIndex((s) => s.pageKey === pageKey);
    if (idx !== -1) {
      memoryStore.seo[idx] = {
        ...memoryStore.seo[idx],
        ...seoData,
        updatedAt: new Date().toISOString()
      };
      return res.json(memoryStore.seo[idx]);
    } else {
      const newItem = {
        _id: `seo_${Date.now()}`,
        pageKey,
        pageName: seoData.pageName || pageKey,
        ...seoData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      memoryStore.seo.push(newItem);
      return res.status(201).json(newItem);
    }
  } catch (error) {
    res.status(400).json({ message: error.message || 'Erreur mise à jour SEO' });
  }
});

// POST /api/seo -> Create new SEO page key configuration (Admin Protected)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const seoData = req.body;
    if (!seoData.pageKey) {
      return res.status(400).json({ message: 'Clé de page (pageKey) obligatoire.' });
    }
    const pageKey = seoData.pageKey.toLowerCase().trim();

    if (seoData.customUrl) {
      seoData.customUrl = normalizeCustomPath(seoData.customUrl);
    }

    if (isMongoConnected()) {
      const existing = await Seo.findOne({ pageKey });
      if (existing) {
        return res.status(400).json({ message: 'Une configuration SEO existe déjà pour cette page.' });
      }
      const newSeo = new Seo({ ...seoData, pageKey });
      const saved = await newSeo.save();

      if (saved.customUrl) {
        try {
          await CustomUrl.create({
            customPath: saved.customUrl,
            targetUrl: `/${saved.pageKey}`,
            targetType: 'custom',
            targetId: saved._id.toString(),
            description: `SEO Custom Path for ${saved.pageName || saved.pageKey}`
          });
        } catch (syncErr) {
          console.warn('Sync CustomUrl non bloquant:', syncErr.message);
        }
      }

      return res.status(201).json(saved);
    }

    const existing = memoryStore.seo.find((s) => s.pageKey === pageKey);
    if (existing) {
      return res.status(400).json({ message: 'Une configuration SEO existe déjà pour cette page.' });
    }

    const saved = {
      _id: `seo_${Date.now()}`,
      ...seoData,
      pageKey,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memoryStore.seo.push(saved);
    return res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Erreur création configuration SEO' });
  }
});

export default router;
