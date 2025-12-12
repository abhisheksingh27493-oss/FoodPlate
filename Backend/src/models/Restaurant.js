const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One restaurant per owner for now
    },
    title: {
      type: String,
      required: [true, 'Please add a restaurant title/name'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    gstNumber: {
      type: String,
      required: [true, 'Please add GST Number'],
      unique: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    phone: {
      type: String,
      required: [true, 'Please add a contact number'],
    },
    image: {
      type: String, // Logo or storefront image
      default: '',
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
