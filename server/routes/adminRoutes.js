const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/adminController');
const { protect, authorizeAdmin } = require('../middleware/authMiddleware');

// 🔒 All Admin routes require JWT authentication and 'admin' role
router.use(protect);
router.use(authorizeAdmin);

// Analytics
router.get('/stats', getAdminStats);

// User Management
router.get('/users', getAllUsers);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Collector Management
router.get('/collectors', getAllCollectors);
router.patch('/collectors/:id/jurisdiction', assignCollectorJurisdiction);

// Request Management
router.get('/requests', getAllRequests);
router.patch('/requests/:id/assign', assignRequestCollector);
router.delete('/requests/:id', deleteRequest);

// Facilities Management
router.get('/facilities', getAdminFacilities);
router.post('/facilities', createFacility);
router.put('/facilities/:id', updateFacility);
router.delete('/facilities/:id', deleteFacility);

module.exports = router;
