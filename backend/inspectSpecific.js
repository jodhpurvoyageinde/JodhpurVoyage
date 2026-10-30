import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const customUrls = await mongoose.connection.db.collection('customurls').find().toArray();
  console.log('--- ALL CUSTOM URLS --- (' + customUrls.length + ' total)');
  for (const u of customUrls) {
    console.log(JSON.stringify(u));
  }
  
  console.log('\n--- TOURS SLUGS ---');
  const tours = await mongoose.connection.db.collection('tours').find().project({ slug: 1, title: 1 }).toArray();
  for (const t of tours) {
    if (
      t.slug?.includes('kerala') || t.slug?.includes('benares') || t.slug?.includes('spiti') || t.slug?.includes('taj-mahal') ||
      t.title?.toLowerCase().includes('kerala') || t.title?.toLowerCase().includes('benares') || t.title?.toLowerCase().includes('spiti') || t.title?.toLowerCase().includes('taj mahal') ||
      t.slug?.includes('joyaux') || t.title?.toLowerCase().includes('joyaux')
    ) {
      console.log('TOUR:', t);
    }
  }

  console.log('\n--- DESTINATIONS SLUGS ---');
  const dests = await mongoose.connection.db.collection('destinations').find().project({ slug: 1, name: 1, title: 1 }).toArray();
  for (const d of dests) {
    console.log('DEST:', d);
  }

  console.log('\n--- DESTINATION CATEGORIES SLUGS ---');
  const cats = await mongoose.connection.db.collection('destinationcategories').find().project({ slug: 1, name: 1 }).toArray();
  for (const c of cats) {
    console.log('DEST_CAT:', c);
  }

  console.log('\n--- CITIES ---');
  const cities = await mongoose.connection.db.collection('cities').find().project({ slug: 1, name: 1 }).toArray();
  for (const c of cities) {
    console.log('CITY:', c);
  }

  console.log('\n--- POSTS (WP / Legacy / Blogs) ---');
  const posts = await mongoose.connection.db.collection('posts').find({
    $or: [
      { slug: { $regex: 'kerala|benares|taj-mahal|spiti|joyaux', $options: 'i' } },
      { title: { $regex: 'kerala|benares|taj-mahal|spiti|joyaux', $options: 'i' } }
    ]
  }).project({ slug: 1, title: 1 }).toArray();
  for (const p of posts) {
    console.log('POST:', p);
  }

  await mongoose.disconnect();
}

run().catch(console.error);
