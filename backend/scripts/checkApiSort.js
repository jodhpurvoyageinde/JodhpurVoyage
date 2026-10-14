import 'dotenv/config';
import mongoose from 'mongoose';
import BlogPost from '../models/BlogPost.js';
import Review from '../models/Review.js';

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);

  const blogs = await BlogPost.find({ published: { $ne: false } }).sort({ publishedAt: -1, createdAt: -1 }).limit(5);
  console.log('=== API BLOGS (TOP 5) ===');
  blogs.forEach((b, i) => console.log(`${i + 1}. ${b.title} | ${b.createdAt.toISOString().slice(0, 10)}`));

  const reviews = await Review.find({ status: { $ne: 'rejected' } }).sort({ featured: -1, createdAt: -1 }).limit(5);
  console.log('=== API REVIEWS (TOP 5) ===');
  reviews.forEach((r, i) => console.log(`${i + 1}. ${r.heading || r.title} | ${r.createdAt.toISOString().slice(0, 10)} | ${r.travelDate}`));

  await mongoose.disconnect();
  process.exit(0);
}

check();
