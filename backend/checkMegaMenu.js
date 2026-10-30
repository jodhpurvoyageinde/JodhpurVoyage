import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const menus = await mongoose.connection.db.collection('megamenus').find().toArray();
  console.log('--- MEGAMENUS ---');
  for (const m of menus) {
    console.log(JSON.stringify(m, null, 2));
  }
  await mongoose.disconnect();
}

run().catch(console.error);

