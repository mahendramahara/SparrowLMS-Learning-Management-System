const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide chapter title'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

chapterSchema.virtual('lessons', {
  ref: 'Lesson',
  localField: '_id',
  foreignField: 'chapterId',
  justOne: false,
  options: { sort: { order: 1 } },
});

chapterSchema.index({ courseId: 1, order: 1 });

module.exports = mongoose.model('Chapter', chapterSchema);
