const mongoose = require("mongoose");
const { DELIVERY_STATUS } = require("./enums");

const orderItemSchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quantity: { type: Number, default: 1 },
    price_per_unit: { type: Number, required: true },
    delivery_status: { type: String, enum: DELIVERY_STATUS, default: "pending" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("OrderItem", orderItemSchema);
