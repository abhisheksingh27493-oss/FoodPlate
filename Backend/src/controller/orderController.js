const Order = require('../models/Order');
const Food = require('../models/Food');
const User = require('../models/User');
const { initiatePayment } = require('./paymentController');

// @desc    Place new order with direct payment (NO CART)
// @route   POST /api/order
// @access  Private
exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const { items, totalAmount, orderType } = req.body;

    console.log("🛒 === DIRECT PAYMENT ORDER ===");
    console.log("👤 User ID:", userId);
    console.log("📦 Request Body:", req.body);

    // Validate items
    const validatedItems = [];
    let calculatedTotal = 0;

    for (const item of items) {
      const foodItem = await Food.findById(item.food);

      if (!foodItem) {
        return res.status(404).json({ message: "Food item not found" });
      }

      const subtotal = foodItem.price * item.quantity;
      calculatedTotal += subtotal;

      validatedItems.push({
        food: item.food,
        name: foodItem.name,
        quantity: item.quantity,
        price: foodItem.price,
        subtotal,
      });
    }

    // Check totals
    if (calculatedTotal !== totalAmount) {
      return res.status(400).json({ message: "Amount mismatch" });
    }

    console.log("💾 Creating order in database...");

    // Create order
    const order = await Order.create({
      user: userId,
      items: validatedItems,
      totalAmount,
      status: "Pending",
      orderType,
    });

    console.log("✅ Order created:", order);

    // Add order to user history
    await User.findByIdAndUpdate(userId, {
      $push: { orderHistory: order._id }
    });

    console.log("💳 Initiating direct payment...");

    const paymentResponse = await initiatePayment(
      order._id,
      totalAmount,
      userId,
      req.body.customerPhone || "9999999999"
    );

    if (!paymentResponse.success) {
      return res.status(500).json({
        message: "Payment initiation failed",
      });
    }

    return res.status(200).json({
      message: "Order placed, proceed to payment",
      orderId: order._id,
      cfOrderId: paymentResponse.cfOrderId,
      paymentSessionId: paymentResponse.paymentSessionId,
      cashfree: paymentResponse.response,
    });

  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Quick order - Single item direct payment
// @route   POST /api/order/quick
// @access  Private
exports.quickOrder = async (req, res) => {
  try {
    console.log('⚡ === QUICK ORDER (Single Item) ===');
    
    const { foodId, quantity = 1, orderType = 'Delivery', shippingAddress } = req.body;

    if (!foodId) {
      return res.status(400).json({
        success: false,
        message: 'Food item ID is required'
      });
    }

    console.log('🍕 Food ID:', foodId, '| Quantity:', quantity);

    // Get food item
    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    if (!food.isAvailable) {
      return res.status(400).json({
        success: false,
        message: `${food.name} is currently unavailable`
      });
    }

    // Calculate total
    const totalAmount = food.price * quantity;

    console.log('💰 Total Amount:', totalAmount);

    // Validate address for delivery
    if (orderType === 'Delivery' && !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required for delivery'
      });
    }

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: [{
        food: food._id,
        quantity,
        price: food.price
      }],
      totalAmount,
      shippingAddress: orderType === 'Delivery' ? shippingAddress : undefined,
      orderType,
      status: 'Pending',
      paymentResult: {
        status: 'Pending'
      }
    });

    console.log('✅ Quick order created:', order._id);

    // Add to user history
    await User.findByIdAndUpdate(req.user.id, {
      $push: { orders: order._id }
    });

    // Get user for payment
    const user = await User.findById(req.user.id);

    // Initiate payment
    const paymentData = await initiatePayment(
      order._id,
      totalAmount,
      user.phone,
      user._id
    );

    res.status(201).json({
      success: true,
      message: 'Quick order created, proceed with payment',
      data: order,
      payment: {
        sessionId: paymentData.payment_session_id,
        cfOrderId: paymentData.cf_order_id
      },
      orderId: order._id
    });

  } catch (error) {
    console.error('❌ Quick order error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/order/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    console.log('📋 Fetching orders for user:', req.user.id);

    const orders = await Order.find({ user: req.user.id })
      .populate('items.food', 'name price image category')
      .sort({ createdAt: -1 }); // Most recent first

    console.log('✅ Found', orders.length, 'orders');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single order
// @route   GET /api/order/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    console.log('🔍 Fetching order:', req.params.id);

    const order = await Order.findById(req.params.id)
      .populate('items.food', 'name price image description category')
      .populate('user', 'name email phone');

    if (!order) {
      console.log('❌ Order not found');
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      console.log('❌ Unauthorized access attempt');
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    console.log('✅ Order found:', order._id);

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('❌ Error fetching order:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update order status (Admin/Restaurant only)
// @route   PUT /api/order/:id/status
// @access  Private (Admin/Restaurant)
exports.updateOrderStatus = async (req, res) => {
  try {
    console.log('🔄 Updating order status:', req.params.id);
    console.log('📝 New status:', req.body.status);

    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      console.log('❌ Order not found');
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    console.log('📊 Current status:', order.status, '→ New status:', status);

    order.status = status;
    await order.save();

    console.log('✅ Order status updated successfully');

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('❌ Error updating order status:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/order/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    console.log('🚫 Cancelling order:', req.params.id);

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check ownership
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Only allow cancellation if order is Pending or Processing
    if (!['Pending', 'Processing'].includes(order.status)) {
      console.log('❌ Cannot cancel order with status:', order.status);
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.status}`
      });
    }

    order.status = 'Cancelled';
    await order.save();

    console.log('✅ Order cancelled successfully');

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });

  } catch (error) {
    console.error('❌ Error cancelling order:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};