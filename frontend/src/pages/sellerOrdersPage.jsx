import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  CircularProgress,
  Box
} from "@mui/material";
import { motion } from "framer-motion";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const SellerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  const statuses = ["pending", "shipped", "out_for_delivery", "delivered"];

  // Fetch orders for seller
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosPrivate.get("/order/seller-item");
        setOrders(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderItemId, newStatus) => {
    try {
      const res = await axiosPrivate.put(`/order/update-delivery-status/${orderItemId}`, {
        delivery_status: newStatus,
      });

      // Update local state
      setOrders((prev) =>
        prev.map((order) => ({
          ...order,
          items: order.items.map((item) =>
            item._id === orderItemId ? { ...item, delivery_status: newStatus } : item
          ),
        }))
      );

      console.log("Updated:", res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (orders.length === 0) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 4 }}>
        No orders found for this seller.
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 4, display: "grid", gap: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Seller Orders
      </Typography>

      {orders.map((order) => (
        <motion.div
          key={order._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order #{order._id}
              </Typography>
              <Typography>
                <strong>Status:</strong> {order.order_tracker_id?.order_status}
              </Typography>
              <Typography>
                <strong>Total:</strong> ${order.total_amount}
              </Typography>
              <Typography>
                <strong>Payment:</strong> {order.payment_method}
              </Typography>
              <Typography>
                <strong>Shipping:</strong> {order.shipping_address}
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Items
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {order.items.map((item) => (
                    <Box
                      key={item._id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 2,
                        border: "1px solid #ccc",
                        borderRadius: 2,
                      }}
                    >
                      <Box>
                        <Typography fontWeight="medium">{item.product_id}</Typography>
                        <Typography>Qty: {item.quantity}</Typography>
                        <Typography>Price: ${item.price_per_unit}</Typography>
                      </Box>
                      <FormControl size="small">
                        <InputLabel>Delivery</InputLabel>
                        <Select
                          value={item.delivery_status || "pending"}
                          label="Delivery"
                          onChange={(e) =>
                            handleStatusChange(item._id, e.target.value)
                          }
                        >
                          {statuses.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </Box>
  );
};

export default SellerOrdersPage;
