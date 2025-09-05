import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Grid, Button, Snackbar, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RemoveShoppingCartOutlinedIcon from "@mui/icons-material/RemoveShoppingCartOutlined";
import { useAuth } from "../context/auth";
import { useCart } from "../context/CartContext";
import CustomDialog from "./CustomDialog";
import ListingCard from "./CustomItemCard";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

import { Toaster, toast } from 'sonner';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [auth] = useAuth();
  const { updateCartSize } = useCart();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [selectedItemId, setSelectedItemId] = useState();
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [itemGotSold, setItemGotSold] = useState(false);

  const [loading, setLoading] = useState(true);

  const handleClickOpen = (itemId) => {
    setOpen(true);
    setSelectedItemId(itemId);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItemId(null);
  };

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
  }).format(price).replace('BDT', '৳');
};

  const fetchItems = async () => {
    try {
      setLoading(true);
      const token = auth?.token;
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axiosPrivate.get("/cart/fetchitems");
      setCartItems(response.data.cartItems);
      // setItemGotSold(response.data.itemGotSoldFlag);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [auth]);

  // useEffect(() => {
  //   if (itemGotSold) {
  //     toast.error("Some items from your cart were bought by other users T_T");
  //   }
  // }, [itemGotSold]);

  const handleDelete = async (itemId) => {
    try {
      await axiosPrivate.delete(`/cart/${itemId}`);
      fetchItems();
      await updateCartSize();
      handleClose();
      setSnackbarOpen(true);
    } catch (error) {
      console.error(`Error deleting item:`, error);
    }
  };

  // const handleBuyNow = () => {
  //   navigate("/payment");
  // };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const totalSum = cartItems.reduce((acc, item) => acc + item.price, 0);
  const handleBuyNow = async () => {
    try {
      if (cartItems.length === 0) {
        toast.error("Your cart is empty!");
        return;
      }

      // Format order payload
      const orderPayload = {
        items: cartItems.map((item) => ({
          product_id: item._id,        // _id = productId
          seller_id: item.seller_id,
          quantity: item.quantity || 1,
          price_per_unit: item.price,
        })),
        total_amount: totalSum,
        payment_method: "cod", // later you can allow user to select
        shipping_address: auth?.user?.address || "Dhaka, Bangladesh",
      };

      const response = await axiosPrivate.post("/order/create", orderPayload);

      toast.success(" Order placed successfully!");
      await axiosPrivate.delete("/cart/clear")
      // clear cart in frontend + backend
      setCartItems([]);
      await updateCartSize();

      // redirect to order details page
      // navigate(`/orders/${response.data.orderId}`);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error(" Failed to place order. Try again.");
    }
  };


  return (
    <>
      <Box
        sx={{
          p: 2,
          pl: 0,
          pr: 2,
          textAlign: "center",
        }}
      >

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
            }}

          >
            <CircularProgress sx={{ color: "orange" }} />
          </Box>
        ) : (
          <Box sx={{
            minHeight: '80vh', display: 'flex',
            flexDirection: 'column', p: 2, justifyContent: 'center'
          }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                color: "orange",
                fontWeight: "bold",
                padding: "8px",
                textAlign: "center",
                fontSize: { xs: "1.5rem", sm: "2rem" },
              }}
            >
              My Cart 🛒
            </Typography>

            <ListingCard
              items={cartItems}
              handleClickOpen={handleClickOpen}
              button={
                <RemoveShoppingCartOutlinedIcon sx={{ color: "rgb(0, 6, 12)" }} />
              }
            />

            <Box
              sx={{
                // mt: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexGrow: '1'
              }}
            >
              <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="center"
                sx={{ mt: 'auto', p: '2' }}
              >
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ p: 2, border: "1px solid #ccc", borderRadius: "8px" }}>
                    <Typography
                      variant="h6"
                      align="center"
                      sx={{
                        color: "white",
                        fontSize: { xs: "1rem", sm: "1.2rem" },
                      }}
                    >
                      Total: {formatPrice(totalSum)}
                    </Typography>
                    
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "green",
                      color: "white",
                      width: "100%",
                      height: "60px",
                      fontSize: { xs: "1rem", sm: "1.3rem" },
                      "&:hover": {
                        backgroundColor: "darkgreen",
                      },
                    }}
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </Box>

      <CustomDialog
        handleClose={handleClose}
        selectedItemId={selectedItemId}
        handleDelete={handleDelete}
        dialog_title="This item will be removed from your cart"
        open={open}
      />

      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message="Item removed from cart"
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        ContentProps={{
          sx: {
            backgroundColor: "rgb(24, 102, 219)",
            color: "white",
            fontWeight: "bold",
          },
        }}
      />
      < Toaster richColors />
    </>
  );
};

export default CartPage;
