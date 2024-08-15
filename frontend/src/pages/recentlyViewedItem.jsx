import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Divider, Box, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, IconButton, Tooltip, Container } from '@mui/material';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import RemoveShoppingCartOutlinedIcon from '@mui/icons-material/RemoveShoppingCartOutlined';
import DeleteIcon from '@mui/icons-material/Delete';

import { format } from 'date-fns';
import { useAuth } from '../context/auth';
//import { useCart } from '../context/CartContextContext';
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
        <RemoveShoppingCartOutlinedIcon sx={{ color: 'rgb(0, 6, 12)' }} />
      </IconButton>

    </CardActions>
  </Card>
);

const RecentlyViewedItemPage = () => {
  const [recentlyViewedItems, setrecentlyViewedItems] = useState([]);
  const [auth] = useAuth();


  const [selectedItemId, setSelectedItemId] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchItems, setSearchItems] = useState([]);
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

  const fetchSearchItems = async () => {
    try {
      const res = await axios.get('http://localhost:8080/search/fetch/searched-items');
      setSearchItems(res.data.searchedItems);

    } catch (e) {
      console.log(e);
    }
  }
  const fetchItems = async () => {
    try {
      const token = auth?.token;
      console.log(token);
      if (!token) {
        throw new Error("No token found");
      }
      // const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get('https://valo-deal-backend.vercel.app/recentlyViewed/fetchitems')
      setrecentlyViewedItems(response.data.recentlyViewedItems);


    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };
  useEffect(() => {
    fetchSearchItems();
    fetchItems();

  }, [auth]);

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`https://valo-deal-backend.vercel.app/recentlyViewed/${itemId}`);
      fetchItems();

      handleClose();
    } catch (error) {
      console.error(`Error deleting ${itemType}:`, error);
    }
  };
  console.log(searchItems?.length)
  const deleteSearch = async (itemId) => {
    try {
      console.log(itemId)
      await axios.delete(`http://localhost:8080/search/delete/${itemId}`);
      fetchSearchItems();
    } catch (error) {
      console.error('Error deleting searched item:', error);
    }
  }
  //setSearchItems(.searchedItems)
  return (
    <Box sx={{ bgcolor: 'rgb(34, 33, 33)', p:'0', m:'0' }}>
      <Box display= "flex" alignItems= "center"
       justifyContent= "center" flexDirection= "column"
      sx={{   }}>
        <Box sx={{
          width: '100%', maxWidth: 900, bgcolor: 'rgb(34, 33, 33)',
          border: ' 1px solid grey', mt:'10px'
        }}>
          <Typography variant='h4' gutterBottom sx={{color: 'rgb(227, 227, 227)' }}>
            SEARCHED ITEMS
          </Typography>

          {searchItems?.map((searchItem) => (

            // <List>
            <Box>

              <ListItem sx={{ height: '39px' }}>
                <Typography sx={{ mr: '30px', color: 'rgba(230, 230, 230, 0.788)' }}>
                  {format(searchItem.searchedAt, 'hh:mm a')}
                </Typography>
                <Tooltip title={`click to search ${searchItem.searchTerm}`}>
                <ListItemButton>
                  <Typography sx={{ color: 'rgb(227, 227, 227)' }}>
                    {searchItem.searchTerm}
                  </Typography>
                </ListItemButton>
                </Tooltip>
                <IconButton onClick={() => deleteSearch(searchItem.id)}>
                  <DeleteIcon sx={{ color: 'rgba(230, 230, 230, 0.788)',
                   ' &:hover':{
                      color: 'rgb(255, 0, 0)',
                    }
                   }} />
                </IconButton>

              </ListItem>
              <Divider sx={{ border:  ' 0.5px solid grey '}} />
            </Box>

            // </List>



          ))

          }
        </Box>
      </Box>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom sx={{color: 'rgb(227, 227, 227)' }}>
          recentlyViewed
        </Typography>
        <Grid container spacing={2}  sx={{ flexWrap: 'wrap', gap: 2, ml:'20px' }}>
          {recentlyViewedItems.map((item) => (
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
          {"This item will be remove from your recentlyViewed"}
        </DialogTitle>

        <DialogActions>
          <Button variant='outlined' sx={{ borderColor: 'rgb(194, 228, 255)', color: 'rgb(194, 228, 255)', mb: '15px' }} onClick={handleClose}>Cancel</Button>
          <Button variant='outlined' sx={{ color: 'red', borderColor: 'red', mb: '15px' }} onClick={() => handleDelete(selectedItemId)} autoFocus>
            Remove
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default RecentlyViewedItemPage;
