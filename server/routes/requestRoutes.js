const express = require('express');
const router = express.Router();
const {
  createPickupRequest,
  getMyRequests,
  cancelPickupRequest,
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

// All citizen request operations require user authentication
router.use(protect);

router.post('/', createPickupRequest);
router.get('/my-requests', getMyRequests);
router.patch('/:id/cancel', cancelPickupRequest);

module.exports = router;
