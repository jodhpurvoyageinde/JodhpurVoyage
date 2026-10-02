import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
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
  excerpt: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    required: true
  },
  author: {
    name: { type: String, default: 'Jodhpur Voyage Team' },
    role: { type: String, default: 'Expert Destination Inde' },
    avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' }
  },
  category: {
    type: String,
    default: 'Conseils Voyage'
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
  readTime: {
    type: String,
    default: '5 min de lecture'
  },
  tags: [{
    type: String
  }],
  published: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  seoTitle: {
    type: String,
    default: ''
  },
  seoKeywords: {
    type: String,
    default: ''
  },
  seoDescription: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  collection: 'blogs',
  strict: false
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
export default BlogPost;
