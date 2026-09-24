import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure Cloudinary if credentials exist
const configureCloudinary = () => {
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    return true;
  }
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config();
    return true;
  }
  return false;
};

// Ensure local uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer disk storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, 'img-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 12 * 1024 * 1024 }, // 12 MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|svg|bmp|tiff|avif/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype) || file.mimetype.startsWith('image/');
    if (extname || mimetype) {
      return cb(null, true);
    }
    cb(new Error('Format de fichier non supporté. Veuillez utiliser JPG, PNG, WEBP ou SVG.'));
  }
});

// POST /api/upload - Upload image from local machine (Cloudinary with local fallback)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier image sélectionné.' });
    }

    const hasCloudinary = configureCloudinary();

    if (hasCloudinary) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'jodhpurvoyage',
          resource_type: 'auto'
        });

        // Remove temp local copy after successful Cloudinary upload
        try {
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
        } catch (e) {}

        return res.json({
          success: true,
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          provider: 'cloudinary'
        });
      } catch (cloudErr) {
        console.warn('Cloudinary upload warning, falling back to local file server:', cloudErr.message);
      }
    }

    // Fallback to local uploads
    const host = req.get('host');
    const protocol = req.protocol;
    const localUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    return res.json({
      success: true,
      url: localUrl,
      filename: req.file.filename,
      provider: 'local'
    });
  } catch (err) {
    console.error('Erreur upload:', err);
    res.status(500).json({ message: err.message || 'Erreur lors du téléchargement de l\'image.' });
  }
});

// GET /api/upload/status - Check Cloudinary configuration status
router.get('/status', (req, res) => {
  const isConfigured = !!(
    (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) ||
    process.env.CLOUDINARY_URL
  );

  res.json({
    cloudinaryConfigured: isConfigured,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || null,
    storage: isConfigured ? 'Cloudinary (Cloud)' : 'Local File Server (/uploads)'
  });
});

export default router;
