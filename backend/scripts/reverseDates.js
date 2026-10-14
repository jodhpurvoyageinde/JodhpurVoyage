import 'dotenv/config';
import mongoose from 'mongoose';

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    // 1. Update Blogs (58 documents, index 0 is most recent, index 57 is oldest ~2016)
    const blogs = await db.collection('blogs').find({}).sort({ _id: 1 }).toArray();
    console.log(`Updating ${blogs.length} blogs...`);

    const blogStartDate = new Date('2026-10-06T14:00:00.000Z').getTime();
    const blogEndDate = new Date('2016-06-20T10:00:00.000Z').getTime();
    const blogStep = (blogStartDate - blogEndDate) / Math.max(blogs.length - 1, 1);

    for (let i = 0; i < blogs.length; i++) {
      const blogTime = new Date(blogStartDate - (i * blogStep));
      await db.collection('blogs').updateOne(
        { _id: blogs[i]._id },
        { 
          $set: { 
            createdAt: blogTime,
            publishedAt: blogTime,
            updatedAt: blogTime
          } 
        }
      );
    }
    console.log('Blogs updated successfully!');

    // 2. Update Commentaires (226 documents, index 0 is most recent, index 225 is oldest ~2011)
    const reviews = await db.collection('commentaires').find({}).sort({ _id: 1 }).toArray();
    console.log(`Updating ${reviews.length} commentaires...`);

    const revStartDate = new Date('2026-10-08T12:00:00.000Z').getTime();
    const revEndDate = new Date('2011-05-15T09:00:00.000Z').getTime();
    const revStep = (revStartDate - revEndDate) / Math.max(reviews.length - 1, 1);

    const monthsFr = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

    for (let i = 0; i < reviews.length; i++) {
      const revTime = new Date(revStartDate - (i * revStep));
      const mName = monthsFr[revTime.getMonth()];
      const yName = revTime.getFullYear();
      const formattedTravelDate = `${mName} ${yName}`;

      const updateDoc = {
        createdAt: revTime,
        updatedAt: revTime
      };

      if (!reviews[i].travelDate) {
        updateDoc.travelDate = formattedTravelDate;
      }

      await db.collection('commentaires').updateOne(
        { _id: reviews[i]._id },
        { $set: updateDoc }
      );
    }
    console.log('Commentaires updated successfully!');

    // Verify first 5 and last 5 blogs
    const topBlogs = await db.collection('blogs').find({}).sort({ createdAt: -1 }).limit(5).project({ title: 1, createdAt: 1 }).toArray();
    console.log('\n--- TOP 5 BLOGS (NEWEST FIRST) ---');
    topBlogs.forEach((b, i) => console.log(`${i + 1}. ${b.title} | ${b.createdAt.toISOString().slice(0, 10)}`));

    const bottomBlogs = await db.collection('blogs').find({}).sort({ createdAt: 1 }).limit(5).project({ title: 1, createdAt: 1 }).toArray();
    console.log('\n--- BOTTOM 5 BLOGS (OLDEST LAST) ---');
    bottomBlogs.forEach((b, i) => console.log(`${i + 1}. ${b.title} | ${b.createdAt.toISOString().slice(0, 10)}`));

    // Verify first 5 and last 5 reviews
    const topReviews = await db.collection('commentaires').find({}).sort({ createdAt: -1 }).limit(5).project({ heading: 1, title: 1, createdAt: 1, travelDate: 1 }).toArray();
    console.log('\n--- TOP 5 REVIEWS (NEWEST FIRST) ---');
    topReviews.forEach((r, i) => console.log(`${i + 1}. ${r.heading || r.title} | ${r.createdAt.toISOString().slice(0, 10)} | ${r.travelDate}`));

    const bottomReviews = await db.collection('commentaires').find({}).sort({ createdAt: 1 }).limit(5).project({ heading: 1, title: 1, createdAt: 1, travelDate: 1 }).toArray();
    console.log('\n--- BOTTOM 5 REVIEWS (OLDEST LAST) ---');
    bottomReviews.forEach((r, i) => console.log(`${i + 1}. ${r.heading || r.title} | ${r.createdAt.toISOString().slice(0, 10)} | ${r.travelDate}`));

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

run();
