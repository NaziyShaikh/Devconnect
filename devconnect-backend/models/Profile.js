import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  bio: String,
  skills: [String],
  github: String,
  portfolio: String,
});

export default mongoose.model('Profile', profileSchema);
