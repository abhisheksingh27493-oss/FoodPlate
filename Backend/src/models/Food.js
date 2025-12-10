const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description can not be more than 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    image: {
      type: String,
      default: 'no-photo.jpg',
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: [
        'Pizza',
        'Burger',
        'Sushi',
        'Salad',
        'Dessert',
        'Drinks',
        'Indian',
        'Chinese',
        'Italian',
        'Other'
      ],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating must can not be more than 10'],
    },
    restaurant: { // Optional: for future multi-tenant support
      type: String, 
      required: false
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Food', foodSchema);
