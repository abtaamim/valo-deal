const Product = require("../models/product")

// Create product (seller or admin)
const createProduct = async (req, res) => {
  try {
    const {
      product_name,
      product_description,
      brand,
      category_id,
      price,
      stock,
      condition,
      img_urls
    } = req.body;

    const newProduct = new Product({
      seller_id: req.user._id,
      product_name,
      product_description,
      brand,
      category_id,
      price,
      stock,
      condition,
      img_urls
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all active products
const getActiveProducts = async (req, res) => {
  try {
    const products = await Product.find({
      deleted_at: null,
      product_status: 'approved'
    }).populate('category_id').populate('seller_id', 'name email');

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      deleted_at: null
    }).populate('category_id').populate('seller_id', 'name email');

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update product (by seller or admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, deleted_at: null },
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Soft delete product
const softDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { deleted_at: new Date() },
      { new: true }
    );

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({ message: 'Product deleted (soft)' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all products by a seller (their own)
const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({
      seller_id: req.user._id,
      deleted_at: null
    }).sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: change product status


module.exports = {
  createProduct,
  getActiveProducts,
  getProductById,
  updateProduct,
  softDeleteProduct,
  getSellerProducts
};
