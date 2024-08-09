import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, IconButton, Tooltip } from '@mui/material';

import RemoveShoppingCartOutlinedIcon from '@mui/icons-material/RemoveShoppingCartOutlined';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/auth';
import { useCart } from '../context/CartContext';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
const ListingCard = ({ item, onRemove }) => (
  <Card sx={{ width: '300px' }}>
    <CardMedia
      component="img"
      height="240"
      image={item.imgUrl}
      alt={`${item.brand} ${item.model}`}
      src={item.imgUrl}
    />
    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
      <Typography gutterBottom variant="h5" component="div">
        {item.brand} {item.model}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Condition: {item.condition}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {item.authenticity ? `Authenticity: ${item.authenticity}` : ''}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Price: ${item.price}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Description: {item.description}
      </Typography>
      {/* <Typography variant="body2" color="text.secondary">
        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
      </Typography> */}
    </CardContent>
    <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
      
      <Button size="small">View Details</Button>
      
      <IconButton onClick={() => onRemove(item._id)}>
        <RemoveShoppingCartOutlinedIcon sx={{color:'rgb(0, 6, 12)'}}/>
      </IconButton>

    </CardActions>
  </Card>
);

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
  }, []);

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
        <Grid container spacing={2} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {cartItems.map((item) => (
            <Grid item key={item._id} xs={12} sm={6} md={3}>
              <ListingCard item={item} onRemove={(itemId) => handleClickOpen(itemId)} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: 'rgb(0, 6,12)',
            borderRadius: '5px',
          },
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ color: "rgb(194, 228, 255)" }}>
          {"This item will be remove from your cart"}
        </DialogTitle>

        <DialogActions>
          <Button variant='outlined'  sx={{borderColor:'rgb(194, 228, 255)', color:'rgb(194, 228, 255)', mb:'15px' }} onClick={handleClose}>Cancel</Button>
          <Button variant='outlined' sx={{color:'red', borderColor:'red', mb:'15px' }} onClick={() => handleDelete(selectedItemId)} autoFocus>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CartPage;
