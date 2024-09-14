import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, IconButton } from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useAuth } from '../context/auth';
import { useCart } from '../context/CartContext';
import { formatDistanceToNow } from 'date-fns';
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
  const axiosPrivate = useAxiosPrivate();

  const handleClickOpen = (itemId, itemType) => {
    setOpen(true);
    setSelectedItemId(itemId);
    setSelectedItemType(itemType);
    // handleDialog;
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItemId(null);
    setSelectedItemType(null);
  };

  const fetchItems = async () => {
    try {
      const mobilesResponse = await axiosPrivate.get('/sell/mobiles');
      const computersResponse = await axiosPrivate.get('/sell/added-computers');
      const electronicResponse = await axiosPrivate.get('/sell/added-electronics');
      const vehicleResponse = await axiosPrivate.get('/sell/added-vehicles');
      setItems({
        mobiles: mobilesResponse.data.mobiles || [], computers: computersResponse?.data.computers || [],
        electronics: electronicResponse?.data.electronics || [], vehicles: vehicleResponse?.data.vehicles || []
      });
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    updateCartSize();
    fetchItems();

  }, [auth]);

  const [allItems, setAllItems] = useState([]);
  useEffect(() => {
    setAllItems([...items.mobiles, ...items.computers, ...items.electronics, ...items.vehicles]);
    console.log('ali///', allItems);
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
        My added items
      </Typography>

      {/* <Grid container spacing={2} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        
        {Object.keys(items).map((key) => (
          items[key]?.map((item) => (
            <Grid item key={item._id} xs={12} sm={6} md={4} lg={3} >
              <ListingCard item={item} onDelete={(itemId) => handleDelete(itemId, key)} />
            </Grid>
          ))
        ))}
      </Grid> */}
      {allItems?.length > 0 ?
        <ListingCard items={allItems} handleClickOpen={handleClickOpen}
          button={<DeleteOutlinedIcon sx={{ color: 'rgb(0, 6, 12)' }} />}
        />
        : <Typography variant="h4" sx={{ textAlign: 'center', color: 'white' }}>No items added yet</Typography>
      }
      <CustomDialog handleClose={handleClose} selectedItemId={selectedItemId}
        handleDelete={(itemId, itemType) => handleDelete(itemId, itemType)}
        dialog_title="delete this item from your list" open={open} selectedItemType={selectedItemType}
      />
    </Box>
  );
};

export default AddedItemList;