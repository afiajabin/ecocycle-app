const Request = require('../models/Request');
const User = require('../models/User');

/**
 * @desc    Create a new pickup request (Citizen)
 * @route   POST /api/requests
 * @access  Private (Citizen/User)
 */
const createPickupRequest = async (req, res) => {
  try {
    const {
      plasticTypes,
      estimatedKg,
      preferredDate,
      preferredTime,
      district,
      address,
      notes,
    } = req.body;

    if (!estimatedKg || Number(estimatedKg) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide estimated weight in kg (greater than 0)',
      });
    }

    const citizen = req.user;

    const newRequest = await Request.create({
      userId: citizen._id,
      userName: citizen.name,
      userPhone: citizen.phone || '+880 1712-345678',
      district: district || citizen.district || 'Dhaka',
      address: address || citizen.address || 'Dhaka, Bangladesh',
      plasticTypes: plasticTypes && plasticTypes.length > 0 ? plasticTypes : ['PET Bottles'],
      estimatedKg: Number(estimatedKg),
      preferredDate: preferredDate || new Date().toISOString().split('T')[0],
      preferredTime: preferredTime || 'Morning (9:00 AM - 1:00 PM)',
      notes: notes || '',
      status: 'Pending',
    });

    // Update citizen stats
    await User.findByIdAndUpdate(citizen._id, {
      $inc: {
        totalRequestsCount: 1,
        totalRecycledKg: Number(estimatedKg),
      },
    });

    res.status(201).json({
      success: true,
      message: `Pickup request #${newRequest.requestId} created successfully! Assigned to district collector stream.`,
      data: newRequest,
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating pickup request',
    });
  }
};

/**
 * @desc    Get all pickup requests submitted by the logged-in citizen
 * @route   GET /api/requests/my-requests
 * @access  Private (Citizen/User)
 */
const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Cancel a pending request
 * @route   PATCH /api/requests/:id/cancel
 * @access  Private (Citizen/User)
 */
const cancelPickupRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await Request.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { requestId: id }],
      userId: req.user._id,
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found or you are not authorized to cancel this request',
      });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a request that is already '${request.status}'`,
      });
    }

    request.status = 'Cancelled';
    const updatedRequest = await request.save();

    res.status(200).json({
      success: true,
      message: `Request #${request.requestId} cancelled.`,
      data: updatedRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPickupRequest,
  getMyRequests,
  cancelPickupRequest,
};
