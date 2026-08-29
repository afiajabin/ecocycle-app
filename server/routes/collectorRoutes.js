const express = require('express');
const router = express.Router();
const {
  getCollectorStats,
  getDistrictRequests,
  getRequestById,
  acceptRequest,
  collectRequest,
  deliverToFacility,
  completeRequest,
} = require('../controllers/collectorController');
const { protect, authorizeCollector } = require('../middleware/authMiddleware');

// All collector routes require authentication and collector/admin role
router.use(protect);
router.use(authorizeCollector);

// Collector KPI stats
router.get('/stats', getCollectorStats);

// District Pickup requests stream
router.get('/requests', getDistrictRequests);
router.get('/requests/:id', getRequestById);

// Status progression lifecycle actions
router.patch('/requests/:id/accept', acceptRequest);
router.patch('/requests/:id/collect', collectRequest);
router.patch('/requests/:id/deliver', deliverToFacility);
router.patch('/requests/:id/complete', completeRequest);

module.exports = router;
