const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  deliveryAddress: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Cancelled', 'In Progress', 'Delivered'], // Define allowed statuses
    default: 'In Progress',
  },
  cart: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', // Reference to the Product schema
        required: true, 
      },
      count: { 
        type: Number, 
        required: true, 
        default: 1, // Default count is 1
      },
    },
  ],
  paymentMethod: {
    type: String,
    enum: ['COD', 'Wallet', 'Credit Card'], // Define allowed payment methods
    required: true, // Make this field mandatory
  },
  totalAmount: {
    type: Number,
    required: true, // Total amount is required
    default: 0, // Default value is 0
  },
  tourist: { // Add tourist reference
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tourist', // Reference to the Tourist model
    required: true, // Make this field mandatory
  },
},
 {
  timestamps: true, // Adds createdAt and updatedAt fields
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
