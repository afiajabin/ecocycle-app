const User = require('../models/User');
const { generateToken } = require('../middleware/authMiddleware');

/**
 * @desc    Register a new user / citizen / collector / admin
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = 'citizen',
      district = 'Dhaka',
      phone,
      assignedDistricts,
      vehicleType,
      vehicleNumber,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create new user in database
    const user = await User.create({
      name,
      email,
      password,
      role,
      district,
      phone: phone || '+880 1712-345678',
      assignedDistricts: assignedDistricts || (district ? [district] : ['Dhaka', 'Gazipur']),
      vehicleType: vehicleType || (role === 'collector' ? 'Electric Waste Van (EV-04)' : undefined),
      vehicleNumber: vehicleNumber || (role === 'collector' ? 'Dhaka Metro-DH-11-2045' : undefined),
    });

    if (user) {
      const token = generateToken(user._id, user.role);
      const userResponse = {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        district: user.district,
        phone: user.phone,
        assignedDistricts: user.assignedDistricts,
        vehicleType: user.vehicleType,
        vehicleNumber: user.vehicleNumber,
        rating: user.rating,
        totalCollections: user.totalCollections,
      };

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        token,
        user: userResponse,
        data: {
          ...userResponse,
          token,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user data received',
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

/**
 * @desc    Authenticate user & get JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Validate password using schema method
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id, user.role);
      const userResponse = {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        district: user.district,
        phone: user.phone,
        assignedDistricts: user.assignedDistricts,
        vehicleType: user.vehicleType,
        vehicleNumber: user.vehicleNumber,
        rating: user.rating,
        totalCollections: user.totalCollections,
      };

      res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: userResponse,
        data: {
          ...userResponse,
          token,
        },
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/auth/me
 * @access  Private (Protected)
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({
      success: true,
      data: user,
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Update current collector profile
 * @route   PUT /api/auth/profile
 * @access  Private (Protected)
 */
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.district = req.body.district || user.district;
    user.vehicleType = req.body.vehicleType || user.vehicleType;
    user.vehicleNumber = req.body.vehicleNumber || user.vehicleNumber;

    if (req.body.assignedDistricts) {
      user.assignedDistricts = req.body.assignedDistricts;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        district: updatedUser.district,
        assignedDistricts: updatedUser.assignedDistricts,
        vehicleType: updatedUser.vehicleType,
        vehicleNumber: updatedUser.vehicleNumber,
        rating: updatedUser.rating,
        totalCollections: updatedUser.totalCollections,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
};
