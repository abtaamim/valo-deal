const mongoose = require('mongoose');
const Schema = mongoose.Schema
const soldItemSchema = new Schema({
  sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
  itemType: { type: String, required: true },
  soldDate: { type: Date, default: Date.now },
  deliveryAddress: { type: String, required: true }
});
module.exports = mongoose.model("SoldItem", soldItemSchema);