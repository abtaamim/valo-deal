import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Grid, CircularProgress, Typography } from '@mui/material';
import AddShoppingCartSharpIcon from '@mui/icons-material/AddShoppingCartSharp';
import { useAuth } from '../context/auth';
import { useCart } from '../context/CartContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useSearch } from "../context/SearchContext";
import { Toaster, toast } from 'sonner';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import ListingCard from './CustomItemCard';

const SearchPage = () => {
  const [values, setValues] = useSearch();
  const [auth] = useAuth();
  const { updateCartSize } = useCart();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { keyword } = useParams();

  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (keyword) {
        setShowLoading(true);
        setLoading(true);
        try {
          const res = await axiosPrivate.get(`/search/${keyword}`);
          setValues({ ...values, results: res.data.results });
        } catch (error) {
       //   console.log('Error:', error);
        } finally {
          setLoading(false);
          setTimeout(() => setShowLoading(false), 300);
        }
      }
    };
    fetchResults();
  }, [keyword, setValues]);


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
            {values.results.length === 0 ? (
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
                  mb: 2,
                }}
              >
                {values.results.length} product{values.results.length > 1 ? 's' : ''} found
              </Typography>
            )}
            <Grid container spacing={2} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <ListingCard
                items={values.results}
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

export default SearchPage;