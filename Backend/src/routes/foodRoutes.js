const express = require('express');
const router = express.Router();
const {
  createFood,
  getAllFoods,
  getFoodById,
  updateFood,
  deleteFood,
} = require('../controller/foodController');

const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllFoods);
router.get('/:id', getFoodById);

// Protected routes (Admin/Restaurant only)
router.post('/', protect, authorize('admin', 'restaurant'), createFood);
router.put('/:id', protect, authorize('admin', 'restaurant'), updateFood);
router.delete('/:id', protect, authorize('admin', 'restaurant'), deleteFood);

module.exports = router;
