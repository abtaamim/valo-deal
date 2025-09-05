import React, { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
const BuyerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate()
  const statuses = ["pending", "shipped", "delivered", "cancelled"];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosPrivate.get('/order/buyer-item');
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  },[]);

  if (loading) {
    return <Typography variant="h6">Loading your orders...</Typography>;
  }

  if (orders.length === 0) {
    return <Typography variant="h6">No orders found.</Typography>;
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} key={order._id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">
                  Order ID: {order._id}
                </Typography>
                <Typography variant="body1">
                  Order Status: {order.order_tracker_id?.order_status}
                </Typography>
                <Typography variant="body1">
                  Total: ${order.total_amount}
                </Typography>
                <Typography variant="body2">
                  Payment: {order.payment_method=="cod"?"Cash on Delivery":""}
                </Typography>
                <Typography variant="body2">
                  Shipping: {order.shipping_address}
                </Typography>

                <Box mt={2}>
                  <Typography variant="subtitle1">Items:</Typography>
                  <Grid container spacing={2}>
                    {order?.items?.map((item) => (
                      <Grid item xs={12} sm={6} md={4} key={item._id}>
                        <Card variant="outlined" sx={{ p: 2 }}>
                          <Typography >
                            Product ID: {item.product_id._id}
                          </Typography>
                          <Typography>Qty: {item.quantity}</Typography>
                          <Typography>Price: ${item.price_per_unit}</Typography>
                          <Typography>Delivery Status: {item.delivery_status}</Typography>
                          {/* <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                            <InputLabel>Delivery Status</InputLabel>
                            <Select
                              value={item.delivery_status || "pending"}
                              label="Delivery Status"
                              disabled
                            >
                              {statuses.map((status) => (
                                <MenuItem key={status} value={status}>
                                  {status}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl> */}
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BuyerOrdersPage;
