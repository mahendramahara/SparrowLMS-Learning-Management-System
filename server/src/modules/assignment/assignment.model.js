const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Assignment title is required'],
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Associated course is required'],
      index: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Instructor is required'],
      index: true,
    },
    instructions: {
      type: String,
      default: '',
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    points: {
      type: Number,
      default: 100,
    },
    status: {
      type: String,
      enum: ['Open', 'Closed', 'Archived'],
      default: 'Open',
    },
    submissionsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Assignment', assignmentSchema);
