import React, { useEffect, useState } from "react";
import { format } from "date-fns";

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
const statuses = ["pending", "shipped", "delivered"];
const OrderStatusStepper = ({ currentStatus }) => {
  const currentIndex = statuses.indexOf(currentStatus);

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" mt={3}>
      {statuses.map((status, index) => (
        <Box
          key={status}
          display="flex"
          flexDirection="column"
          alignItems="center"
          flex={1}
          position="relative"
        >
          {/* Circle */}
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              bgcolor: index <= currentIndex ? "primary.main" : "grey.400",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            {index + 1}
          </Box>

          {/* Label */}
          <Typography
            variant="caption"
            mt={1}
            sx={{ color: index <= currentIndex ? "primary.main" : "grey.600" }}
          >
            {status}
          </Typography>

          {/* Connector line */}
          {index < statuses.length - 1 && (
            <Box
              sx={{
                position: "absolute",
                top: "16px",
                left: "50%",
                width: "100%",
                height: "2px",
                bgcolor: index < currentIndex ? "primary.main" : "grey.400",
                zIndex: 0,
              }}
            />
          )}
        </Box>
      ))}
    </Box>
  );
};
const BuyerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate()
  

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
      <Typography variant="h4" gutterBottom sx={{ color: "whitesmoke"  }}>
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
                <Typography variant="h6">
                  Order Date: {format(new Date(order.created_at), "PPP p")}
                </Typography>
                {/* <Typography variant="body1">
                  Order Status: {order.order_tracker_id?.order_status}
                </Typography> */}
                <OrderStatusStepper currentStatus={order.order_tracker_id?.order_status} />
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
                            Product name: {item.product_id.product_name}
                          </Typography>
                          <Typography>Qty: {item.quantity}</Typography>
                          <Typography>Price: ${item.price_per_unit}</Typography>
                          <Typography>Delivery Status: {item.delivery_status}</Typography>
                          
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
