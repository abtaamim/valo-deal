import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Paper, CircularProgress, Snackbar, Radio, RadioGroup, FormControlLabel, FormControl, Avatar } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/auth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const SingleItemPaymentPage = () => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  const [auth] = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const { item } = location.state || {};

  useEffect(() => {
    if (!item) {
      navigate('/');
    }
  }, [item, navigate]);

  const handleConfirmOrder = async () => {
    if (!address) {
      setErrorSnackbarOpen(true);
      return;
    }
    setLoading(true);

    try {
      await axiosPrivate.post('/order/setOrder', {
        buyerId: auth.user._id,
        sellerId: item.sellerId,
        itemType: item.itemType,
        itemId: item._id,
        soldDate: new Date(),
        deliveryAddress: address,
      });

      await axiosPrivate.post('/send/mail', {
        to: auth.user.email,
        subject: 'Your order has been placed successfully',
        mailBody: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #4CAF50;">Your Order Confirmation</h2>
            <p style="font-size: 16px;">Your order has been placed successfully.</p>
            <p style="font-size: 16px;"><strong>Item:</strong> ${item.brand || ''} ${item.model || ''}</p>
            <p style="font-size: 16px;"><strong>Price:</strong> <span style="color: #4CAF50;">${item.price}</span></p>
          </div>
        `,
      });

      const res = await axiosPrivate.get(`/api/v1/auth/seller-info/${item.sellerId}`);
      const sellerMail = res?.data.seller.email;

      await axiosPrivate.post('/send/mail', {
        to: sellerMail,
        subject: 'One of your products has been sold',
        mailBody: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #4CAF50;">Product Sold Notification</h2>
            <p style="font-size: 16px;">Your product has been sold successfully.</p>
            <p style="font-size: 16px;"><strong>Item:</strong> ${item.brand || ''} ${item.model || ''}</p>
            <p style="font-size: 16px;"><strong>Buyer:</strong> ${auth.user.name}</p>
            <p style="font-size: 16px;"><strong>Buyer Phone:</strong> ${auth.user.phone}</p>
            <p style="font-size: 16px;"><strong>Delivery Address:</strong> ${address}</p>
            <p style="font-size: 16px;"><strong>Price:</strong> <span style="color: #4CAF50;">${item.price}</span></p>
          </div>
        `,
      });

      setSnackbarOpen(true);
      setLoading(false);

      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Error processing the order:', error);
      alert('There was an error processing your order. Please try again.');
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleCloseErrorSnackbar = () => {
    setErrorSnackbarOpen(false);
  };

  return (
    <Paper elevation={3} sx={{ padding: '20px', margin: '20px auto', maxWidth: '800px', backgroundColor: '#333' }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: 'orange' }}>
        Order Summary
      </Typography>
      {item && (
        <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
          <Avatar
            src={item.imgUrl[0]}
            alt={item.brand}
            sx={{ width: 150, height: 150, margin: '0 auto' }}
          />
          <Typography variant="h6" sx={{ marginTop: '10px', color: 'white', fontWeight: 'bold' }}>
            {item.brand} {item.model}
          </Typography>
          <Typography variant="body1" sx={{ color: 'orange', fontWeight: 'bold', marginTop: '5px' }}>
            Price: ${item.price}
          </Typography>
        </Box>
      )}
      <TextField
        fullWidth
      
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        margin="normal"
        placeholder="Enter your delivery address"
        sx={{
          backgroundColor: '#fff', 
          borderRadius: '4px',
          '& .MuiInputBase-input': {
            color: 'black', 
          },
          '& .MuiInputBase-input::placeholder': {
            color: '#555',
            opacity: 1, 
          },
          '& .MuiInputLabel-root': {
            color: 'white', 
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#666', 
            },
            '&:hover fieldset': {
              borderColor: 'orange', 
            },
            '&.Mui-focused fieldset': {
              borderColor: 'orange',
            },
          },
        }}
      />
      
      <FormControl component="fieldset" margin="normal">
        <Typography variant="h6" sx={{ color: 'white' }}>Payment Method</Typography>
        <RadioGroup
          aria-label="payment-method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
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
      <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
        <Button
          variant="contained"
          onClick={handleConfirmOrder}
          disabled={loading}
          sx={{
            backgroundColor: 'green',
            '&:hover': {
              backgroundColor: 'darkgreen',
            },
            marginRight: '10px',
          }}
        >
          {loading ? <CircularProgress size={24} /> : 'Confirm Order'}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
      </Box>
      <Snackbar
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        message="Order placed successfully! Redirecting to homepage..."
        autoHideDuration={3000}
      />
      <Snackbar
        open={errorSnackbarOpen}
        onClose={handleCloseErrorSnackbar}
        message="Please enter a delivery address!"
        autoHideDuration={3000}
      />
    </Paper>
  );
};

export default SingleItemPaymentPage;
