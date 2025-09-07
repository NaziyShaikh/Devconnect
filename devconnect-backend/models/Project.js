import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  techStack: [String],
  rolesNeeded: [String], // e.g. ['Frontend', 'Backend', 'Designer']
  status: { type: String, enum: ['Idea', 'In Progress', 'Completed'], default: 'Idea' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  banner: String, // optional Cloudinary image URL
  image: String // alternative image field for compatibility
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
