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
          console.log('Error:', error);
        } finally {
          setLoading(false);
          setTimeout(() => setShowLoading(false), 300);
        }
      }
    };
    fetchResults();
  }, [keyword, setValues]);

  const [allreadyincart, setAllreadyincart] = useState(0);

  const handleCart = async (itemId, itemType) => {
    try {
      if (auth.user) {
        await axiosPrivate.post(`/cart/${itemType}/${itemId}`);
        updateCartSize();
        toast.success('Item added to your cart successfully');
      } else {
        navigate('/login');
      }
    } catch (error) {
      setAllreadyincart(1);
      console.error(`Error adding to cart ${itemType}:`, error);
      toast.error('This item is already in your cart');
    }
  };

  const [sellerMap, setSellerMap] = useState(new Map());
  const fetchSellerInfo = async () => {
    try {
      const sellerIds = new Set(values.results.map((item) => item.sellerId));
      const sellerPromises = Array.from(sellerIds).map((sellerId) =>
        axiosPrivate.get(`/api/v1/auth/seller-info/${sellerId}`)
      );
      const sellerResponses = await Promise.all(sellerPromises);
      const newSellerMap = new Map();
      sellerResponses.forEach((response) => {
        const sellerData = response.data.seller;
        newSellerMap.set(sellerData.sellerId, sellerData);
      });
      setSellerMap(newSellerMap);
    } catch (error) {
      console.error('Error fetching seller info:', error);
    }
  };

  useEffect(() => {
    fetchSellerInfo();
  }, []);

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
                handleClickOpen={(itemId, itemType) => handleCart(itemId, itemType)}
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
