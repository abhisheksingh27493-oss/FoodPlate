const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
} = require('../controller/orderController');

const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.post('/', placeOrder);
router.get('/', getMyOrders);

module.exports = router;
