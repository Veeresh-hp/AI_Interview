const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
  jobDescription: { type: String },
  mode: { type: String, enum: ['Resume Only', 'JD Only', 'Resume + JD'] },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
  score: { type: Number },
  generalFeedback: { type: String },
  qna: [{
    question: String,
    answer: String,
    feedback: String,
    score: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('Interview', InterviewSchema);
