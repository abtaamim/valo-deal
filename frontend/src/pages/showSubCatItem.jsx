import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tooltip, Box, Typography, Grid, CircularProgress, Card, CardMedia, CardContent, CardActions, Button, IconButton } from '@mui/material';
import AddShoppingCartSharpIcon from '@mui/icons-material/AddShoppingCartSharp';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/auth';
import { useCart } from '../context/CartContext';
import { useParams } from 'react-router-dom';
import ListingCard from './CustomItemCard';
import { Toaster, toast } from 'sonner';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { customAxios } from '../api/axiosPrivate';
import { useNavigate } from 'react-router-dom';
const ShowSubCatItem = () => {
  const [items, setItems] = useState([]);
  const [auth] = useAuth();
  const { category_id } = useParams();
  const { updateCartSize } = useCart();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  // const fetchItems = async () => {
  //   try {

  //     const res = await customAxios.get(`/product/category/${category_id}`);
  //     setItems(res.data);
  //   } catch (error) {
  //     console.error('Error fetching items:', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchItems();
  //   updateCartSize();
  //   setItems("")
  // }, [category_id, auth]);

  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (category_id) {
        setShowLoading(true);
        setLoading(true);
        try {
          const res = await customAxios.get(`/product/category/${category_id}`);
          setItems(res.data);
        } catch (error) {
          //   console.log('Error:', error);
        } finally {
          setLoading(false);
          setTimeout(() => setShowLoading(false), 300);
        }
      }
    };
    fetchResults();
  }, [category_id,auth]);

  const handleCart = async (itemId) => {
    try {
      const res = await axiosPrivate.post(`/cart/${itemId}`);
      await updateCartSize();
      toast.success(
        <div onClick={() => navigate("/cart")}>
          Item added to the cart! Click here to view your cart.
        </div>,
        { position: "bottom-right", autoClose: false }
      );

    } catch (error) {
      toast.error(`${error.response.data.message}`, { position: "bottom-right" });
      console.error(`Error adding to cart ${itemType}:`, error);
    }
  };


  return (
    <>
      <Box sx={{ p: 2 }}>
        {showLoading && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <CircularProgress sx={{ color: "#ff8c00", size: 50 }} />
          </Box>
        )}
        {!loading && !showLoading && (
          <Box>
            {items.length === 0 ? (
              <Typography
                variant="h6"
                sx={{
                  textAlign: 'center',
                  color: '#ff8c00',
                  animation: 'fadeIn 1s ease-in-out',
                }}
              >
                There are no products
              </Typography>
            ) : (
              <Typography
                variant="h6"
                sx={{
                  textAlign: 'center',
                  color: '#ff8c00',
                  animation: 'fadeIn 1s ease-in-out',
                  mb: 6,
                }}
              >
                {items.length} product{items.length > 1 ? 's' : ''} found
              </Typography>
            )}
            <Grid container spacing={2} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <ListingCard
                items={items}
                button={<AddShoppingCartSharpIcon sx={{ color: 'rgb(0, 6, 12)' }} />}
                handleClickOpen={(itemId) => handleCart(itemId)}
              />
            </Grid>
          </Box>
        )}
        <Toaster richColors />
      </Box>
    </>
  );
};

export default ShowSubCatItem;