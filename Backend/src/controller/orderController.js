const Order = require('../models/Order');
const Food = require('../models/Food');
const User = require('../models/User');

// @desc    Place a new order
// @route   POST /api/order
// @access  Private (User)
exports.placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items',
      });
    }

    // Calculate total amount and verify items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const food = await Food.findById(item.food);
      if (!food) {
        return res.status(404).json({
          success: false,
          message: `Food item not found with id ${item.food}`,
        });
      }
      
      const price = food.price;
      const amount = price * item.quantity;
      totalAmount += amount;
      
      orderItems.push({
        food: food._id,
        quantity: item.quantity,
        price: price
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
    });
    
    // Add order to user's history
    await User.findByIdAndUpdate(req.user._id, {
        $push: { orders: order._id }
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/order
// @access  Private (User)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.food', 'name price image');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
