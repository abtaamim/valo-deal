const express = require("express");
const router = express.Router();
const {createOrder,getOrderDetails,getOrdersByBuyer,updateDeliveryStatus,updateOrderStatus, getOrdersBySeller } = require("../controllers/orderController");
// Orders
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware');
router.post("/create", requireSignIn, createOrder);
router.get("/buyer-item", requireSignIn, getOrdersByBuyer);

router.get("/seller-item", requireSignIn, getOrdersBySeller)
// Order Items
router.put("/update-delivery-status/:orderItemId", requireSignIn, updateDeliveryStatus);

// Order Tracker
router.put("/order-tracker/:trackerId", requireSignIn, updateOrderStatus);
router.get("/:orderId", requireSignIn, getOrderDetails);
module.exports = router;
