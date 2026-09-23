const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    instructorAmount: {
      type: Number,
      default: 0,
    },
    platformFee: {
      type: Number,
      default: 0,
    },
    paymentGateway: {
      type: String,
      enum: ['esewa', 'free', 'stripe'],
      default: 'esewa',
    },
    transactionUuid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    transactionCode: {
      type: String,
      default: '',
    },
    refId: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETE', 'FAILED', 'CANCELED', 'REFUNDED'],
      default: 'PENDING',
      index: true,
    },
    rawResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Payment', paymentSchema);
