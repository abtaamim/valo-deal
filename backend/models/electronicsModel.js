const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const electronisSchema = new Schema({
  sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  itemType: {type: String, default: 'electronic'},
  subCategory:{type: String, required: true},
  brand: { type: String, required: true },
  model: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imgUrl: 
    {
      type: [String],
      required: true
    },
}, { timestamps: true });


module.exports = mongoose.model("electronic", electronisSchema);