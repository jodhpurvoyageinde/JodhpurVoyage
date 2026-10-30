import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB successfully');
  
  const collections = await mongoose.connection.db.listCollections().toArray();
  const searchTerms = ['joyaux', 'kerala', 'benares', 'taj-mahal', 'spiti'];

  for (const coll of collections) {
    const docs = await mongoose.connection.db.collection(coll.name).find().toArray();
    for (const doc of docs) {
      const docStr = JSON.stringify(doc).toLowerCase();
      for (const term of searchTerms) {
        if (docStr.includes(term)) {
          console.log(`[Collection: ${coll.name}] Match for '${term}':`);
          console.log({
            _id: doc._id,
            slug: doc.slug,
            title: doc.title,
            name: doc.name,
            sourceUrl: doc.sourceUrl,
            targetUrl: doc.targetUrl,
            pageName: doc.pageName,
            url: doc.url
          });
          break;
        }
      }
    }
  }

  await mongoose.disconnect();
}

run().catch(console.error);
