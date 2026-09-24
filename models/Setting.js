import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({}, {
  timestamps: true,
  collection: 'settings',
  strict: false
});

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;
