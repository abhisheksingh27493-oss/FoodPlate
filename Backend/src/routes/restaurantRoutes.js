const express = require('express');
const router = express.Router();
const {
  applyRestaurant,
  getRestaurantStatus,
  getAllApplications,
  updateRestaurantStatus
} = require('../controller/restaurantController');

const { protect, authorize } = require('../middleware/auth');

// Apply for partnership
router.post('/apply', protect, applyRestaurant);

// Check status
router.get('/status', protect, getRestaurantStatus);

// Admin routes
router.get('/applications', protect, authorize('admin'), getAllApplications);
router.put('/status/:id', protect, authorize('admin'), updateRestaurantStatus);

module.exports = router;
