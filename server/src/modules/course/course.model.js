const mongoose = require('mongoose');
const slugify = require('slugify');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a course title'],
      trim: true,
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Please provide a course description'],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      default: 0,
    },
    thumbnail: {
      type: String,
      default: '',
    },
    duration: {
      type: Number,
      default: 0,
    },
    enrolled: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

courseSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema);
