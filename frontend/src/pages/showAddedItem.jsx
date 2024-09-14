import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useAuth } from '../context/auth';
import { useCart } from '../context/CartContext';
import CustomDialog from './CustomDialog';
import ListingCard from './CustomItemCard';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const AddedItemList = () => {
  const [items, setItems] = useState({ mobiles: [], computers: [], electronics: [], vehicles: [] });
  const [auth] = useAuth();
  const { updateCartSize } = useCart();
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const axiosPrivate = useAxiosPrivate();

  const handleClickOpen = (itemId, itemType) => {
    setOpen(true);
    setSelectedItemId(itemId);
    setSelectedItemType(itemType);

  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItemId(null);
    setSelectedItemType(null);
  };

  const fetchItems = async () => {
    try {
      setLoading(true); // Set loading before fetching
      const mobilesResponse = await axiosPrivate.get('/sell/mobiles');
      const computersResponse = await axiosPrivate.get('/sell/added-computers');
      const electronicResponse = await axiosPrivate.get('/sell/added-electronics');
      const vehicleResponse = await axiosPrivate.get('/sell/added-vehicles');
      setItems({
        mobiles: mobilesResponse.data.mobiles || [],
        computers: computersResponse?.data.computers || [],
        electronics: electronicResponse?.data.electronics || [],
        vehicles: vehicleResponse?.data.vehicles || []
      });
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    updateCartSize();
    fetchItems();
  }, [auth]);

  const [allItems, setAllItems] = useState([]);
  useEffect(() => {
    setAllItems([...items.mobiles, ...items.computers, ...items.electronics, ...items.vehicles]);
  }, [items]);

  const handleDelete = async (itemId, itemType) => {
    try {
      await axiosPrivate.delete(`/sell/${itemType}/${itemId}`);

      fetchItems(); 
      handleClose(); 

    } catch (error) {
      console.error(`Error deleting ${itemType}:`, error);
    }
  };
  

  const itemCount = allItems.length;

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: 'center',
          color: '#ff8300',
          fontSize: '1.5rem',
          fontWeight: 'bold',
        }}
      >
        My Added Items
      </Typography>


{loading ? (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '70vh', 
    }}
  >
    <CircularProgress sx={{ color: '#ff8300' }} /> 
  </Box>
) : itemCount === 0 ? (
  <Typography
    variant="h6"
    sx={{
      textAlign: 'center',
      color: 'lightgreen',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      animation: 'fadeIn 2s ease-in-out',
    }}
  >
    You have no added items
  </Typography>
) : (
  <>
    <Typography
      variant="h6"
      sx={{
        textAlign: 'center',
        color: 'lightgreen',
        fontSize: '1.2rem',
        fontWeight: 'bold',
      }}
    >
      You have added {itemCount} item{itemCount > 1 ? 's' : ''}
    </Typography>
    <ListingCard
      items={allItems}
      handleClickOpen={handleClickOpen}
      button={<DeleteOutlinedIcon sx={{ color: 'rgb(0, 6, 12)' }} />}
    />
  </>
)}


      <CustomDialog
        handleClose={handleClose}
        selectedItemId={selectedItemId}

        handleDelete={(itemId, itemType) => handleDelete(itemId, itemType)}
        dialog_title="Delete this item from your list"
        open={open}
        selectedItemType={selectedItemType}
      />
    </Box>
  );
};

export default AddedItemList;
