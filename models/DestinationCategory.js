import mongoose from 'mongoose';

const destinationCategorySchema = new mongoose.Schema({}, {
  timestamps: true,
  collection: 'destinationcategories',
  strict: false
});

const DestinationCategory = mongoose.model('DestinationCategory', destinationCategorySchema);
export default DestinationCategory;
