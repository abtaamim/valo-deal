const express = require("express");
const router = express.Router();
const {createOrder,getOrderDetails,getOrdersByBuyer,updateDeliveryStatus,updateOrderStatus } = require("../controllers/orderController");
// Orders
router.post("/create-order", createOrder);
router.get("/buyer/:buyerId", getOrdersByBuyer);
router.get("/:orderId", getOrderDetails);

// Order Items
router.patch("/order-items/:orderItemId", updateDeliveryStatus);

// Order Tracker
router.patch("/order-tracker/:trackerId", updateOrderStatus);

module.exports = router;
