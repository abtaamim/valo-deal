// models/Product.js
const mongoose = require('mongoose');
const { PRODUCT_CONDITION, PRODUCT_STATUS } = require('./enums');

const productSchema = new mongoose.Schema({
  seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  product_name: { type: String, required: true },
  product_description: { type: String, required: true },
  brand: { type: String, required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory', required: true },
  price: { type: mongoose.Decimal128, required: true },
  stock: { type: Number, default: 0 },
  rating: { type: mongoose.Decimal128, default: 0.0 },
  condition: { type: String, enum: PRODUCT_CONDITION, default: 'new' },
  product_status: { type: String, enum: PRODUCT_STATUS, default: 'pending' },
  img_urls: [String],
  deleted_at: Date,
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
