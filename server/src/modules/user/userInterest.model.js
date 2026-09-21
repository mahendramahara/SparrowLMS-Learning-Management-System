const mongoose = require('mongoose');

const categoryAffinitySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      default: 1.0,
      min: 0,
    },
    interactionCount: {
      type: Number,
      default: 1,
    },
    lastInteracted: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const watchItemSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: true,
    },
    courseTitle: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    timeSpentSeconds: {
      type: Number,
      default: 0,
    },
    completedPercentage: {
      type: Number,
      default: 0,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const searchKeywordSchema = new mongoose.Schema(
  {
    keyword: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    count: {
      type: Number,
      default: 1,
    },
    lastSearched: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const userInterestSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    preferredTopics: {
      type: [String],
      default: ['Software Architecture', 'Media Engineering', 'Cybersecurity'],
    },
    preferredSkillLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    categoryAffinities: [categoryAffinitySchema],
    watchHistory: [watchItemSchema],
    searchKeywords: [searchKeywordSchema],
    decayHalfLifeDays: {
      type: Number,
      default: 14,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('UserInterest', userInterestSchema);
