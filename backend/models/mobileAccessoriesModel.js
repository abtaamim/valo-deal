const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mobileAccessoriesSchema = new Schema({
  
  sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  itemType: {type: String, default: 'mobileaccessories'},
  brand: { type: String, required: true },
  model: { type: String, required: true },
  accessoryType: { type: String, required: true},
  condition: { type: String, required: true },
  authenticity: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imgUrl: { type: String, required: true },
}, { timestamps: true });


module.exports = mongoose.model("mobileAccessories", mobileAccessoriesSchema); 
