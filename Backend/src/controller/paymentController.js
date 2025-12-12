const { Cashfree } = require('cashfree-pg');
const crypto = require('crypto');
const Order = require('../models/Order');
const User = require('../models/User');

// Initialize Cashfree
const initializeCashfree = () => {
    const clientId = process.env.CASHFREE_APP_ID;
    const clientSecret = process.env.CASHFREE_SECRET_ID;

    console.log('🔧 Initializing Cashfree with credentials:', {
        clientId: clientId ? `${clientId.substring(0, 10)}...` : 'MISSING',
        clientSecret: clientSecret ? 'EXISTS' : 'MISSING',
        environment: process.env.NODE_ENV
    });

    if (!clientId || !clientSecret) {
        throw new Error("Cashfree credentials not found in environment variables");
    }

    // Configure Cashfree instance
    Cashfree.XClientId = clientId;
    Cashfree.XClientSecret = clientSecret;
    Cashfree.XEnvironment = process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'SANDBOX';

    console.log('✅ Cashfree initialized successfully');
    return Cashfree;
};

// Generate unique Cashfree OrderId
const generateOrderId = () => {
    const timestamp = Date.now().toString();
    const randomBytes = crypto.randomBytes(4).toString("hex");
    const orderId = `CF${timestamp}${randomBytes}`.substring(0, 20); // Cashfree max 50 chars
    console.log('🆔 Generated Order ID:', orderId);
    return orderId;
};

// @desc    Initiate Payment
// @route   Used internally by placeOrder
// @access  Private
const initiatePayment = async (orderId, amount, customerPhone, customerId) => {
    try {
        console.log('💳 Initiating payment:', {
            orderId,
            amount,
            customerPhone,
            customerId
        });

        const cashfree = initializeCashfree();
        const cfOrderId = generateOrderId();

        // Create order request
        const orderRequest = {
            order_amount: parseFloat(amount).toFixed(2),
            order_currency: 'INR',
            order_id: cfOrderId,
            customer_details: {
                customer_id: customerId.toString(),
                customer_phone: customerPhone || '9999999999',
            },
            order_meta: {
                return_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/order/success?order_id=${orderId}`
            }
        };

        console.log('📤 Sending order request to Cashfree:', JSON.stringify(orderRequest, null, 2));

        // Create order with Cashfree
        const response = await Cashfree.PGCreateOrder("2023-08-01", orderRequest);

        console.log('✅ Cashfree response received:', {
            cf_order_id: response.data?.cf_order_id,
            order_status: response.data?.order_status,
            payment_session_id: response.data?.payment_session_id
        });

        // Update order with Cashfree order ID
        await Order.findByIdAndUpdate(orderId, {
            cfOrderId: cfOrderId,
            'paymentResult.id': response.data?.cf_order_id,
            'paymentResult.status': 'Initiated'
        });

        console.log('💾 Order updated with Cashfree details');

        return response.data;
    } catch (error) {
        console.error("❌ Cashfree Payment Initiation Error:", {
            message: error.message,
            response: error.response?.data,
            stack: error.stack
        });
        throw new Error(error.response?.data?.message || 'Payment initiation failed');
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

        const cashfree = initializeCashfree();

        // Fetch payment details from Cashfree
        console.log('📡 Fetching payment status from Cashfree...');
        const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);

        console.log('📥 Cashfree payment response:', JSON.stringify(response.data, null, 2));

        const paymentData = response.data?.[0];
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
                // await sendOrderConfirmationEmail(...);
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