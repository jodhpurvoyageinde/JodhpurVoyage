import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import PageContent from '../models/PageContent.js';
import { defaultPagesData } from '../seed/pagesSeedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const syncNotreEquipe = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('No MONGODB_URI found');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log('MongoDB connected.');

    const teamData = defaultPagesData['notre-equipe'];
    if (!teamData) {
      console.error('No notre-equipe data found in defaultPagesData');
      process.exit(1);
    }

    const res = await PageContent.findOneAndUpdate(
      { pageKey: 'notre-equipe' },
      {
        pageKey: 'notre-equipe',
        title: teamData.title,
        content: teamData
      },
      { new: true, upsert: true }
    );

    console.log('Successfully synced notre-equipe in MongoDB:', {
      pageKey: res.pageKey,
      title: res.title,
      membersCount: res.content?.members?.length
    });

    await mongoose.disconnect();
    console.log('Disconnected cleanly.');
    process.exit(0);
  } catch (err) {
    console.error('Error syncing notre-equipe:', err.message);
    process.exit(1);
  }
};

syncNotreEquipe();
