const Product = require('../models/productModel');
const mongoose = require('mongoose');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ msg: err.message });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;

  // ✅ Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl, stock, category } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      imageUrl,
      stock,
      category,
    });
    await newProduct.save();
    res.status(201).json({ msg: 'Product created', product: newProduct });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const updateProduct = async (req, res) => {
  const id = req?.params?.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: 'Invalid product ID' });
  }
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedProduct)
      return res.status(404).json({ msg: 'Product not found' });

    res.json({ msg: 'Product updated', product: updatedProduct });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const deleteProduct = async (req, res) => {
  const id = req?.params?.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: 'Invalid product ID' });
  }

  try {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ msg: 'Product not found' });

    res.json({ msg: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
