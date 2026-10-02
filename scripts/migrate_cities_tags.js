import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const createSlug = (text) => {
  return (text || '')
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

async function migrateCitiesTags() {
  const uri = process.env.MONGODB_URI || process.env.LOCAL_MONGODB_URI;
  if (!uri) {
    console.error('❌ No MONGODB_URI found in .env');
    process.exit(1);
  }

  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB successfully.');

    const db = mongoose.connection.db;

    // 1. Fetch all known cities from cities collection
    const rawCities = await db.collection('cities').find({}).toArray();
    console.log(`📍 Found ${rawCities.length} cities in database.`);

    const cityDictionary = rawCities.map(c => ({
      cityId: String(c._id),
      name: c.name.trim(),
      slug: c.slug || createSlug(c.name)
    }));

    // Add extra common fallback cities if not in DB
    const extraCities = [
      { name: 'Jodhpur', slug: 'jodhpur' },
      { name: 'Jaipur', slug: 'jaipur' },
      { name: 'Udaipur', slug: 'udaipur' },
      { name: 'Jaisalmer', slug: 'jaisalmer' },
      { name: 'Bikaner', slug: 'bikaner' },
      { name: 'Pushkar', slug: 'pushkar' },
      { name: 'Shekhawati', slug: 'shekhawati' },
      { name: 'Delhi', slug: 'delhi' },
      { name: 'Agra', slug: 'agra' },
      { name: 'Varanasi', slug: 'varanasi' },
      { name: 'Amritsar', slug: 'amritsar' },
      { name: 'Dharamsala', slug: 'dharamsala' },
      { name: 'Rishikesh', slug: 'rishikesh' },
      { name: 'Ladakh', slug: 'ladakh' },
      { name: 'Kerala', slug: 'kerala' },
      { name: 'Goa', slug: 'goa' }
    ];

    extraCities.forEach(ec => {
      if (!cityDictionary.some(c => c.name.toLowerCase() === ec.name.toLowerCase())) {
        cityDictionary.push({ cityId: '', name: ec.name, slug: ec.slug });
      }
    });

    console.log(`📚 Total cities dictionary size: ${cityDictionary.length}`);

    // Helper to find matching cities for a tour
    const detectCities = (doc) => {
      const matched = [];
      const textToSearch = [
        doc.cityName || '',
        doc.location || '',
        doc.title || '',
        doc.subtitle || '',
        doc.category || '',
        Array.isArray(doc.tags) ? doc.tags.join(' ') : ''
      ].join(' ').toLowerCase();

      cityDictionary.forEach(c => {
        const cLower = c.name.toLowerCase();
        // check word boundary or match
        if (textToSearch.includes(cLower)) {
          if (!matched.some(m => m.name.toLowerCase() === cLower)) {
            matched.push({
              cityId: c.cityId || '',
              name: c.name,
              slug: c.slug
            });
          }
        }
      });

      // If still empty but cityName exists
      if (matched.length === 0 && doc.cityName) {
        matched.push({
          cityId: String(doc.cityId || ''),
          name: doc.cityName,
          slug: createSlug(doc.cityName)
        });
      }

      // Default fallback if completely untagged
      if (matched.length === 0) {
        matched.push({
          cityId: '',
          name: 'Jodhpur',
          slug: 'jodhpur'
        });
      }

      return matched;
    };

    // 2. Migrate 'tours' collection
    console.log('\n--- Migrating tours collection ---');
    const tours = await db.collection('tours').find({}).toArray();
    let toursUpdated = 0;
    for (const t of tours) {
      if (!Array.isArray(t.cities) || t.cities.length === 0) {
        const detected = detectCities(t);
        await db.collection('tours').updateOne(
          { _id: t._id },
          { 
            $set: { 
              cities: detected,
              category: t.category || 'Rajasthan'
            } 
          }
        );
        toursUpdated++;
      }
    }
    console.log(`✅ Updated ${toursUpdated} / ${tours.length} documents in 'tours' collection.`);

    // 3. Migrate 'blogs' collection (used as source for tours API)
    console.log('\n--- Migrating blogs collection ---');
    const blogs = await db.collection('blogs').find({}).toArray();
    let blogsUpdated = 0;
    for (const b of blogs) {
      if (!Array.isArray(b.cities) || b.cities.length === 0) {
        const detected = detectCities(b);
        await db.collection('blogs').updateOne(
          { _id: b._id },
          { 
            $set: { 
              cities: detected,
              category: b.category || 'Rajasthan'
            } 
          }
        );
        blogsUpdated++;
      }
    }
    console.log(`✅ Updated ${blogsUpdated} / ${blogs.length} documents in 'blogs' collection.`);

    // 4. Sample verification
    const sampleTour = await db.collection('tours').findOne({ 'cities.0': { $exists: true } });
    console.log('\n🔎 Sample Updated Tour:');
    console.log({
      id: sampleTour._id,
      title: sampleTour.title,
      category: sampleTour.category,
      cities: sampleTour.cities
    });

    const sampleBlog = await db.collection('blogs').findOne({ 'cities.0': { $exists: true } });
    console.log('\n🔎 Sample Updated Blog/Tour:');
    console.log({
      id: sampleBlog._id,
      title: sampleBlog.title,
      category: sampleBlog.category,
      cities: sampleBlog.cities
    });

    console.log('\n🎉 Database migration completed successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during migration:', err);
    process.exit(1);
  }
}

migrateCitiesTags();
