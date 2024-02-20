const mongoose = require('mongoose');

// Define schema
const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
    min:0
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min:1
  },
  thumbnail: {
    type: String,
    required: true
  }
});

// Define model
const Product = mongoose.model('Product', productSchema);

module.exports = Product; // Export the model
