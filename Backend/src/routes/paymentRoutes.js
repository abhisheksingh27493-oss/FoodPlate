const express = require('express');
const router = express.Router();
const { verifyPayment } = require('../controller/paymentController');
const { protect } = require('../middleware/auth');

router.post('/verify', protect, verifyPayment);

module.exports = router;
