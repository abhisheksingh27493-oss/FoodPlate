const axios = require('axios');
const crypto = require('crypto');
const Order = require('../models/Order');
const User = require('../models/User');
require("dotenv").config();

// Cashfree API configuration
const CASHFREE_API_URL = process.env.NODE_ENV === 'production'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';

const CASHFREE_API_VERSION = '2023-08-01';

// Get Cashfree headers
const getCashfreeHeaders = () => {
    return {
        'Content-Type': 'application/json',
        'x-api-version': CASHFREE_API_VERSION,
        'x-client-id': process.env.CASHFREE_APP_ID,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY
    };
};

// Initialize Cashfree (validation)
const initializeCashfree = () => {
    const clientId = process.env.CASHFREE_APP_ID;
    const clientSecret = process.env.CASHFREE_SECRET_KEY;

    console.log('🔧 Initializing Cashfree with credentials:', {
        clientId: clientId ? `${clientId.substring(0, 10)}...` : 'MISSING',
        clientSecret: clientSecret ? 'EXISTS' : 'MISSING',
        environment: process.env.NODE_ENV || 'development',
        apiUrl: CASHFREE_API_URL
    });

    if (!clientId || !clientSecret) {
        throw new Error("Cashfree credentials not found in environment variables");
    }

    console.log('✅ Cashfree configured successfully');
};

// Generate unique Cashfree OrderId
const generateOrderId = () => {
    const timestamp = Date.now().toString();
    const randomBytes = crypto.randomBytes(4).toString("hex");
    const orderId = `CF${timestamp}${randomBytes}`.substring(0, 20);
    console.log('🆔 Generated Order ID:', orderId);
    return orderId;
};

// @desc    Initiate Payment
// @route   Used internally by placeOrder
// @access  Private
const initiatePayment = async (orderId, amount, userId, customerPhone) => {
  try {
    console.log("💳 Initiating payment...");
    console.log("📋 Payment params:", { orderId, amount, userId, customerPhone });

    // Validate Cashfree config
    initializeCashfree();

    const cfOrderId = generateOrderId();

    // Create order request payload
    const payload = {
      order_id: cfOrderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: userId.toString(),
        customer_phone: customerPhone || "9999999999",
      },
      order_meta: {
        return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/order/success?order_id=${orderId}`,
      }
    };

    console.log("📤 Sending order request to Cashfree:", payload);

    // Make API call to Cashfree
    const response = await axios.post(
      `${CASHFREE_API_URL}/orders`,
      payload,
      { headers: getCashfreeHeaders() }
    );

    console.log("✅ Cashfree Order Response:", response.data);

    // Update the order with cfOrderId
    await Order.findByIdAndUpdate(orderId, { 
      cfOrderId: cfOrderId 
    });

    return {
      success: true,
      cfOrderId,
      paymentSessionId: response.data.payment_session_id,
      response: response.data
    };

  } catch (error) {
    console.error("❌ Cashfree Payment Error:", error.message);
    console.error("Error details:", error.response?.data || error.message);
    return { 
      success: false, 
      message: error.message,
      details: error.response?.data 
    };
  }
};

// @desc    Verify Payment
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res) => {
    try {
        const { orderId } = req.body; // This is the cfOrderId from Cashfree

        console.log('🔍 Verifying payment for Cashfree Order ID:', orderId);

        if (!orderId) {
            console.log('❌ No order ID provided');
            return res.status(400).json({ 
                success: false,
                error: "Order ID is required" 
            });
        }

        // Validate Cashfree
        initializeCashfree();

        // Fetch payment details from Cashfree
        console.log('📡 Fetching payment status from Cashfree...');
        
        const response = await axios.get(
            `${CASHFREE_API_URL}/orders/${orderId}/payments`,
            { headers: getCashfreeHeaders() }
        );

        console.log('📥 Cashfree payment response:', JSON.stringify(response.data, null, 2));

        const paymentData = response.data?.[0]; // Get first payment
        const paymentStatus = paymentData?.payment_status;

        console.log('💰 Payment Status:', paymentStatus);

        // Find order by cfOrderId
        const order = await Order.findOne({ cfOrderId: orderId }).populate('items.food');

        if (!order) {
            console.log('❌ Order not found for cfOrderId:', orderId);
            return res.status(404).json({ 
                success: false,
                error: "Order not found" 
            });
        }

        console.log('📦 Found Order:', {
            _id: order._id,
            totalAmount: order.totalAmount,
            currentStatus: order.status
        });

        if (paymentStatus === "SUCCESS") {
            console.log('✅ Payment SUCCESS - Updating order...');

            // Update order status
            order.status = "Processing";
            order.paymentResult = {
                id: paymentData?.cf_payment_id,
                status: "Paid",
                update_time: new Date().toISOString(),
                transaction_id: paymentData?.payment_group
            };

            await order.save();

            console.log('💾 Order updated to Processing');

            // Get user details
            const user = await User.findById(order.user);

            if (user) {
                console.log('📧 User found:', user.email);
                // TODO: Send confirmation email
                console.log('📨 Email notification would be sent here');
            }

            return res.json({ 
                success: true,
                status: "success", 
                data: order,
                message: "Payment verified and order confirmed"
            });

        } else if (paymentStatus === "FAILED") {
            console.log('❌ Payment FAILED - Updating order...');

            order.status = "Cancelled";
            order.paymentResult = {
                ...order.paymentResult,
                status: "Failed"
            };

            await order.save();

            return res.json({ 
                success: false,
                status: "failed", 
                message: "Payment failed"
            });
        }

        // Payment still pending
        console.log('⏳ Payment still PENDING');
        res.json({ 
            success: true,
            status: "pending", 
            data: paymentData,
            message: "Payment still pending"
        });

    } catch (error) {
        console.error("❌ Payment verification error:", {
            message: error.message,
            response: error.response?.data,
            stack: error.stack
        });

        res.status(500).json({ 
            success: false,
            error: "Verification failed",
            message: error.message 
        });
    }
};

// @desc    Get Payment Status
// @route   GET /api/payment/status/:orderId
// @access  Private
const getPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params; // MongoDB Order ID

        console.log('📊 Getting payment status for Order ID:', orderId);

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        console.log('📦 Order Payment Status:', {
            cfOrderId: order.cfOrderId,
            status: order.status,
            paymentStatus: order.paymentResult?.status
        });

        res.json({
            success: true,
            data: {
                orderId: order._id,
                cfOrderId: order.cfOrderId,
                status: order.status,
                paymentResult: order.paymentResult,
                totalAmount: order.totalAmount
            }
        });

    } catch (error) {
        console.error('❌ Error fetching payment status:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { 
    verifyPayment, 
    initiatePayment,
    getPaymentStatus,
    initializeCashfree, 
    generateOrderId 
};