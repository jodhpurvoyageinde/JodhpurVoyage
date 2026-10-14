import mongoose from 'mongoose';

const heroSliderSchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, 'Image URL or path is required'],
    trim: true
  },
  badge: {
    type: String,
    default: '',
    trim: true
  },
  badgeIcon: {
    type: String,
    default: 'fa-star',
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  titleHighlight: {
    type: String,
    default: '',
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'herosliders'
});

const HeroSlider = mongoose.model('HeroSlider', heroSliderSchema);
export default HeroSlider;
