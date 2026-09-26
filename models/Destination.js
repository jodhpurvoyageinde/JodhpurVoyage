import mongoose from 'mongoose';

const attractionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }
});

const destinationSchema = new mongoose.Schema({
  name: {
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
  region: {
    type: String,
    required: true,
    enum: ['inde-du-nord', 'inde-du-sud', 'ladakh', 'gujarat', 'nepal', 'bhoutan', 'centre-est'],
    default: 'inde-du-nord'
  },
  tagline: {
    type: String,
    trim: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  fullDescription: {
    type: String
  },
  bestTimeToVisit: {
    type: String,
    default: "D'octobre à avril"
  },
  climateInfo: {
    type: String
  },
  image: {
    type: String,
    required: true
  },
  gallery: [{
    type: String
  }],
  highlights: [{
    type: String
  }],
  keyAttractions: [attractionSchema],
  featured: {
    type: Boolean,
    default: false
  },
  published: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'cities',
  strict: false
});

const Destination = mongoose.model('Destination', destinationSchema);
export default Destination;
