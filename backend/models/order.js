const mongoose = require("mongoose");
const { PAYMENT_METHOD } = require("./enums");

const orderSchema = new mongoose.Schema(
  {
    buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order_tracker_id: { type: mongoose.Schema.Types.ObjectId, ref: "OrderTracker", unique: true, required: true },
    total_amount: { type: Number, required: true },
    payment_method: { type: String, enum: PAYMENT_METHOD, required: true },
    shipping_address: { type: String },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Order", orderSchema);
