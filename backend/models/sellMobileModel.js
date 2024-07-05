const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sellMobileSchema = new Schema({
  sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  condition: { type: String, required: true },
  authenticity: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String, required: true }],
}, { timestamps: true });

const SellMobile = mongoose.model('SellMobile', sellMobileSchema);

module.exports = mongoose.model("SellMobile", sellMobileSchema); ;
