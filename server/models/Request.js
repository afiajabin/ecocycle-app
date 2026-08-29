const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
      default: () => 'REQ-BD-' + Math.floor(1000 + Math.random() * 9000),
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    userName: {
      type: String,
      required: [true, 'Please provide citizen name'],
    },
    userPhone: {
      type: String,
      required: [true, 'Please provide citizen phone number'],
    },
    district: {
      type: String,
      required: [true, 'Please specify district'],
    },
    address: {
      type: String,
      required: [true, 'Please provide pickup address'],
    },
    plasticTypes: {
      type: [String],
      default: ['PET Bottles'],
    },
    estimatedKg: {
      type: Number,
      required: [true, 'Please provide estimated weight in kg'],
    },
    verifiedKg: {
      type: Number,
      default: null,
    },
    preferredDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    preferredTime: {
      type: String,
      default: 'Morning (9:00 AM - 1:00 PM)',
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Collected', 'Delivered to Facility', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    collectorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    collectorName: {
      type: String,
      default: null,
    },
    facilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      default: null,
    },
    facilityName: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Request', requestSchema);
