import mongoose from 'mongoose';

// In-Memory store fallback
export const memoryStore = {
  users: [],
  tours: [],
  destinations: [],
  reviews: [],
  blogs: [],
  bookings: [],
  contacts: [],
  seo: [],
  heroSliders: []
};

export const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};
