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
    subtitle: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a course description'],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please provide a category'],
      index: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'all levels'],
      default: 'beginner',
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      default: 0,
    },
    language: {
      type: String,
      default: 'English',
    },
    thumbnail: {
      type: String,
      default: '',
    },
    thumbnailPublicId: {
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
      default: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },
    tags: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

courseSchema.virtual('chapters', {
  ref: 'Chapter',
  localField: '_id',
  foreignField: 'courseId',
  justOne: false,
  options: { sort: { order: 1 } },
});

courseSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Math.floor(1000 + Math.random() * 9000);
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema);
