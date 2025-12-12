const Restaurant = require('../models/Restaurant');
const User = require('../models/User');

// @desc    Apply for restaurant partnership
// @route   POST /api/restaurant/apply
// @access  Private
exports.applyRestaurant = async (req, res) => {
  try {
    const { title, description, gstNumber, address, phone, image } = req.body;

    // Check if user already has a restaurant application
    const existingRestaurant = await Restaurant.findOne({ owner: req.user.id });

    if (existingRestaurant) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied or have a restaurant registered',
      });
    }

    const restaurant = await Restaurant.create({
      owner: req.user.id,
      title,
      description,
      gstNumber,
      address,
      phone,
      image,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: restaurant,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get current user's restaurant application status
// @route   GET /api/restaurant/status
// @access  Private
exports.getRestaurantStatus = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'No restaurant application found',
      });
    }

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all restaurant applications (Admin only)
// @route   GET /api/restaurant/applications
// @access  Private/Admin
exports.getAllApplications = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate('owner', 'name email');

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update restaurant status (Admin only)
// @route   PUT /api/restaurant/status/:id
// @access  Private/Admin
exports.updateRestaurantStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid status"
        });
    }

    const restaurant = await Restaurant.findByIdAndUpdate(id, { status }, {
        new: true,
        runValidators: true
    });

    if (!restaurant) {
        return res.status(404).json({
            success: false,
            message: "Restaurant not found"
        });
    }

    // If approved, update user role to 'restaurant'
    if (status === 'Approved') {
        await User.findByIdAndUpdate(restaurant.owner, { role: 'restaurant' });
    }

    res.status(200).json({
        success: true,
        data: restaurant
    });

  } catch (error) {
    res.status(400).json({
        success: false,
        message: error.message
    });
  }
};
