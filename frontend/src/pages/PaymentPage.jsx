import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Grid, Button, Paper, CircularProgress, Snackbar, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';


const PaymentPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false); // State for error snackbar
  const navigate = useNavigate();
  const { updateCartSize } = useCart();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('https://valo-deal-backend.vercel.app/cart/fetchitems');
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
      await axios.delete('https://valo-deal-backend.vercel.app/cart/clear');
      //setCartItems([]);
      await updateCartSize();

      // const response = await axios.get('https://valo-deal-backend.vercel.app/cart/fetchitems');
      // setCartItems(response.data.cartItems);

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
