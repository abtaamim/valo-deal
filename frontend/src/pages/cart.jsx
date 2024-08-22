import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, IconButton, Tooltip } from '@mui/material';

import RemoveShoppingCartOutlinedIcon from '@mui/icons-material/RemoveShoppingCartOutlined';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/auth';
import { useCart } from '../context/CartContext';
import CustomDialog from './CustomDialog';
import ListingCard from './CustomItemCard';

import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';


const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [auth] = useAuth();
  const { updateCartSize } = useCart();

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [open, setOpen] = useState(false);
  const handleClickOpen = (itemId) => {
    setOpen(true);
    setSelectedItemId(itemId);
    handleDialog;
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItemId(null);
  };

  const handleDialog = () => {

  }

  const fetchItems = async () => {
    try {
      const token = auth?.token;
      console.log(token);
      if (!token) {
        throw new Error("No token found");
      }
      // const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get('https://valo-deal-backend.vercel.app/cart/fetchitems')
      setCartItems(response.data.cartItems);


    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };
  useEffect(() => {
    fetchItems();
  }, [auth]);

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`https://valo-deal-backend.vercel.app/cart/${itemId}`);
      fetchItems();
      await updateCartSize();
      handleClose();
    } catch (error) {
      console.error(`Error deleting ${itemType}:`, error);
    }
  };

  return (
    <>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          cart
        </Typography>
        
        <ListingCard items={cartItems} handleClickOpen={handleClickOpen}
          button={<RemoveShoppingCartOutlinedIcon sx={{ color: 'rgb(0, 6, 12)' }} />}
        />
      </Box>
      
      <CustomDialog handleClose={handleClose} selectedItemId={selectedItemId} 
        handleDelete={handleDelete} dialog_title= "This item will be removed from your cart"
        open={open}
      />
    </>
  );
};

export default CartPage;
