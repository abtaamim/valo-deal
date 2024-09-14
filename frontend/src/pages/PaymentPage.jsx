import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Grid, Button, Paper, CircularProgress, Snackbar, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { useAuth } from '../context/auth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
const PaymentPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false); // State for error snackbar
  const navigate = useNavigate();
  const { updateCartSize } = useCart();
  const [auth] = useAuth();
  const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axiosPrivate.get('/cart/fetchitems');
        setCartItems(response.data.cartItems);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, []);

  const totalSum = cartItems.reduce((acc, item) => acc + item.price, 0);

  const handleConfirmOrder = async () => {
    if (!address) {
      setErrorSnackbarOpen(true); // Open error snackbar if address is missing
      return;
    }
    setLoading(true);
    try {

      for (const cartItem of cartItems) {
        await axiosPrivate.post('/order/setOrder', {
          buyerId: auth.user._id,
          sellerId: cartItem.sellerId,
          itemType: cartItem.itemType,
          itemId: cartItem._id,
          soldDate: new Date(),
          deliveryAddress: address

        })
        await axiosPrivate.post('/send/mail', {
          to: auth.user.email,
          subject: "your order has been placed successfully",
          mailBody: `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #4CAF50;">Your Order Confirmation</h2>
      <p style="font-size: 16px;">Your order has been placed successfully.</p>
      <p style="font-size: 16px;"><strong>Item:</strong> ${cartItem.brand ? cartItem.brand : ''} ${cartItem.model ? cartItem.model : ''}</p>
      <p style="font-size: 16px;"><strong>Price:</strong> <span style="color: #4CAF50;">${cartItem.price}</span></p>
    </div>
  `})
        const res = await axiosPrivate.get(`/api/v1/auth/seller-info/${cartItem.sellerId}`)
        const sellerMail = res?.data.seller.email;
        await axiosPrivate.post('/send/mail', {
          to: sellerMail,
          subject: "one of your product has been sold",
          mailBody: `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #4CAF50;">Product Sold Notification</h2>
      <p style="font-size: 16px;">Your product has been sold successfully.</p>
      <p style="font-size: 16px;"><strong>Item:</strong> ${cartItem.brand ? cartItem.brand : ''} ${cartItem.model ? cartItem.model : ''}</p>
      <p style="font-size: 16px;"><strong>Buyer:</strong> ${auth.user.name}</p>
      <p style="font-size: 16px;"><strong>Buyer Phone:</strong> ${auth.user.phone}</p>
      <p style="font-size: 16px;"><strong>Delivery Address:</strong> ${address}</p>
      <p style="font-size: 16px;"><strong>Price:</strong> <span style="color: #4CAF50;">${cartItem.price}</span></p>
    </div>
  `
        })
      }
      await axiosPrivate.delete('/cart/clear');


      await updateCartSize();


      setSnackbarOpen(true);
      setLoading(false);

      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Error clearing the cart:', error);
      alert('There was an error processing your order. Please try again.');
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleCloseErrorSnackbar = () => {
    setErrorSnackbarOpen(false); // Close error snackbar
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: 'orange' }}>
        Confirm Your Order
      </Typography>

      <Grid container spacing={2}>
        {cartItems.map((item) => (
          <Grid item xs={12} key={item._id}>
            <Paper sx={{ p: 2, backgroundColor: 'grey', color: 'white', width: '100%', marginBottom: '8px' }}>
              <Typography variant="body1">
                {item.brand} {item.model}
              </Typography>
              <Typography variant="body1">
                ${item.price.toFixed(2)}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography
          variant="h6"
          sx={{
            border: '5px solid',
            borderColor: 'orange',
            color: 'white',
            display: 'inline-block',
            padding: '8px 16px',
            borderRadius: '4px',
          }}
        >
          Total: ${totalSum.toFixed(2)}
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Delivery Address"
          InputLabelProps={{
            shrink: false,
            style: { display: 'none' },
          }}
          sx={{
            mt: 3,
            mb: 3,
            backgroundColor: 'white',
            input: {
              color: 'black',
            },
          }}
        />

        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <RadioGroup
            row
            aria-label="payment-method"
            name="payment-method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            sx={{ justifyContent: 'center' }} // Center the radio buttons
          >
            <FormControlLabel
              value="online"
              control={<Radio sx={{ color: 'white', '&.Mui-checked': { color: 'orange' } }} />}
              label={<Typography sx={{ color: 'white' }}>Online Payment</Typography>}
            />
            <FormControlLabel
              value="cod"
              control={<Radio sx={{ color: 'white', '&.Mui-checked': { color: 'orange' } }} />}
              label={<Typography sx={{ color: 'white' }}>Cash on Delivery</Typography>}
            />
          </RadioGroup>
        </FormControl>

        <Box sx={{ textAlign: 'center', mt: 2 }}> {/* New line for confirm button */}
          <Button
            variant="contained"
            sx={{
              width: '250px',
              height: '50px',
              fontSize: '1.4rem',
              backgroundColor: 'green',
              '&:hover': {
                backgroundColor: 'red',
              },
            }}
            onClick={handleConfirmOrder}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Confirm'}
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        message="Your order is confirmed! Redirecting to homepage..."
        autoHideDuration={3000}
      />

      <Snackbar
        open={errorSnackbarOpen}
        onClose={handleCloseErrorSnackbar}
        message="Please enter a delivery address."
        autoHideDuration={3000}
        sx={{ backgroundColor: 'red' }} // Optional: style the snackbar
      />
    </Box>
  );
};

export default PaymentPage;
