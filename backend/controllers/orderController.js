const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const OrderTracker = require("../models/orderTracker");
const mongoose = require("mongoose");

/**
 * Create a new order with items & tracker
 */
const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { buyer_id, items, total_amount, payment_method, shipping_address } = req.body;

    // Create tracker first
    const tracker = await OrderTracker.create(
      [{ order_status: "pending" }],
      { session }
    );

    // Create order
    const order = await Order.create(
      [{
        buyer_id,
        order_tracker_id: tracker[0]._id,
        total_amount,
        payment_method,
        shipping_address
      }],
      { session }
    );

    // Link tracker to order
    await OrderTracker.updateOne(
      { _id: tracker[0]._id },
      { order_id: order[0]._id },
      { session }
    );

    // Create order items
    const orderItemsData = items.map(item => ({
      order_id: order[0]._id,
      product_id: item.product_id,
      seller_id: item.seller_id,
      quantity: item.quantity,
      price_per_unit: item.price_per_unit
    }));

    await OrderItem.insertMany(orderItemsData, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Order created successfully", orderId: order[0]._id });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all orders for a buyer
 */
const getOrdersByBuyer = async (req, res) => {
  try {
    const { buyerId } = req.params;
    const orders = await Order.find({ buyer_id: buyerId })
      .populate("order_tracker_id")
      .lean();

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get full order details (items + tracker)
 */
const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("order_tracker_id")
      .lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const items = await OrderItem.find({ order_id: orderId }).lean();

    res.status(200).json({ ...order, items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDeliveryStatus = async (req, res) => {
  try {
    const { orderItemId } = req.params;
    const { delivery_status } = req.body;

    const updatedItem = await OrderItem.findByIdAndUpdate(
      orderItemId,
      { delivery_status },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Order item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    const { trackerId } = req.params;
    const { order_status, note } = req.body;

    const updatedTracker = await OrderTracker.findByIdAndUpdate(
      trackerId,
      { order_status, note, updated_at: new Date() },
      { new: true }
    );

    if (!updatedTracker) {
      return res.status(404).json({ message: "Order tracker not found" });
    }

    res.status(200).json(updatedTracker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {createOrder, getOrderDetails, getOrdersByBuyer, updateDeliveryStatus, updateOrderStatus}