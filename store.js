import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {
  adminUser,
  destinationsData,
  toursData,
  reviewsData,
  blogPostsData,
  sampleBookings,
  sampleMessages
} from './seed/seedData.js';

import { defaultSeoData } from './seed/seoData.js';

// In-Memory store initialized with prototype seed data
export const memoryStore = {
  users: [
    {
      _id: 'user_admin_001',
      name: adminUser.name,
      email: adminUser.email,
      password: bcrypt.hashSync(adminUser.password, 10),
      role: adminUser.role
    }
  ],
  tours: toursData.map((t, idx) => ({
    _id: `tour_${idx + 1}`,
    ...t,
    featured: false,
    createdAt: new Date().toISOString()
  })),
  destinations: destinationsData.map((d, idx) => ({
    _id: `dest_${idx + 1}`,
    ...d,
    createdAt: new Date().toISOString()
  })),
  reviews: reviewsData.map((r, idx) => ({
    _id: `review_${idx + 1}`,
    ...r,
    createdAt: new Date().toISOString()
  })),
  blogs: blogPostsData.map((b, idx) => ({
    _id: `blog_${idx + 1}`,
    ...b,
    featured: false,
    createdAt: new Date().toISOString()
  })),
  bookings: sampleBookings.map((b, idx) => ({
    _id: `booking_${idx + 1}`,
    ...b,
    createdAt: new Date().toISOString()
  })),
  contacts: sampleMessages.map((m, idx) => ({
    _id: `contact_${idx + 1}`,
    ...m,
    createdAt: new Date().toISOString()
  })),
  seo: defaultSeoData.map((s, idx) => ({
    _id: `seo_${idx + 1}`,
    ...s,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }))
};

export const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};
