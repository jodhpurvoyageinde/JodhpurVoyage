import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({}, {
  timestamps: true,
  collection: 'posts',
  strict: false
});

const Post = mongoose.model('Post', postSchema);
export default Post;
