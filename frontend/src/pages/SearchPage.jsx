import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Snackbar, Alert, Tooltip, Box, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, IconButton, ListItemButton } from '@mui/material';
import AddShoppingCartSharpIcon from '@mui/icons-material/AddShoppingCartSharp';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/auth';
import { useCart } from '../context/CartContext';
import { useNavigate, useParams } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Pagination from '@mui/material/Pagination';
import { useSearch } from "../context/SearchContext";
import { Toaster, toast } from 'sonner';

import CustomDialog from './CustomDialog';
import ListingCard from './CustomItemCard';
const SearchPage = () => {
  
  const [values, setValues] = useSearch();
  const [auth] = useAuth();
  const { updateCartSize } = useCart()
  const navigate = useNavigate();
  // const handleRecentlyView = async (itemId, itemType) => {
  //   try {
  //     await axios.post(`https://valo-deal-backend.vercel.app/recentlyViewed/${itemType}/${itemId}`);
  //   } catch (error) {
  //     console.error(`Error viewing item:`, error);
  //   }
  // };
  const { keyword } = useParams();
  console.log("keyword+++", keyword);

  useEffect(() => {
    const fetchResults = async () => {
      if (keyword) {
        try {
          const res = await axios.get(`https://valo-deal-backend.vercel.app/search/${keyword}`);
          setValues({ ...values, results: res.data.results });
        } catch (error) {
          console.log('Error:', error);
        }
      }
    };
    fetchResults();
  }, [keyword, setValues]);

  const [allreadyincart, setAllreadyincart] = useState(0);
  const [open, setOpen] = useState(false);


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const handleCart = async (itemId, itemType) => {
    try {
      if (auth.user) {
        await axios.post(`https://valo-deal-backend.vercel.app/cart/${itemType}/${itemId}`);
        // fetchItems(); // Refresh items after deletion
        updateCartSize();
        toast.success('item added to your cart successfully')
      }
      else {
        navigate('/login')
      }
      console.log(itemType)
    } catch (error) {
      setAllreadyincart(1);
      console.error(`Error adding to cart ${itemType}:`, error);
      toast.error('this item is already in your cart')
    }
  };
  const [sellerMap, setSellerMap] = useState(new Map());
  const fetchSellerInfo = async () => {
    try {

      // Use a Set to avoid duplicate seller IDs
      const sellerIds = new Set(values.results.map((item) => item.sellerId));

      const sellerPromises = Array.from(sellerIds).map((sellerId) =>
        axios.get(`https://valo-deal-backend.vercel.app/api/v1/auth/seller-info/${sellerId}`)
      );

      const sellerResponses = await Promise.all(sellerPromises);

      const newSellerMap = new Map();
      sellerResponses.forEach((response) => {
        const sellerData = response.data.seller;
        newSellerMap.set(sellerData.sellerId, sellerData);
      });
      console.log(newSellerMap)
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
      
      <ListingCard items={values.results}  button={<AddShoppingCartSharpIcon sx={{ color: 'rgb(0, 6, 12)' }} />}
        handleClickOpen={(itemId, itemType) => handleCart(itemId, itemType)}
      />
      < Toaster richColors />




    </>

  )
}

export default SearchPage;