const mongoose = require('mongoose');

// Define schema
const orderSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true
  },
  order_date: {
    type: Date,
    required: true
  },
  order_address: {
    type: String,
    required: true
  },
  order_pId: {
    type: Number,
    required: true
  },
  order_status: {
    type: String,
    enum: ["dispatched", "cancelled", "delivered"],
    required: true
  },
  total_cost: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    min:1
  }
});

// Define model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order; // Export the model
