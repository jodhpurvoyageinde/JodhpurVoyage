import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  authorName: {
    type: String,
    required: true,
    trim: true
  },
  authorCity: {
    type: String,
    default: 'France'
  },
  tourTitle: {
    type: String,
    default: 'Voyage au Rajasthan'
  },
  category: {
    type: String,
    enum: ['rajasthan', 'inde-du-nord', 'ladakh', 'inde-du-sud', 'gujarat', 'nepal'],
    default: 'rajasthan'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 5
  },
  travelDate: {
    type: String,
    default: 'Janvier 2026'
  },
  comment: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  image: {
    type: String,
    default: '/images/image-8.jpg'
  },
  img: {
    type: String,
    default: '/images/image-8.jpg'
  },
  fallbackImg: {
    type: String,
    default: '/images/image-8.jpg'
  },
  title: {
    type: String,
    default: ''
  },
  slug: {
    type: String,
    sparse: true
  },
  tag: {
    type: String,
    default: ''
  },
  tagIcon: {
    type: String,
    default: 'fas fa-map-marker-alt'
  },
  link: {
    type: String,
    default: '/tour-rajasthan'
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

const Review = mongoose.model('Review', reviewSchema);
export default Review;
