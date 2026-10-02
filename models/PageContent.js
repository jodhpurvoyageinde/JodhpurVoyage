import mongoose from 'mongoose';

const pageContentSchema = new mongoose.Schema({
  pageKey: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    default: ''
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  collection: 'pagecontents',
  strict: false
});

const PageContent = mongoose.model('PageContent', pageContentSchema);

export default PageContent;
