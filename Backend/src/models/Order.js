const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        food: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Food',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    orderType: {
      type: String,
      enum: ['Delivery', 'Dine-in'],
      default: 'Delivery',
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    cfOrderId: {
      type: String,
      sparse: true, // Cashfree Order ID
    },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      transaction_id: String,
      email_address: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups
orderSchema.index({ cfOrderId: 1 });
orderSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);