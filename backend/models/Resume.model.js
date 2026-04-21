const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  filename: { type: String, required: true },
  extractedText: { type: String },
  structuredData: { type: Object }, // For resume builder form fields
  template: { type: String, default: 'latex' },
  status: { type: String, enum: ['draft', 'saved'], default: 'draft' }
}, { timestamps: true });

module.exports = mongoose.model('Resume', ResumeSchema);
