const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['citizen', 'user', 'collector', 'admin'],
      default: 'citizen',
    },
    phone: {
      type: String,
      default: '+880 1712-345678',
    },
    district: {
      type: String,
      required: [true, 'Please specify your district'],
      default: 'Dhaka',
    },
    address: {
      type: String,
      default: 'House 42, Road 9A, Dhanmondi, Dhaka',
    },
    // Collector specific fields
    assignedDistricts: {
      type: [String],
      default: ['Dhaka', 'Gazipur'],
    },
    vehicleType: {
      type: String,
      default: 'Electric Waste Van (EV-04)',
    },
    vehicleNumber: {
      type: String,
      default: 'Dhaka Metro-DH-11-2045',
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    totalCollections: {
      type: Number,
      default: 0,
    },
    // Citizen specific stats
    totalRecycledKg: {
      type: Number,
      default: 0,
    },
    totalRequestsCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving to database
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
