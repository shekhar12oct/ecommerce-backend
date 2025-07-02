const mongoose = require('mongoose');

const productScehma = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imageUrl: String,
  stock: Number,
  category: String,
});

module.exports = mongoose.model('Product', productScehma);
