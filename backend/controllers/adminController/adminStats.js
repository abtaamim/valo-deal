const mongoose = require("mongoose");
const Order = require("../../models/order");
const Product = require("../../models/product");
const User = require("../../models/userModel");


const getAdminStats = async (req, res) => {
  try {
    const { type } = req.query;
    const now = new Date();
    let startDate;
    let groupFormat;

    switch (type) {
      case "daily":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        groupFormat = { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } }; // group by day
        break;
      case "weekly":
        const dayOfWeek = now.getDay();
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
        groupFormat = { $isoWeek: "$created_at" }; // group by week number
        break;
      case "monthly":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        groupFormat = { $dateToString: { format: "%Y-%m", date: "$created_at" } }; // group by month
        break;
      default:
        return res.status(400).json({ message: "Invalid type. Must be daily, weekly, or monthly." });
    }

    // Orders stats
    const orders = await Order.aggregate([
      { $match: { created_at: { $gte: startDate } } },
      {
        $group: {
          _id: groupFormat,
          totalOrders: { $sum: 1 },
          totalAmount: { $sum: "$total_amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Products stats
    const products = await Product.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: groupFormat, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Users stats
    const users = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: groupFormat, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // summary
    const orderSummary = await Order.aggregate([
      { $match: { created_at: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalAmount: { $sum: "$total_amount" },
        },
      },
    ]);

    res.json({
      summary: {
        orders: orderSummary[0] || { totalOrders: 0, totalAmount: 0 },
        newProducts: products.reduce((sum, p) => sum + p.count, 0),
        newUsers: users.reduce((sum, u) => sum + u.count, 0),
      },
      trends: {
        orders,
        products,
        users,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getAdminStats };
