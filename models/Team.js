import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({}, {
  timestamps: true,
  collection: 'teams',
  strict: false
});

const Team = mongoose.model('Team', teamSchema);
export default Team;
