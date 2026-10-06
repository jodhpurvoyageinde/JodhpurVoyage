import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function deleteTravelGuidePackages() {
  let uri = process.env.MONGODB_URI;
  if (uri && uri.includes('<db_password>')) {
    uri = process.env.LOCAL_MONGODB_URI || 'mongodb://127.0.0.1:27017/jodhpurvoyage';
  }

  console.log('Connecting to MongoDB...');
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log('Successfully connected to MongoDB!');

    const db = mongoose.connection.db;
    const query = {
      $or: [
        { category: new RegExp('travel.*guide', 'i') },
        { categoryId: new RegExp('travel.*guide', 'i') },
        { category: 'Travel Guide' },
        { category: 'travel-guide' }
      ]
    };

    // 1. Delete from 'blogs' collection
    const blogsToDelete = await db.collection('blogs').find(query).toArray();
    console.log(`Found ${blogsToDelete.length} items in 'blogs' collection to delete.`);
    
    if (blogsToDelete.length > 0) {
      const blogDeleteResult = await db.collection('blogs').deleteMany(query);
      console.log(`Deleted ${blogDeleteResult.deletedCount} items from 'blogs' collection.`);
    }

    // 2. Delete from 'tours' collection
    const toursToDelete = await db.collection('tours').find(query).toArray();
    console.log(`Found ${toursToDelete.length} items in 'tours' collection to delete.`);
    
    if (toursToDelete.length > 0) {
      const tourDeleteResult = await db.collection('tours').deleteMany(query);
      console.log(`Deleted ${tourDeleteResult.deletedCount} items from 'tours' collection.`);
    }

    // 3. Delete from 'posts' collection
    const postsToDelete = await db.collection('posts').find(query).toArray();
    console.log(`Found ${postsToDelete.length} items in 'posts' collection to delete.`);
    
    if (postsToDelete.length > 0) {
      const postDeleteResult = await db.collection('posts').deleteMany(query);
      console.log(`Deleted ${postDeleteResult.deletedCount} items from 'posts' collection.`);
    }

    console.log('\n--- VERIFICATION AFTER DELETION ---');
    const remainingBlogs = await db.collection('blogs').countDocuments(query);
    const remainingTours = await db.collection('tours').countDocuments(query);
    const remainingPosts = await db.collection('posts').countDocuments(query);

    console.log(`Remaining Travel Guide items - Blogs: ${remainingBlogs}, Tours: ${remainingTours}, Posts: ${remainingPosts}`);

  } catch (error) {
    console.error('Error during deletion:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

deleteTravelGuidePackages();
