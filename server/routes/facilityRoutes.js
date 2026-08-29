const express = require('express');
const router = express.Router();
const {
  getFacilities,
  getFacilityById,
  createFacility,
} = require('../controllers/facilityController');

router.get('/', getFacilities);
router.get('/:id', getFacilityById);
router.post('/', createFacility);

module.exports = router;
