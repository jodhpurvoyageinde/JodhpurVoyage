import mongoose from 'mongoose';

const customUrlSchema = new mongoose.Schema(
  {
    customPath: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    targetUrl: {
      type: String,
      required: true,
      trim: true
    },
    targetType: {
      type: String,
      enum: ['tour', 'destination', 'blog', 'custom', 'redirect'],
      default: 'custom'
    },
    targetId: {
      type: String,
      default: '',
      trim: true
    },
    redirectType: {
      type: Number,
      enum: [200, 301, 302],
      default: 301
    },
    active: {
      type: Boolean,
      default: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Normalize customPath before saving (e.g. ensure leading slash if omitted)
customUrlSchema.pre('save', function (next) {
  if (this.customPath && !this.customPath.startsWith('/')) {
    this.customPath = '/' + this.customPath;
  }
  next();
});

const CustomUrl = mongoose.model('CustomUrl', customUrlSchema);
export default CustomUrl;
