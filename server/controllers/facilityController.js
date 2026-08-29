const Facility = require('../models/Facility');

/**
 * @desc    Get all authorized recycling facilities
 * @route   GET /api/facilities
 * @access  Public
 */
const getFacilities = async (req, res) => {
  try {
    const { district } = req.query;
    const filter = district && district !== 'all' ? { district } : {};
    
    const facilities = await Facility.find(filter).sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: facilities.length,
      data: facilities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get single facility details
 * @route   GET /api/facilities/:id
 * @access  Public
 */
const getFacilityById = async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found',
      });
    }
    res.status(200).json({
      success: true,
      data: facility,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Create a new facility
 * @route   POST /api/facilities
 * @access  Private (Admin)
 */
const createFacility = async (req, res) => {
  try {
    const facility = await Facility.create(req.body);
    res.status(201).json({
      success: true,
      data: facility,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getFacilities,
  getFacilityById,
  createFacility,
};
