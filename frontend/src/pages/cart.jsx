import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Button, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RemoveShoppingCartOutlinedIcon from '@mui/icons-material/RemoveShoppingCartOutlined';
import { useAuth } from '../context/auth';
import { useCart } from '../context/CartContext';
import CustomDialog from './CustomDialog';
import ListingCard from './CustomItemCard';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [auth] = useAuth();
  const { updateCartSize } = useCart();
  const navigate = useNavigate();

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false); 

  const handleClickOpen = (itemId) => {
    setOpen(true);
    setSelectedItemId(itemId);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItemId(null);
  };

  const fetchItems = async () => {
    try {
      const token = auth?.token;
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.get('http://localhost:8080/cart/fetchitems');
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
      await axios.delete(`http://localhost:8080/cart/${itemId}`);
      fetchItems();
      await updateCartSize();
      handleClose();
      setSnackbarOpen(true); 
    } catch (error) {
      console.error(`Error deleting item:`, error);
    }
  };

  const handleBuyNow = () => {
    navigate('/payment');
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const totalSum = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <>
      <Box 
        sx={{ 
          p: 2, 
          pl: 0,  
          pr: 10   
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ 
            color: 'orange', 
            fontWeight: 'bold', 
            padding: '8px',             
            textAlign: 'center', 
          }}
        >
          My Cart 🛒
        </Typography>
        
        
        
        <ListingCard items={cartItems} handleClickOpen={handleClickOpen}
          button={<RemoveShoppingCartOutlinedIcon sx={{ color: 'rgb(0, 6, 12)' }} />}
        />

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item>
              <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
                <Typography variant="h6" align="center" sx={{ color: 'white' }}>
                  Total: ${totalSum.toFixed(2)}
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: 'green',
                  color: 'white',
                  width: '200px', 
                  height: '60px', 
                  fontSize: '1.3rem', 
                  '&:hover': {
                    backgroundColor: 'darkgreen',
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
      
      <CustomDialog handleClose={handleClose} selectedItemId={selectedItemId} 
        handleDelete={handleDelete} dialog_title="This item will be removed from your cart"
        open={open}
      />

      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message="Item removed from cart"
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        ContentProps={{
          sx: {
            backgroundColor: 'grey',
            color: 'white',               
            fontWeight: 'bold',         
          },
        }}
      />
      
    </>
  );
};

export default CartPage;
