const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide facility name'],
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'Please provide district'],
    },
    location: {
      type: String,
      required: [true, 'Please provide detailed location'],
    },
    type: {
      type: String,
      default: 'Mechanical Recycling & Flaking',
    },
    dailyCapacityTons: {
      type: Number,
      default: 50,
    },
    totalReceivedKg: {
      type: Number,
      default: 0,
    },
    contactPerson: {
      type: String,
      default: 'Facility Manager',
    },
    contactPhone: {
      type: String,
      default: '+880 1711-000000',
    },
    status: {
      type: String,
      enum: ['Operational', 'Maintenance', 'Full'],
      default: 'Operational',
    },
    acceptedTypes: {
      type: [String],
      default: ['PET Bottles', 'HDPE Containers', 'PP Plastics'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Facility', facilitySchema);
