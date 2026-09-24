import mongoose from 'mongoose';

const heroSliderSchema = new mongoose.Schema({}, {
  timestamps: true,
  collection: 'herosliders',
  strict: false
});

const HeroSlider = mongoose.model('HeroSlider', heroSliderSchema);
export default HeroSlider;
