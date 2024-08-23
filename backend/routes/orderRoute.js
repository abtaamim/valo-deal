// routes/orderRoute.js

const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');
const User = require('../models/userModel');

router.post('/create', async (req, res) => {
  try {
    const userId = req.user._id;
    const { cartItems, totalAmount, deliveryAddress } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Create new order
    const order = new Order({
      user: userId,
      items: cartItems,
      totalAmount,
      deliveryAddress,
    });

    await order.save();

    // Clear the user's cart after confirming the order
    user.cartItems = [];
    await user.save();

    res.status(201).json({ success: true, message: 'Order confirmed and cart cleared', order });
  } catch (error) {
    console.error('Error confirming order:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error });
  }
});

module.exports = router;
