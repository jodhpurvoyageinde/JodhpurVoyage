import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const collections = await mongoose.connection.db.listCollections().toArray();
  const exactTerms = [
    'joyaux-du-kerala-backwaters',
    'sejour-au-rajasthan-et-benares',
    'taj-mahal-agra',
    'circuit-vallee-de-spiti-et-kinnaur'
  ];

  for (const coll of collections) {
    const docs = await mongoose.connection.db.collection(coll.name).find().toArray();
    for (const doc of docs) {
      const docStr = JSON.stringify(doc).toLowerCase();
      for (const term of exactTerms) {
        if (docStr.includes(term)) {
          console.log(`MATCH in collection [${coll.name}]: term '${term}'`);
          console.log({
            _id: doc._id,
            slug: doc.slug,
            title: doc.title,
            name: doc.name,
            tourSlug: doc.tourSlug
          });
        }
      }
    }
  }

  await mongoose.disconnect();
}

run().catch(console.error);
