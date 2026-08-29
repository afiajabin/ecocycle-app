const Request = require('../models/Request');
const Facility = require('../models/Facility');
const User = require('../models/User');

/**
 * @desc    Get Collector Dashboard Statistics (KPIs)
 * @route   GET /api/collector/stats
 * @access  Private (Collector/Admin)
 */
const getCollectorStats = async (req, res) => {
  try {
    const collector = req.user;
    const assignedDistricts = collector.assignedDistricts?.length
      ? collector.assignedDistricts
      : [collector.district || 'Dhaka'];

    // Find all requests in collector's territory
    const districtRequests = await Request.find({
      district: { $in: assignedDistricts },
    });

    const pendingRequests = districtRequests.filter(
      (r) => r.status === 'Pending'
    );
    const acceptedRequests = districtRequests.filter(
      (r) =>
        r.status === 'Accepted' &&
        (!r.collectorId || r.collectorId.toString() === collector._id.toString())
    );
    const collectedRequests = districtRequests.filter(
      (r) => r.status === 'Collected'
    );
    const deliveredRequests = districtRequests.filter(
      (r) => r.status === 'Delivered to Facility' || r.status === 'Completed'
    );

    // Sum total kilograms collected/delivered
    const totalCollectedKg = districtRequests
      .filter((r) => ['Collected', 'Delivered to Facility', 'Completed'].includes(r.status))
      .reduce((acc, r) => acc + (Number(r.verifiedKg || r.estimatedKg) || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        assignedDistricts,
        pendingCount: pendingRequests.length,
        acceptedCount: acceptedRequests.length,
        inTransitCount: collectedRequests.length,
        deliveredCount: deliveredRequests.length,
        totalCollectedKg: Math.round(totalCollectedKg * 10) / 10,
        totalRequestsInJurisdiction: districtRequests.length,
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching collector statistics',
    });
  }
};

/**
 * @desc    Get Pickup Requests in Collector's Territory (with search & filtering)
 * @route   GET /api/collector/requests
 * @access  Private (Collector/Admin)
 */
const getDistrictRequests = async (req, res) => {
  try {
    const collector = req.user;
    const assignedDistricts = collector.assignedDistricts?.length
      ? collector.assignedDistricts
      : [collector.district || 'Dhaka'];

    const { status, district, search } = req.query;

    // Build Mongo query
    const query = {};

    // Filter by district (defaults to assigned jurisdiction)
    if (district && district !== 'all') {
      query.district = district;
    } else {
      query.district = { $in: assignedDistricts };
    }

    // Filter by status tab
    if (status && status !== 'all') {
      query.status = status;
    }

    // Search filter across ID, citizen name, address, or plastic types
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { requestId: searchRegex },
        { userName: searchRegex },
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
    console.error('Fetch requests error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching pickup requests',
    });
  }
};

/**
 * @desc    Get a single request by ID
 * @route   GET /api/collector/requests/:id
 * @access  Private (Collector/Admin)
 */
const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    // Search by Mongo _id or custom requestId string (e.g. REQ-BD-8901)
    const request = await Request.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { requestId: id }],
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: `Request with identifier '${id}' not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Accept a citizen pickup request
 * @route   PATCH /api/collector/requests/:id/accept
 * @access  Private (Collector/Admin)
 */
const acceptRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const collector = req.user;

    const request = await Request.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { requestId: id }],
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    request.status = 'Accepted';
    request.collectorId = collector._id;
    request.collectorName = collector.name;

    const updatedRequest = await request.save();

    res.status(200).json({
      success: true,
      message: `Pickup request #${request.requestId} accepted successfully.`,
      data: updatedRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Verify weight with scale and mark request as Collected
 * @route   PATCH /api/collector/requests/:id/collect
 * @access  Private (Collector/Admin)
 */
const collectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { verifiedKg } = req.body;
    const collector = req.user;

    if (!verifiedKg || Number(verifiedKg) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid verified scale weight in kg (greater than 0)',
      });
    }

    const request = await Request.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { requestId: id }],
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    request.status = 'Collected';
    request.verifiedKg = Number(verifiedKg);
    request.collectorId = collector._id;
    request.collectorName = collector.name;

    const updatedRequest = await request.save();

    // Increment collector total collections
    await User.findByIdAndUpdate(collector._id, {
      $inc: { totalCollections: 1 },
    });

    res.status(200).json({
      success: true,
      message: `Request #${request.requestId} marked as Collected (${verifiedKg} kg verified). Ready for facility transport.`,
      data: updatedRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Deliver collected waste to recycling facility
 * @route   PATCH /api/collector/requests/:id/deliver
 * @access  Private (Collector/Admin)
 */
const deliverToFacility = async (req, res) => {
  try {
    const { id } = req.params;
    const { facilityId } = req.body;

    if (!facilityId) {
      return res.status(400).json({
        success: false,
        message: 'Please select a destination recycling facility',
      });
    }

    const facility = await Facility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Selected facility not found',
      });
    }

    const request = await Request.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { requestId: id }],
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    request.status = 'Delivered to Facility';
    request.facilityId = facility._id;
    request.facilityName = facility.name;

    const updatedRequest = await request.save();

    // Add weight to facility's totalReceivedKg
    const weightReceived = Number(request.verifiedKg || request.estimatedKg || 0);
    facility.totalReceivedKg = (facility.totalReceivedKg || 0) + weightReceived;
    await facility.save();

    res.status(200).json({
      success: true,
      message: `Request #${request.requestId} delivered to ${facility.name}.`,
      data: updatedRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Mark request as Completed (Finalized Recycling)
 * @route   PATCH /api/collector/requests/:id/complete
 * @access  Private (Collector/Admin)
 */
const completeRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await Request.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { requestId: id }],
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    request.status = 'Completed';
    const updatedRequest = await request.save();

    res.status(200).json({
      success: true,
      message: `Request #${request.requestId} confirmed and recycled successfully!`,
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
  getCollectorStats,
  getDistrictRequests,
  getRequestById,
  acceptRequest,
  collectRequest,
  deliverToFacility,
  completeRequest,
};
