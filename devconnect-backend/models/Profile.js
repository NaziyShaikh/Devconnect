import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  bio: String,
  skills: [String],
  github: String,
  portfolio: String,
  experience: String,
  location: String,
  role: { type: String, default: 'Developer' },
  profilePicture: String,
  resume: String,
}, {
  timestamps: true
});

export default mongoose.model('Profile', profileSchema);
