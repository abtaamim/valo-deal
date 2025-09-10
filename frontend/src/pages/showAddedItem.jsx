import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Grid, CircularProgress, Typography } from '@mui/material';
import { DeleteOutlineOutlined } from '@mui/icons-material';
import { useAuth } from '../context/auth';
import { useCart } from '../context/CartContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useSearch } from "../context/SearchContext";
import { Toaster, toast } from 'sonner';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import ListingCard from './CustomItemCard';
const AddedItemList = () => {
  const [items, setItems] = useState();
  const [auth] = useAuth();
  const { updateCartSize } = useCart();
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const axiosPrivate = useAxiosPrivate();

  const [showLoading, setShowLoading] = useState(false);


  const fetchItems = async () => {
    try {
      setShowLoading(true);
      setLoading(true); 
      const res = await axiosPrivate.get('/product/my-products');
      setItems(res.data);
      
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      
        setLoading(false);
        setTimeout(() => setShowLoading(false), 300);
    }
  };

  useEffect(() => {

    fetchItems();
  }, [auth]);

  const [allItems, setAllItems] = useState([]);
  useEffect(() => {
    fetchItems
   }, []);

  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await axiosPrivate.delete(`/product/delete/${itemId}`);

      fetchItems();

      toast.success("Item deleted successfully"); 
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message || "Failed to delete the item"
      );
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
          {items?.length === 0 ? (
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                color: '#ff8c00',
                animation: 'fadeIn 1s ease-in-out',
              }}
            >
              You have not added any product
            </Typography>
          ) : (
            null
          )}
          <Grid container spacing={2} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <ListingCard
              items={items}
              button={<DeleteOutlineOutlined sx={{ color: 'red' }} />}
              handleClickOpen={(itemId) => handleDelete(itemId)}
              my_added = {true}
            />
          </Grid>
        </Box>
      )}
      <Toaster richColors />
    </Box>
    </>
  );
};

export default AddedItemList;
