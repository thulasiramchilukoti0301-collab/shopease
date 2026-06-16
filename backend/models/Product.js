const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: 0 },
  category: {
    type: String,
    enum: ['Electronics', 'Fashion', 'Books', 'Home & Kitchen', 'Beauty', 'Gaming'],
    required: true
  },
  image: { type: String, required: true },
  images: [{ type: String }],
  stock: { type: Number, default: 0 },
  brand: { type: String, default: '' },
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);