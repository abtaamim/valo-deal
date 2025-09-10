const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const OrderTracker = require("../models/orderTracker");
const Product = require("../models/product")
const mongoose = require("mongoose");
const Cart = require("../models/cart");
const Offer = require("../models/offer")
const ProductCategory = require("../models/productCategory")
/**
 * Create a new order with items & tracker
 */
// const createOrder = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { items, total_amount, payment_method, shipping_address } = req.body;
//     const buyer_id = req.user._id
//     // Create tracker first
//     const tracker = await OrderTracker.create(
//       [{ order_status: "pending" }],
//       { session }
//     );
//     for (const item of items) {
//       const prod = await Product.findById(item.product_id).session(session);
//       if (!prod) throw new Error(`Product not found: ${item.product_id}`);

//       const remain_prod = prod.stock - item.quantity;

//       if (remain_prod < 0) {
//         throw new Error(`Insufficient stock for product ${prod._id}`);
//       } else if (remain_prod === 0) {
//         await prod.updateOne(
//           { stock: 0, product_status: "stock_out" },
//           { session }
//         );
//       } else {
//         await prod.updateOne(
//           { stock: remain_prod },
//           { session }
//         );
//       }
//     }


//     console.log("trckId: " + tracker[0]._id)
//     // Create order
//     const order = await Order.create(
//       [{
//         buyer_id,
//         order_tracker_id: tracker[0]._id,
//         total_amount,
//         payment_method,
//         shipping_address
//       }],
//       { session }
//     );

//     // Link tracker to order
//     await OrderTracker.updateOne(
//       { _id: tracker[0]._id },
//       { order_id: order[0]._id },
//       { session }
//     );

//     // Create order items
//     const orderItemsData = items.map(item => ({
//       order_id: order[0]._id,
//       product_id: item.product_id,
//       seller_id: item.seller_id,
//       quantity: item.quantity,
//       price_per_unit: item.price_per_unit
//     }));

//     await OrderItem.insertMany(orderItemsData, { session });

//     await session.commitTransaction();
//     session.endSession();

//     res.status(201).json({ message: "Order created successfully", orderId: order[0]._id });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     res.status(500).json({ message: error.message });
//   }
// };
const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, payment_method, shipping_address } = req.body;
    const buyer_id = req.user._id;

    // Create tracker first
    const tracker = await OrderTracker.create(
      [{ order_status: "pending" }],
      { session }
    );

    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const prod = await Product.findById(item.product_id).session(session);
      if (!prod) throw new Error(`Product not found: ${item.product_id}`);

      const remain_prod = prod.stock - item.quantity;
      if (remain_prod < 0) {
        const deletedItem = await Cart.findOneAndDelete({ user_id: buyer_id, product_id: prod._id });
        throw new Error(`Sorry! The product "${prod.product_name}" was bought by someone else and is no longer available in the quantity you wanted.`);
      } else if (remain_prod === 0) {
        await prod.updateOne(
          { stock: 0, product_status: "stock_out" },
          { session }
        );
      } else {
        await prod.updateOne({ stock: remain_prod }, { session });
      }
      const prod_cat = await ProductCategory.findById(prod.category_id).session(session);
      
      console.log("prod:" + prod.category_id )
      console.log("parent_cat:" + prod_cat.parent_id)
      console.log(new Date())
      let offer = await Offer.findOne({
        category_ids: { $in: [prod.category_id.toString()] }, 
        starting_at: { $lte: new Date() },
        ending_at: { $gte: new Date() },
        deleted_at: null
      }).session(session);

      
      if (!offer && prod_cat) {
        offer = await Offer.findOne({
          category_ids: { $in: [prod_cat.parent_id.toString()] }, 
          starting_at: { $lte: new Date() },
          ending_at: { $gte: new Date() },
          deleted_at: null
        }).session(session);
      }
      console.log("offer: ", offer);
      let finalPrice = prod.price;
      if (offer) {
        finalPrice = prod.price - (prod.price * offer.discount) / 100;
      }

      // build order item
      orderItemsData.push({
        order_id: null, // will assign after order is created
        product_id: prod._id,
        seller_id: prod.seller_id,
        quantity: item.quantity,
        price_per_unit: finalPrice
      });

      totalAmount += finalPrice * item.quantity;
    }

    // Create order
    const order = await Order.create(
      [{
        buyer_id,
        order_tracker_id: tracker[0]._id,
        total_amount: totalAmount,
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

    // Add orderId to items and insert
    orderItemsData.forEach(item => {
      item.order_id = order[0]._id;
    });
    await OrderItem.insertMany(orderItemsData, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Order created successfully",
      order: order[0],            
      items: orderItemsData,          
      trackerId: tracker[0]._id,
      orderId: order[0]._id
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all orders for a buyer
 */
// helper function to sync tracker with item statuses
const syncOrderStatus = async (trackerId) => {
  const order = await Order.findOne({ order_tracker_id: trackerId });
  if (!order) return null;

  const order_items = await OrderItem.find({ order_id: order._id });

  if (order_items.length === 0) return null;

  const firstStatus = order_items[0].delivery_status;

  const allSame = order_items.every(
    (item) => item.delivery_status === firstStatus
  );
  console.log(firstStatus)
  if (!allSame) {
    console.log("null")
    return null; // mixed statuses → don't update
  }

  return await OrderTracker.findByIdAndUpdate(
    trackerId,
    { order_status: firstStatus,  updated_at: new Date() },
    { new: true }
  );
};

const getOrdersByBuyer = async (req, res) => {
  try {
    const buyer_id = req.user._id
    const all_orders = await Order.find({ buyer_id: buyer_id })
    for (const order of all_orders) {
      await syncOrderStatus(order.order_tracker_id);
    }
    const orders = await Order.find({ buyer_id: buyer_id })
      .populate("order_tracker_id")
      .lean();
    for (const order of orders) {
      order.items = await OrderItem.find({ order_id: order._id })
        .populate("product_id")
        .lean();
    }
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
    // const { note } = req.body;

    const updatedTracker = await syncOrderStatus(trackerId);

    if (!updatedTracker) {
      return res.status(400).json({
        message: "Order tracker not updated (items have different statuses or not found)",
      });
    }

    res.status(200).json(updatedTracker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getOrdersBySeller = async (req, res) => {
  try {
    const seller_id = req.user._id

    const orderItems = await OrderItem.find({ seller_id: seller_id }).lean();

    if (orderItems.length === 0) {
      return res.status(200).json([]);
    }

    const orderIds = [...new Set(orderItems.map(item => item.order_id.toString()))];


    const orders = await Order.find({ _id: { $in: orderIds } })
      .populate("order_tracker_id")
      .lean();


    const ordersWithItems = orders.map(order => {
      const items = orderItems.filter(item => item.order_id.toString() === order._id.toString());
      return { ...order, items };
    });

    res.status(200).json(ordersWithItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { createOrder, getOrderDetails, getOrdersByBuyer, updateDeliveryStatus, updateOrderStatus, getOrdersBySeller }