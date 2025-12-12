const express = require('express');
const router = express.Router();
const {
  placeOrder,
  quickOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
} = require('../controller/orderController');
const { protect, } = require('../middleware/auth');

// @route   POST /api/order
// @desc    Place new order with multiple items (Direct Payment)
// @access  Private
router.post('/', protect, placeOrder);

// @route   POST /api/order/quick
// @desc    Quick order - single item direct payment
// @access  Private
router.post('/quick', protect, quickOrder);

// @route   GET /api/order/myorders
// @desc    Get logged in user's orders
// @access  Private
router.get('/myorders', protect, getMyOrders);

// @route   GET /api/order/:id
// @desc    Get single order by ID
// @access  Private
router.get('/:id', protect, getOrderById);

// @route   PUT /api/order/:id/status
// @desc    Update order status (Admin/Restaurant only)
// @access  Private/Admin
router.put('/:id/status', protect, updateOrderStatus);

// @route   PUT /api/order/:id/cancel
// @desc    Cancel order
// @access  Private
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;