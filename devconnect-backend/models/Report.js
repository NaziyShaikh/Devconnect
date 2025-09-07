const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  targetType: { type: String, enum: ['user', 'project'], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  reason: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
