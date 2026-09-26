import mongoose from 'mongoose';

const seoSchema = new mongoose.Schema(
  {
    pageKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    pageName: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    keywords: {
      type: String,
      default: '',
      trim: true
    },
    ogTitle: {
      type: String,
      default: '',
      trim: true
    },
    ogDescription: {
      type: String,
      default: '',
      trim: true
    },
    ogImage: {
      type: String,
      default: '',
      trim: true
    },
    canonicalUrl: {
      type: String,
      default: '',
      trim: true
    },
    customUrl: {
      type: String,
      default: '',
      trim: true,
      lowercase: true
    },
    structuredData: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Seo = mongoose.model('Seo', seoSchema);
export default Seo;
