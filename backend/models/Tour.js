import mongoose from 'mongoose';

const itineraryDaySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  meals: { type: String, default: 'Petit-déjeuner inclus' },
  accommodation: { type: String, default: 'Hôtel de charme / Haveli de patrimoine' }
});

const tourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  customUrl: {
    type: String,
    lowercase: true,
    trim: true,
    default: ''
  },
  subtitle: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    required: true
  },
  daysCount: {
    type: Number,
    default: 10
  },
  location: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'Rajasthan'
  },
  categoryId: {
    type: String,
    default: ''
  },
  cities: [{
    cityId: { type: String, default: '' },
    name: { type: String, required: true },
    slug: { type: String, required: true }
  }],
  region: {
    type: String,
    default: 'rajasthan'
  },
  theme: {
    type: String,
    default: 'Culture & Patrimoine'
  },
  badge: {
    type: String,
    default: 'Populaire'
  },
  price: {
    type: Number,
    default: 950
  },
  priceUnit: {
    type: String,
    default: '€ / pers'
  },
  rating: {
    type: Number,
    default: 4.9
  },
  reviewCount: {
    type: Number,
    default: 35
  },
  featured: {
    type: Boolean,
    default: false
  },
  published: {
    type: Boolean,
    default: true
  },
  image: {
    type: String,
    required: true
  },
  gallery: [{
    type: String
  }],
  overview: {
    type: String,
    required: true
  },
  highlights: [{
    type: String
  }],
  itinerary: [itineraryDaySchema],
  inclusions: [{
    type: String
  }],
  exclusions: [{
    type: String
  }],
  faq: [{
    question: String,
    answer: String
  }],
  seoTitle: {
    type: String,
    trim: true,
    default: ''
  },
  seoKeywords: {
    type: String,
    trim: true,
    default: ''
  },
  seoDescription: {
    type: String,
    trim: true,
    default: ''
  },
  metaTitle: {
    type: String,
    trim: true,
    default: ''
  },
  metaKeywords: {
    type: String,
    trim: true,
    default: ''
  },
  metaDescription: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true,
  collection: 'tours',
  strict: false
});

const Tour = mongoose.model('Tour', tourSchema);
export default Tour;
