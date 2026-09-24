import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingType: {
    type: String,
    enum: ['custom_trip', 'tour_quote'],
    default: 'custom_trip'
  },
  tourTitle: {
    type: String
  },
  tourSlug: {
    type: String
  },
  destinations: [{
    type: String
  }],
  departureDate: {
    type: String
  },
  durationDays: {
    type: String
  },
  adultsCount: {
    type: Number,
    default: 2
  },
  childrenCount: {
    type: Number,
    default: 0
  },
  accommodationType: {
    type: String,
    default: 'Hôtel de Charme / Haveli'
  },
  budgetPerPerson: {
    type: String
  },
  interests: [{
    type: String
  }],
  notes: {
    type: String
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    default: 'France'
  },
  preferredContact: {
    type: String,
    enum: ['email', 'whatsapp', 'phone'],
    default: 'email'
  },
  status: {
    type: String,
    enum: ['nouveau', 'contacte', 'devis_envoye', 'confirme', 'annule'],
    default: 'nouveau'
  },
  adminNotes: {
    type: String
  }
}, {
  timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
