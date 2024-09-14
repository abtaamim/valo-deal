import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tooltip, Box, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, IconButton } from '@mui/material';
import AddShoppingCartSharpIcon from '@mui/icons-material/AddShoppingCartSharp';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/auth';
import { useCart } from '../context/CartContext';
import { useParams } from 'react-router-dom';
import ListingCard from './CustomItemCard';
import { Toaster, toast } from 'sonner';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
const ShowSubCatItem = () => {
  const [items, setItems] = useState([]);
  const [auth] = useAuth();
  const { category, subCat } = useParams();
  const { updateCartSize } = useCart();
  const axiosPrivate = useAxiosPrivate();
  const fetchItems = async () => {
    try {

      let response = null;
      if (subCat.toLowerCase() === 'mobile phone accessories') {
        response = await axiosPrivate.get(`/sell/mobileAcc/${subCat}`);
        setItems(response.data.mobileAcc);
      }
      else if (subCat.toLowerCase() === 'mobile phones') {
        response = await axiosPrivate.get(`/sell/${category.toLowerCase()}/${subCat}`);
        setItems(response.data.mobiles);
      }


      else {
        response = await axiosPrivate.get(`/sell/${category.toLowerCase()}/${subCat}`);
        setItems(response.data[category.toLowerCase()]);
      }

      console.log('Mobiles Response:', response.data);



    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
    updateCartSize();
    setItems("")
  }, [subCat, auth]);

  const catLow = category.toLowerCase();
  const handleRecentlyView = async (itemId, catLow) => {
    try {
      await axiosPrivate.post(`/recentlyViewed/${catLow}/${itemId}`);
    } catch (error) {
      console.error(`Error viewing item:`, error);
    }
  };

  const handleCart = async (itemId, catLow) => {
    try {
      await axiosPrivate.post(`/cart/${catLow}/${itemId}`);
      // fetchItems(); // Refresh items after deletion
      await updateCartSize();

      (toast.success('item added to your cart successfully'))

    } catch (error) {
      auth.user ? (
        toast.error('allready in your cart')
      ) : (toast.error('Sign in to add to cart'))
      console.error(`Error adding to cart ${catLow}:`, error);
    }
  };

  return (
    <>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          {subCat}
        </Typography>
        <Grid container spacing={2} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {/* Render both mobiles and computers */}
          {items?.length === 0 ? (
            <Typography variant="h6" color="text.secondary">
              No items available in this category.
            </Typography>
          ) :
            (

              <>
                <ListingCard items={items} button={<AddShoppingCartSharpIcon sx={{ color: 'rgb(0, 6, 12)' }} />}
                  handleClickOpen={(itemId, itemType) => handleCart(itemId, itemType)}
                />
                <Toaster richColors />

              </>
            )
          }
        </Grid>
      </Box>
    </>
  );
};

export default ShowSubCatItem;