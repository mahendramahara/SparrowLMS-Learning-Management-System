const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide lesson title'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['video', 'resource', 'article', 'quiz'],
      default: 'video',
    },
    duration: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    videoPublicId: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    isFreePreview: {
      type: Boolean,
      default: false,
    },
    attachedFile: {
      name: { type: String, default: '' },
      size: { type: String, default: '' },
      type: { type: String, default: '' },
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

lessonSchema.index({ chapterId: 1, order: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);
