const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const computersSchema = new Schema({
  sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  itemType: {type: String, default: 'computer'},
  subCategory:{type: String, required: true},
  brand: { type: String, required: true },
  model: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imgUrl: { type: String, required: true },
}, { timestamps: true });


module.exports = mongoose.model("computer", computersSchema);