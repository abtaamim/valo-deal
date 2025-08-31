const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory', default: null },
  deleted_at: Date,
}, { timestamps: true });

module.exports = mongoose.model('ProductCategory', productCategorySchema);
