const { ORDER_STATUS } = require("./enums");
const mongoose = require("mongoose");
const orderTrackerSchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    order_status: { type: String, enum: ORDER_STATUS, default: "pending" },
    note: { type: String },
  },
  { timestamps: { createdAt: false, updatedAt: "updated_at" } }
);

module.exports = mongoose.model("OrderTracker", orderTrackerSchema);
