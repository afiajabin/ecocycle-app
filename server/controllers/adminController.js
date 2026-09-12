const User = require('../models/User');
const Request = require('../models/Request');
const Facility = require('../models/Facility');

/**
 * @desc    Get System-wide Statistics & Analytics (Admin Dashboard)
 * @route   GET /api/admin/stats
 * @access  Private (Admin only)
 */
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalCitizens = await User.countDocuments({ role: { $in: ['citizen', 'user'] } });
    const totalCollectors = await User.countDocuments({ role: 'collector' });
    const totalFacilities = await Facility.countDocuments({});

    const allRequests = await Request.find({});
    const totalRequests = allRequests.length;
    const pendingRequests = allRequests.filter(r => r.status === 'Pending').length;
    const acceptedRequests = allRequests.filter(r => r.status === 'Accepted').length;
    const collectedRequests = allRequests.filter(r => r.status === 'Collected').length;
    const deliveredRequests = allRequests.filter(r => ['Delivered to Facility', 'Completed'].includes(r.status)).length;
    const completedRequests = allRequests.filter(r => r.status === 'Completed').length;

    // Total plastic volume in kilograms
    const totalRecycledKg = allRequests
      .filter(r => ['Collected', 'Delivered to Facility', 'Completed'].includes(r.status))
      .reduce((sum, r) => sum + (Number(r.verifiedKg || r.estimatedKg) || 0), 0);

    // Total plant received volume
    const allFacilities = await Facility.find({});
    const totalPlantReceivedKg = allFacilities.reduce((sum, f) => sum + (Number(f.totalReceivedKg) || 0), 0);

    // Plastic type distribution
    const plasticBreakdown = {};
    allRequests.forEach(r => {
      const weight = Number(r.verifiedKg || r.estimatedKg || 0);
      (r.plasticTypes || []).forEach(type => {
        plasticBreakdown[type] = (plasticBreakdown[type] || 0) + weight;
      });
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalCitizens,
        totalCollectors,
        totalFacilities,
        totalRequests,
        pendingRequests,
        acceptedRequests,
        collectedRequests,
        deliveredRequests,
        completedRequests,
        totalRecycledKg: Math.round(totalRecycledKg * 10) / 10,
        totalPlantReceivedKg: Math.round(totalPlantReceivedKg * 10) / 10,
        plasticBreakdown,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching admin statistics',
    });
  }
};

/**
 * @desc    Get All Users (Citizens, Collectors, Admins) with filters
 * @route   GET /api/admin/users
 * @access  Private (Admin only)
 */
const getAllUsers = async (req, res) => {
  try {
    const { role, district, status, search } = req.query;
    const query = {};

    if (role && role !== 'all') {
      if (role === 'user' || role === 'citizen') {
        query.role = { $in: ['citizen', 'user'] };
      } else {
        query.role = role;
      }
    }

    if (district && district !== 'all') {
      query.district = district;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { district: searchRegex },
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update User Status / Info (Admin)
 * @route   PATCH /api/admin/users/:id
 * @access  Private (Admin only)
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, district, status, role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (district) user.district = district;
    if (status) user.status = status;
    if (role) user.role = role;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete User (Admin)
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin only)
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: `User '${user.name}' deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get All Collectors with Performance & Jurisdiction
 * @route   GET /api/admin/collectors
 * @access  Private (Admin only)
 */
const getAllCollectors = async (req, res) => {
  try {
    const collectors = await User.find({ role: 'collector' })
      .select('-password')
      .sort({ totalCollections: -1 });

    res.status(200).json({
      success: true,
      count: collectors.length,
      data: collectors,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Assign / Update Collector Districts & Vehicle
 * @route   PATCH /api/admin/collectors/:id/jurisdiction
 * @access  Private (Admin only)
 */
const assignCollectorJurisdiction = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedDistricts, vehicleType, vehicleNumber, status } = req.body;

    const collector = await User.findById(id);
    if (!collector || collector.role !== 'collector') {
      return res.status(404).json({ success: false, message: 'Collector not found' });
    }

    if (assignedDistricts) collector.assignedDistricts = assignedDistricts;
    if (vehicleType) collector.vehicleType = vehicleType;
    if (vehicleNumber) collector.vehicleNumber = vehicleNumber;
    if (status) collector.status = status;

    const updated = await collector.save();

    res.status(200).json({
      success: true,
      message: `Jurisdiction updated for collector ${collector.name}`,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get All Pickup Requests Across All Districts (Admin Overview)
 * @route   GET /api/admin/requests
 * @access  Private (Admin only)
 */
const getAllRequests = async (req, res) => {
  try {
    const { status, district, search } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (district && district !== 'all') {
      query.district = district;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { requestId: searchRegex },
        { userName: searchRegex },
        { collectorName: searchRegex },
        { address: searchRegex },
        { plasticTypes: { $in: [searchRegex] } },
      ];
    }

    const requests = await Request.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Assign Collector to Request (Admin Override)
 * @route   PATCH /api/admin/requests/:id/assign
 * @access  Private (Admin only)
 */
const assignRequestCollector = async (req, res) => {
  try {
    const { id } = req.params;
    const { collectorId } = req.body;

    const collector = await User.findById(collectorId);
    if (!collector || collector.role !== 'collector') {
      return res.status(400).json({ success: false, message: 'Invalid collector ID' });
    }

    const request = await Request.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { requestId: id }],
    });

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    request.collectorId = collector._id;
    request.collectorName = collector.name;
    if (request.status === 'Pending') {
      request.status = 'Accepted';
    }

    const updated = await request.save();

    res.status(200).json({
      success: true,
      message: `Assigned collector ${collector.name} to request #${request.requestId}`,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete Request (Admin)
 * @route   DELETE /api/admin/requests/:id
 * @access  Private (Admin only)
 */
const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findOneAndDelete({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { requestId: id }],
    });

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    res.status(200).json({
      success: true,
      message: `Request #${request.requestId} deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get All Recycling Facilities (Admin)
 * @route   GET /api/admin/facilities
 * @access  Private (Admin only)
 */
const getAdminFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find({}).sort({ totalReceivedKg: -1 });
    res.status(200).json({
      success: true,
      count: facilities.length,
      data: facilities,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create a New Facility (Admin)
 * @route   POST /api/admin/facilities
 * @access  Private (Admin only)
 */
const createFacility = async (req, res) => {
  try {
    const facility = await Facility.create(req.body);
    res.status(201).json({
      success: true,
      message: `Recycling facility '${facility.name}' added successfully`,
      data: facility,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update Facility (Admin)
 * @route   PUT /api/admin/facilities/:id
 * @access  Private (Admin only)
 */
const updateFacility = async (req, res) => {
  try {
    const { id } = req.params;
    const facility = await Facility.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!facility) {
      return res.status(404).json({ success: false, message: 'Facility not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Facility updated successfully',
      data: facility,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete Facility (Admin)
 * @route   DELETE /api/admin/facilities/:id
 * @access  Private (Admin only)
 */
const deleteFacility = async (req, res) => {
  try {
    const { id } = req.params;
    const facility = await Facility.findByIdAndDelete(id);
    if (!facility) {
      return res.status(404).json({ success: false, message: 'Facility not found' });
    }

    res.status(200).json({
      success: true,
      message: `Facility '${facility.name}' deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllCollectors,
  assignCollectorJurisdiction,
  getAllRequests,
  assignRequestCollector,
  deleteRequest,
  getAdminFacilities,
  createFacility,
  updateFacility,
  deleteFacility,
};
