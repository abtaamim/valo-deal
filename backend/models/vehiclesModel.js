const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vehilesSchema = new Schema({

  sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  itemType: { type: String, default: 'vehicle' },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  subCategory: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imgUrl:
  {
    type: [String],
    required: true
  },
  sold: { type: Boolean, required: true, default: false }
}, { timestamps: true });


module.exports = mongoose.model("vehile", vehilesSchema);