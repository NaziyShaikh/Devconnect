import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['developer', 'admin'], default: 'developer' },
  bio: String,
  location: String,
  skills: [String],
  experience: String,
  github: String,
  portfolio: String,
  profilePicture: String,
  recentActivities: [String],
  teams: [String],
  responsibilities: [String],
  blocked: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
