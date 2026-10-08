import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  slug: {
    type: String,
    trim: true,
    default: ''
  },
  heading: {
    type: String,
    trim: true,
    default: ''
  },
  title: {
    type: String,
    trim: true,
    default: ''
  },
  image: {
    type: String,
    default: '/images/image-8.jpg'
  },
  img: {
    type: String,
    default: '/images/image-8.jpg'
  },
  shortDescription: {
    type: String,
    default: ''
  },
  longDescription: {
    type: String,
    default: ''
  },
  // Legacy / backward-compatible fields
  comment: {
    type: String,
    default: ''
  },
  excerpt: {
    type: String,
    default: ''
  },
  authorName: {
    type: String,
    default: ''
  },
  authorCity: {
    type: String,
    default: 'France'
  },
  tourTitle: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'rajasthan'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  travelDate: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['approved', 'pending', 'rejected'],
    default: 'approved'
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'commentaires',
  strict: false
});

reviewSchema.pre('save', function (next) {
  if (this.heading && !this.title) this.title = this.heading;
  if (this.title && !this.heading) this.heading = this.title;
  if (this.shortDescription && !this.excerpt) this.excerpt = this.shortDescription;
  if (this.excerpt && !this.shortDescription) this.shortDescription = this.excerpt;
  if (this.longDescription && !this.comment) this.comment = this.longDescription;
  if (this.comment && !this.longDescription) this.longDescription = this.comment;
  if (this.image && !this.img) this.img = this.image;
  if (this.img && !this.image) this.image = this.img;
  if (!this.slug && (this.heading || this.title)) {
    this.slug = String(this.heading || this.title)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
